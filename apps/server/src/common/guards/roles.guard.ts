import type { Request } from 'express'
import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { UserRole } from '@repo/prisma'
import { Reflector } from '@nestjs/core'
import { LoggerService } from 'common/logger/logger.service'
import { ROLES_KEY } from 'common/decorators/roles.decorator'
import { IS_PUBLIC_KEY } from 'common/decorators/public.decorator'
import { ForbiddenException, Injectable } from '@nestjs/common'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly logger: LoggerService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		if (isPublic) return true

		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		if (!requiredRoles?.length) return true

		const request = context.switchToHttp().getRequest<Request>()

		const user = request.user

		if (!user?.role) throw new ForbiddenException('User not authenticated.')

		if (user.role === UserRole.ADMIN) return true

		if (requiredRoles.includes(user.role)) return true

		this.logger.warn('Access denied', RolesGuard.name, {
			requestId: request.requestId,
			userId: user.id,
			role: user.role,
			requiredRoles,
			endpoint: request.originalUrl,
		})

		throw new ForbiddenException('You do not have permission to access this resource.')
	}
}
