import type { User } from '@repo/prisma'
import type { AuthenticatedUser } from 'types/auth'
import type { DatabaseService } from 'database'
import type { LoggerService } from 'common/logger/logger.service'
import type { AuditLogService } from 'modules/audit-log/audit-log.service'

import { UserRole, UserStatus } from '@repo/prisma'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { UserAccountService } from './user-account.service'

const firebaseUser = {
	firebaseUid: 'uid-1',
	email: 'ada@example.test',
	displayName: 'Ada Lovelace',
	photoUrl: 'https://photos.example/ada.png',
	provider: 'GOOGLE',
	emailVerified: true,
} as AuthenticatedUser

const stored = {
	id: 'user-1',
	firebaseUid: 'uid-1',
	email: 'ada@example.test',
	displayName: 'Ada',
	role: UserRole.EDITOR,
	status: UserStatus.ACTIVE,
} as User

const uniqueViolation = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' })

describe('UserAccountService.syncFirebaseUser', () => {
	let prisma: { user: { findUnique: Mock; create: Mock; update: Mock } }
	let audit: { log: Mock }
	let service: UserAccountService

	beforeEach(() => {
		prisma = {
			user: {
				findUnique: vi.fn(async () => null),
				create: vi.fn(async ({ data }) => ({ id: 'user-new', ...data })),
				update: vi.fn(async ({ data }) => ({ ...stored, ...data })),
			},
		}
		audit = { log: vi.fn(async () => undefined) }
		const logger = {
			warn: vi.fn(),
			timed: vi.fn(
				async (
					_operation: string,
					_context: string,
					_fields: unknown,
					run: () => Promise<unknown>,
					options: { result?: (value: unknown) => unknown; expected?: (error: unknown) => boolean } = {},
				) => {
					const value = await run()
					options.result?.(value)
					return value
				},
			),
		}
		service = new UserAccountService(
			prisma as unknown as DatabaseService,
			logger as unknown as LoggerService,
			audit as unknown as AuditLogService,
		)
	})

	it('creates the database user on first sign in with safe defaults and logs the sign in', async () => {
		const result = await service.syncFirebaseUser(
			{ ...firebaseUser, displayName: undefined, photoUrl: undefined, role: undefined, status: undefined } as unknown as AuthenticatedUser,
			{ requestId: 'req-1', endpoint: 'POST /api/v1/auth/login' },
		)

		expect(prisma.user.create).toHaveBeenCalledWith({
			data: expect.objectContaining({
				email: 'ada@example.test',
				role: UserRole.USER,
				status: UserStatus.ACTIVE,
				photoUrl: '',
				displayName: '',
			}),
		})
		expect(audit.log).toHaveBeenCalledWith(
			expect.objectContaining({ entityId: 'user-new', actorName: 'ada@example.test', requestId: 'req-1' }),
		)
		expect(result.email).toBe('ada@example.test')
	})

	it('keeps the role and name Firebase provides for a new user', async () => {
		await service.syncFirebaseUser({ ...firebaseUser, role: UserRole.ADMIN, status: UserStatus.ACTIVE })

		expect(prisma.user.create).toHaveBeenCalledWith({
			data: expect.objectContaining({ role: UserRole.ADMIN, firstName: 'Ada', lastName: 'Lovelace', displayName: 'Ada Lovelace' }),
		})
	})

	it('updates a returning user with the latest name and photo', async () => {
		prisma.user.findUnique.mockResolvedValueOnce(stored)

		await service.syncFirebaseUser(firebaseUser)

		expect(prisma.user.create).not.toHaveBeenCalled()
		expect(prisma.user.update).toHaveBeenCalledWith({
			where: { id: 'user-1' },
			data: expect.objectContaining({
				displayName: 'Ada Lovelace',
				firstName: 'Ada',
				lastName: 'Lovelace',
				photoUrl: 'https://photos.example/ada.png',
			}),
		})
	})

	it('leaves the stored name and photo alone when Firebase has none', async () => {
		prisma.user.findUnique.mockResolvedValueOnce(stored)

		await service.syncFirebaseUser({ ...firebaseUser, displayName: '  ', photoUrl: undefined } as unknown as AuthenticatedUser)

		const [{ data }] = prisma.user.update.mock.calls[0] as [{ data: Record<string, unknown> }]
		expect(data).not.toHaveProperty('displayName')
		expect(data).not.toHaveProperty('photoUrl')
	})

	it('updates instead when a parallel first request already created the user', async () => {
		prisma.user.create.mockRejectedValueOnce(uniqueViolation)
		prisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(stored)

		await service.syncFirebaseUser(firebaseUser)

		expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'user-1' } }))
	})

	it('rethrows the conflict when the other row cannot be found', async () => {
		prisma.user.create.mockRejectedValueOnce(uniqueViolation)

		await expect(service.syncFirebaseUser(firebaseUser)).rejects.toBe(uniqueViolation)
	})

	it('rethrows any other database error', async () => {
		const failure = new Error('database down')
		prisma.user.create.mockRejectedValueOnce(failure)

		await expect(service.syncFirebaseUser(firebaseUser)).rejects.toBe(failure)
		expect(prisma.user.update).not.toHaveBeenCalled()
	})
})
