import type { Request } from 'express'
import type { AuthenticatedUser } from 'types/express'
import type { DecodedIdToken } from 'firebase-admin/auth'
import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { Reflector } from '@nestjs/core'
import { UserService } from 'modules/user'
import { AuthProvider, UserStatus } from '@repo/prisma'
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
		private readonly userService: UserService,
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

	private async verifyFirebaseToken(token: string, meta: { requestId: string; endpoint: string }) {
		try {
			const decoded = await this.firebase.verifyIdToken(token, true, meta)

			if (!decoded.email_verified) {
				const userInDb = await this.userService.findByFirebaseUid(decoded.uid, meta)

				if (!userInDb) throw new UnauthorizedException('Email address is not verified.')
			}

			return decoded
		} catch (error) {
			if (error instanceof HttpException) throw error

			throw new UnauthorizedException('Invalid or expired authentication token')
		}
	}

	private metadata(context: ExecutionContext, key: string) {
		return this.reflector.getAllAndOverride<boolean>(key, [
			context.getHandler(),
			context.getClass(),
		])
	}

	private mapProvider(provider: DecodedIdToken['firebase']['sign_in_provider']): AuthProvider {
		switch (provider) {
			case 'google.com':
				return AuthProvider.GOOGLE
			case 'password':
				return AuthProvider.PASSWORD
			default:
				return AuthProvider.PASSWORD
		}
	}

	private toFirebaseAuthenticatedUser(decoded: DecodedIdToken): AuthenticatedUser {
		return {
			firebaseUid: decoded.uid,
			email: decoded.email ?? '',
			displayName: decoded.name,
			photoUrl: decoded.picture,
			emailVerified: decoded.email_verified ?? false,
			provider: this.mapProvider(decoded.firebase.sign_in_provider),
		}
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (this.metadata(context, IS_PUBLIC_KEY)) return true

		const request = context.switchToHttp().getRequest<Request>()

		const token = this.extractBearerToken(request.headers.authorization)

		const meta = { requestId: request.requestId, endpoint: request.originalUrl }

		const decoded = await this.verifyFirebaseToken(token, meta)

		const isRevoked = await this.sessionService.isSessionRevoked(token)

		if (isRevoked) throw new UnauthorizedException('Session has been revoked or expired.')

		request.token = token
		request.decodedToken = decoded

		if (this.metadata(context, ALLOW_UNREGISTERED_USER_KEY)) {
			request.user = this.toFirebaseAuthenticatedUser(decoded)

			return true
		}

		const user = await this.userService.findByFirebaseUid(decoded.uid, meta)

		if (!user) throw new UnauthorizedException('User is not registered. Please sign in first.')

		if (user.status !== UserStatus.ACTIVE)
			throw new UnauthorizedException('Your account is inactive.')

		request.user = this.userService.toAuthenticatedUser(user)
		return true
	}
}
