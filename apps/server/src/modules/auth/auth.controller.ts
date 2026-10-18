import type { RequestMeta } from 'types/server'
import { Meta } from 'common/decorators/meta.decorator'
import type { AuthenticatedUser } from 'types/auth'

import {
	Controller,
	Get,
	Post,
	Delete,
	Param,
	ParseUUIDPipe,
	Req,
	HttpCode,
	HttpStatus,
	UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { UserRole } from '@repo/prisma'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { SessionService } from './session.service'
import { Roles } from 'common/decorators/roles.decorator'
import { AuthenticatedUserResponse } from './dto/auth.dto'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CurrentUser } from 'common/decorators/current-user.decorator'
import { AllowUnregisteredUser } from 'common/decorators/allow-unregistered-user.decorator'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionService: SessionService,
	) {}

	@Post('login')
	@AllowUnregisteredUser()
	@ApiEndpoint({
		method: 'POST',
		endpoint: 'POST /api/v1/auth/login',
		summary: 'Login with Firebase ID Token',
		description: 'Authenticates the Firebase user and returns the authenticated user.',
		type: AuthenticatedUserResponse,
	})
	login(@CurrentUser() user: AuthenticatedUser, @Meta() meta: RequestMeta, @Req() req: Request) {
		return this.authService.login(user, meta, {
			token: req.token,
			decodedToken: req.decodedToken,
			ip: req.context?.ip,
			userAgent: req.context?.userAgent,
		})
	}

	@Get('me')
	@ApiEndpoint({
		method: 'GET',
		endpoint: 'GET /api/v1/auth/me',
		summary: 'Get current authenticated user',
		description: 'Returns the currently authenticated user.',
		type: AuthenticatedUserResponse,
	})
	me(@CurrentUser() user: AuthenticatedUser) {
		return user
	}

	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiEndpoint({
		method: 'POST',
		endpoint: 'POST /api/v1/auth/logout',
		summary: 'Logout current user',
		description: 'Revokes the current user session.',
	})
	async logout(@Req() req: Request) {
		if (req.token) await this.sessionService.revokeSession(req.token)
	}

	@Get('sessions')
	@Roles(UserRole.ADMIN)
	@ApiEndpoint({
		method: 'GET',
		endpoint: 'GET /api/v1/auth/sessions',
		summary: 'Get active and historical sessions',
		description: 'Returns a list of active and historical sessions (Super Admin & Admin).',
	})
	async getSessions(@CurrentUser() user: AuthenticatedUser) {
		if (!user.id) throw new UnauthorizedException('Not authenticated')

		return this.sessionService.getSessionsForUser(user)
	}

	@Delete('sessions/:id')
	@Roles(UserRole.ADMIN)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiEndpoint({
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/auth/sessions/:id',
		summary: 'Revoke session by ID',
		description: 'Revokes a specific session.',
	})
	async revokeSession(
		@Param('id', ParseUUIDPipe) sessionId: string,
		@CurrentUser() user: AuthenticatedUser,
	) {
		if (!user.id) throw new UnauthorizedException('Not authenticated')

		await this.sessionService.revokeSessionById(sessionId, user.id)
	}
}
