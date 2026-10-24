import type { AuthenticatedUser } from 'types/auth'

import { createHash } from 'node:crypto'
import { DecodedIdToken } from 'firebase-admin/auth'
import { AuditAction, UserRole } from '@repo/prisma'
import { DatabaseService } from 'database/database.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { CacheService } from 'redis/cache.service'
import { RedisService } from 'redis/redis.service'
import { FirebaseService } from 'firebase/firebase.service'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ApiResponse, successResponse } from 'common/interfaces/api-response.interface'

@Injectable()
export class SessionService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
		private readonly cacheService: CacheService,
		private readonly redisService: RedisService,
		private readonly firebase: FirebaseService,
	) {}

	// Only a hash of the ID token is stored, so a database or cache leak exposes no usable tokens.
	private hashToken(token: string): string {
		return createHash('sha256').update(token).digest('hex')
	}

	private async cacheRevocation(tokenHash: string, revoked: boolean): Promise<void> {
		await this.redisService
			// Firebase ID tokens live for an hour, so an active entry can expire with the token;
			// a revoked entry is kept for a day to be safe.
			.set(`session:revoked:${tokenHash}`, JSON.stringify(revoked), revoked ? 86400 : 3600)
			.catch(() => undefined)
	}

	async createOrUpdateSession(
		userId: string,
		token: string,
		decodedToken: DecodedIdToken,
		ip?: string,
		userAgent?: string,
	) {
		const tokenHash = this.hashToken(token)

		const expiresAt = new Date(decodedToken.exp * 1000)
		const issuedAt = new Date(decodedToken.iat * 1000)

		const activity = {
			lastActivityAt: new Date(),
			ipAddress: ip || null,
			userAgent: userAgent || null,
		}

		const session = await this.prisma.session.upsert({
			where: { tokenHash },
			update: activity,
			create: { tokenHash, userId, issuedAt, expiresAt, ...activity },
		})

		await this.auditLog.log({
			action: AuditAction.LOGIN,
			entity: 'Session',
			entityId: session.id,
			actorId: userId,
			ipAddress: ip,
			userAgent,
		})

		await this.cacheRevocation(tokenHash, false)

		return session
	}

	// The session row only blocks one ID token, and the refresh token can mint new ones at any
	// time. Revoking the refresh tokens makes Firebase reject every token issued before now.
	private async revokeFirebaseTokens(userId: string): Promise<void> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { firebaseUid: true },
		})

		if (user) await this.firebase.revokeRefreshTokens(user.firebaseUid)
	}

	async revokeSession(token: string) {
		const tokenHash = this.hashToken(token)

		const existing = await this.prisma.session.findUnique({
			where: { tokenHash },
			select: { userId: true },
		})

		if (!existing) throw new NotFoundException('Session not found.')

		await this.revokeFirebaseTokens(existing.userId)

		const session = await this.prisma.session.update({
			where: { tokenHash },
			data: { revoked: true, revokedAt: new Date() },
		})

		await this.cacheRevocation(tokenHash, true)

		await this.auditLog.log({
			action: AuditAction.LOGOUT,
			entity: 'Session',
			entityId: session.id,
			actorId: session.userId,
		})
	}

	async isSessionRevoked(token: string): Promise<boolean> {
		const tokenHash = this.hashToken(token)

		return this.cacheService.remember<boolean>(`session:revoked:${tokenHash}`, 60, async () => {
			const session = await this.prisma.session.findUnique({
				where: { tokenHash },
				select: { revoked: true, expiresAt: true },
			})

			// A token without a session row is not treated as revoked: the session is created after sign-in.
			return Boolean(session && (session.revoked || session.expiresAt < new Date()))
		})
	}

	async getSessionsForUser(user: AuthenticatedUser): Promise<ApiResponse<unknown[]>> {
		// Admins see every user's sessions; everyone else sees only their own.
		const isElevated = user.role === UserRole.ADMIN

		const sessions = await this.prisma.session.findMany({
			where: isElevated ? {} : { userId: user.id },
			orderBy: { lastActivityAt: 'desc' },
			select: {
				id: true,
				userId: true,
				revoked: true,
				revokedBy: true,
				revokedAt: true,
				issuedAt: true,
				expiresAt: true,
				lastActivityAt: true,
				ipAddress: true,
				userAgent: true,
				createdAt: true,
				user: { select: { email: true, displayName: true } },
			},
		})

		return successResponse(sessions, 'Sessions fetched successfully.', sessions.length)
	}

	async revokeSessionById(sessionId: string, userId: string): Promise<ApiResponse<null>> {
		const [session, user] = await this.prisma.$transaction([
			this.prisma.session.findUnique({
				where: { id: sessionId },
				select: { id: true, userId: true, revoked: true, tokenHash: true },
			}),
			this.prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, role: true },
			}),
		])

		if (!session) throw new NotFoundException('Session not found.')
		if (!user) throw new NotFoundException('User not found.')

		const isElevated = user.role === UserRole.ADMIN

		if (session.userId !== user.id && !isElevated)
			throw new UnauthorizedException('You do not have permission to revoke this session.')

		if (!session.revoked) {
			await this.revokeFirebaseTokens(session.userId)

			const updated = await this.prisma.session.update({
				where: { id: session.id },
				data: { revoked: true, revokedAt: new Date(), revokedBy: user.id },
			})

			await this.cacheRevocation(session.tokenHash, true)

			// Keep token hashes out of the audit log.
			const { tokenHash: _oldHash, ...oldData } = session
			const { tokenHash: _newHash, ...newData } = updated

			await this.auditLog.log({
				action: AuditAction.DELETE,
				entity: 'Session',
				entityId: updated.id,
				actorId: userId,
				oldData,
				newData,
			})
		}

		return successResponse(null, 'Session revoked successfully.')
	}
}
