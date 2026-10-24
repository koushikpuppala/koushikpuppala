import type { User } from '@repo/prisma'
import type { DatabaseService } from 'database'
import type { LoggerService } from 'common/logger/logger.service'
import type { FirebaseService } from 'firebase/firebase.service'
import type { AuditLogService } from 'modules/audit-log/audit-log.service'

import { UserRole, UserStatus } from '@repo/prisma'
import { BadRequestException } from '@nestjs/common'
import { UserAdminService } from './user-admin.service'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

const admin = {
	id: 'admin-1',
	firebaseUid: 'uid-1',
	email: 'admin@example.test',
	role: UserRole.ADMIN,
	status: UserStatus.ACTIVE,
} as User

describe('UserAdminService.adminUpdate', () => {
	let prisma: { user: { findUnique: Mock; count: Mock; update: Mock } }
	let firebase: { updateUser: Mock }
	let service: UserAdminService

	beforeEach(() => {
		prisma = {
			user: {
				findUnique: vi.fn(async () => admin),
				count: vi.fn(async () => 1),
				update: vi.fn(async ({ data }: { data: Partial<User> }) => ({ ...admin, ...data })),
			},
		}
		firebase = { updateUser: vi.fn(async () => undefined) }
		service = new UserAdminService(
			prisma as unknown as DatabaseService,
			{ info: vi.fn() } as unknown as LoggerService,
			firebase as unknown as FirebaseService,
			{ log: vi.fn() } as unknown as AuditLogService,
		)
	})

	it('stops an admin from deactivating their own account', async () => {
		await expect(
			service.adminUpdate(admin.id, { status: UserStatus.INACTIVE }, undefined, admin.id),
		).rejects.toThrow('Administrators cannot deactivate their own account')
		expect(prisma.user.update).not.toHaveBeenCalled()
	})

	it.each([
		['demoting', { role: UserRole.EDITOR }],
		['deactivating', { status: UserStatus.SUSPENDED }],
	])('refuses %s the last active administrator', async (_, dto) => {
		prisma.user.count.mockResolvedValueOnce(0)

		await expect(service.adminUpdate(admin.id, dto, undefined, 'another-id')).rejects.toThrow(
			new BadRequestException('Cannot demote or deactivate the last remaining active administrator'),
		)
		expect(prisma.user.count).toHaveBeenCalledWith({
			where: { role: UserRole.ADMIN, status: UserStatus.ACTIVE, id: { not: admin.id } },
		})
		expect(prisma.user.update).not.toHaveBeenCalled()
	})

	it('demotes an administrator when another active one remains', async () => {
		await expect(
			service.adminUpdate(admin.id, { role: UserRole.EDITOR }, undefined, 'another-id'),
		).resolves.toMatchObject({ message: 'User updated successfully.' })
		expect(prisma.user.update).toHaveBeenCalledWith({
			where: { id: admin.id },
			data: { role: UserRole.EDITOR },
		})
	})

	it('does not count admins for a change that keeps the role and status', async () => {
		await service.adminUpdate(admin.id, { fullName: 'New Name' }, undefined, admin.id)
		expect(prisma.user.count).not.toHaveBeenCalled()
	})
})
