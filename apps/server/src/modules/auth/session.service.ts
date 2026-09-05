import { createHash } from 'node:crypto'
import { DatabaseService } from 'database/database.service'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { DecodedIdToken } from 'firebase-admin/auth'
import type { AuthenticatedUser } from 'types/express'
import { ApiResponse, successResponse } from 'common/interfaces/api-response.interface'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, UserRole } from '@repo/prisma'

@Injectable()
export class SessionService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {}

	private hashToken(token: string): string {
		return createHash('sha256').update(token).digest('hex')
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

		const session = await this.prisma.session.upsert({
			where: { tokenHash },
			update: { lastActivityAt: new Date(), ipAddress: ip || null, userAgent: userAgent || null },
			create: {
				tokenHash,
				userId,
				issuedAt,
				expiresAt,
				lastActivityAt: new Date(),
				ipAddress: ip || null,
				userAgent: userAgent || null,
			},
		})

		await this.auditLog.log({
			action: AuditAction.LOGIN,
			entity: 'Session',
			entityId: session.id,
			actorId: userId,
			ipAddress: ip,
			userAgent,
		})

		return session
	}

	async revokeSession(token: string) {
		const tokenHash = this.hashToken(token)

		try {
			const session = await this.prisma.session.update({
				where: { tokenHash },
				data: { revoked: true, revokedAt: new Date() },
			})

			await this.auditLog.log({
				action: AuditAction.LOGOUT,
				entity: 'Session',
				entityId: session.id,
				actorId: session.userId,
			})
		} catch {
			throw new NotFoundException('Session not found.')
		}
	}

	async isSessionRevoked(token: string): Promise<boolean> {
		const tokenHash = this.hashToken(token)
		const session = await this.prisma.session.findUnique({
			where: { tokenHash },
			select: { revoked: true, expiresAt: true },
		})

		if (!session) return false
		if (session.revoked) return true
		if (session.expiresAt < new Date()) return true

		return false
	}

	async getSessionsForUser(user: AuthenticatedUser): Promise<ApiResponse<unknown[]>> {
		const isElevated = user.role === UserRole.ADMIN

		const sessions = await this.prisma.session.findMany({
			where: isElevated ? {} : { userId: user.id },
			orderBy: { lastActivityAt: 'desc' },
			include: {
				user: {
					select: {
						email: true,
						displayName: true,
					},
				},
			},
		})

		return successResponse(sessions, 'Sessions fetched successfully.', sessions.length)
	}

	async revokeSessionById(sessionId: string, userId: string): Promise<ApiResponse<null>> {
		const [session, user] = await this.prisma.$transaction([
			this.prisma.session.findUnique({
				where: { id: sessionId },
				select: { id: true, userId: true, revoked: true },
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
			const updated = await this.prisma.session.update({
				where: { id: session.id },
				data: { revoked: true, revokedAt: new Date(), revokedBy: user.id },
			})

			await this.auditLog.log({
				action: AuditAction.DELETE,
				entity: 'Session',
				entityId: updated.id,
				actorId: userId,
				oldData: session,
				newData: updated,
			})
		}

		return successResponse(null, 'Session revoked successfully.')
	}
}
