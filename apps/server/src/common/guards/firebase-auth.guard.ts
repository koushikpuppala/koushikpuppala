import type { Request } from 'express'
import type { RequestMeta } from 'types/server'
import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { Reflector } from '@nestjs/core'
import { fromFirebaseToken, toAuthenticatedUser, UserAccountService } from 'modules/user'
import { UserStatus } from '@repo/prisma'
import { FirebaseService } from 'firebase/firebase.service'
import { SessionService } from 'modules/auth/session.service'
import { IS_PUBLIC_KEY } from 'common/decorators/public.decorator'
import { Injectable, UnauthorizedException, HttpException } from '@nestjs/common'
import { ALLOW_UNREGISTERED_USER_KEY } from 'common/decorators/allow-unregistered-user.decorator'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly firebase: FirebaseService,
		private readonly accounts: UserAccountService,
		private readonly sessionService: SessionService,
	) {}

	private extractBearerToken(authorization?: string): string {
		if (!authorization) throw new UnauthorizedException('Authorization header is missing')

		if (!authorization.startsWith('Bearer '))
			throw new UnauthorizedException('Invalid authorization header')

		const token = authorization.slice(7).trim()

		if (!token) throw new UnauthorizedException('Bearer token is missing')

		return token
	}

	private async verifyFirebaseToken(token: string, meta: RequestMeta) {
		try {
			const decoded = await this.firebase.verifyIdToken(token, true, meta)

			// Unverified emails are only allowed for accounts that already exist in the database,
			// which were created by an admin rather than through self sign-up.
			if (!decoded.email_verified) {
				const userInDb = await this.accounts.findByFirebaseUid(decoded.uid, meta)

				if (!userInDb) throw new UnauthorizedException('Email address is not verified.')
			}

			return decoded
		} catch (error) {
			if (error instanceof HttpException) throw error

			// Hide Firebase's error details so callers cannot tell why a token was rejected.
			throw new UnauthorizedException('Invalid or expired authentication token')
		}
	}

	private metadata(context: ExecutionContext, key: string) {
		return this.reflector.getAllAndOverride<boolean>(key, [
			context.getHandler(),
			context.getClass(),
		])
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (this.metadata(context, IS_PUBLIC_KEY)) return true

		const request = context.switchToHttp().getRequest<Request>()

		const token = this.extractBearerToken(request.headers.authorization)

		const meta: RequestMeta = { requestId: request.requestId, endpoint: request.originalUrl }

		const decoded = await this.verifyFirebaseToken(token, meta)

		// Firebase's revocation check covers revoked refresh tokens; this covers sessions
		// signed out or revoked through the API, which Firebase does not know about.
		const isRevoked = await this.sessionService.isSessionRevoked(token)

		if (isRevoked) throw new UnauthorizedException('Session has been revoked or expired.')

		request.token = token
		request.decodedToken = decoded

		// Routes such as first sign-in run before the user row exists, so they get the token's identity.
		if (this.metadata(context, ALLOW_UNREGISTERED_USER_KEY)) {
			request.user = fromFirebaseToken(decoded)

			return true
		}

		const user = await this.accounts.findByFirebaseUid(decoded.uid, meta)

		if (!user) throw new UnauthorizedException('User is not registered. Please sign in first.')

		if (user.status !== UserStatus.ACTIVE)
			throw new UnauthorizedException('Your account is inactive.')

		request.user = toAuthenticatedUser(user)

		return true
	}
}
