import type { User } from '@repo/prisma'
import type { AuthenticatedUser } from 'types/auth'
import type { CodedError, RequestMeta } from 'types/server'

import { DatabaseService } from 'database'
import { Injectable } from '@nestjs/common'
import { AuditAction, UserRole, UserStatus } from '@repo/prisma'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { LoggerService, requestFields } from 'common/logger/logger.service'
import { splitName, toAuthenticatedUser } from './user.mapper'

const isUniqueViolation = (error: unknown): boolean => (error as CodedError)?.code === 'P2002'

@Injectable()
export class UserAccountService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly logger: LoggerService,
		private readonly auditLog: AuditLogService,
	) {}

	findByFirebaseUid(firebaseUid: string, meta?: RequestMeta): Promise<User | null> {
		return this.logger.timed(
			'User lookup',
			UserAccountService.name,
			{ ...requestFields(meta), firebaseUid },
			() => this.prisma.user.findUnique({ where: { firebaseUid } }),
			{ result: user => ({ userId: user?.id }) },
		)
	}

	async syncFirebaseUser(user: AuthenticatedUser, meta?: RequestMeta): Promise<AuthenticatedUser> {
		const existing = await this.findByFirebaseUid(user.firebaseUid, meta)

		const dbUser = existing
			? await this.updateFromFirebase(existing, user, meta)
			: await this.createFromFirebase(user, meta)

		await this.auditLog.log({
			action: AuditAction.LOGIN,
			entity: 'User',
			entityId: dbUser.id,
			actorId: dbUser.id,
			actorName: dbUser.displayName || dbUser.email,
			requestId: meta?.requestId,
		})

		return toAuthenticatedUser(dbUser)
	}

	private async createFromFirebase(user: AuthenticatedUser, meta?: RequestMeta): Promise<User> {
		const fields = { ...requestFields(meta), firebaseUid: user.firebaseUid }
		const { firstName, lastName } = splitName(user.displayName)

		try {
			return await this.logger.timed(
				'User creation',
				UserAccountService.name,
				fields,
				() =>
					this.prisma.user.create({
						data: {
							lastName,
							firstName,
							email: user.email,
							provider: user.provider,
							lastLoginAt: new Date(),
							photoUrl: user.photoUrl ?? '',
							firebaseUid: user.firebaseUid,
							role: user.role ?? UserRole.USER,
							emailVerified: user.emailVerified,
							displayName: user.displayName ?? '',
							status: user.status ?? UserStatus.ACTIVE,
						},
					}),
				{ result: created => ({ userId: created.id }), expected: isUniqueViolation },
			)
		} catch (error) {
			// Two first requests from the same new user can race to create the row; the loser updates it instead.
			if (!isUniqueViolation(error)) throw error

			this.logger.warn(
				'Concurrent user creation detected (P2002), falling back to user update',
				UserAccountService.name,
				fields,
			)

			const existing = await this.findByFirebaseUid(user.firebaseUid, meta)

			if (!existing) throw error

			return this.updateFromFirebase(existing, user, meta)
		}
	}

	private updateFromFirebase(
		existing: User,
		user: AuthenticatedUser,
		meta?: RequestMeta,
	): Promise<User> {
		const displayName = user.displayName?.trim()
		const name = displayName ? splitName(displayName) : undefined

		return this.logger.timed(
			'User update',
			UserAccountService.name,
			{ ...requestFields(meta), firebaseUid: user.firebaseUid, userId: existing.id },
			() =>
				this.prisma.user.update({
					where: { id: existing.id },
					data: {
						...(displayName && { displayName, ...name }),
						...(user.photoUrl && { photoUrl: user.photoUrl }),
						provider: user.provider,
						lastLoginAt: new Date(),
						emailVerified: user.emailVerified,
					},
				}),
		)
	}
}
