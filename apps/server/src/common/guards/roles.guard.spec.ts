import type { ExecutionContext } from '@nestjs/common'
import type { LoggerService } from 'common/logger/logger.service'

import { UserRole } from '@repo/prisma'
import { Reflector } from '@nestjs/core'
import { RolesGuard } from './roles.guard'
import { ForbiddenException } from '@nestjs/common'
import { ROLES_KEY } from 'common/decorators/roles.decorator'
import { IS_PUBLIC_KEY } from 'common/decorators/public.decorator'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const contextFor = (user?: { id: string; role?: UserRole }) =>
	({
		getHandler: () => undefined,
		getClass: () => undefined,
		switchToHttp: () => ({ getRequest: () => ({ user, originalUrl: '/test', requestId: 'r1' }) }),
	}) as unknown as ExecutionContext

describe('RolesGuard', () => {
	let reflector: Reflector
	let guard: RolesGuard

	const withMetadata = (meta: { public?: boolean; roles?: UserRole[] }) =>
		vi
			.spyOn(reflector, 'getAllAndOverride')
			.mockImplementation((key: unknown) =>
				key === IS_PUBLIC_KEY ? meta.public : key === ROLES_KEY ? meta.roles : undefined,
			)

	beforeEach(() => {
		reflector = new Reflector()
		guard = new RolesGuard(reflector, { warn: vi.fn() } as unknown as LoggerService)
	})

	it('lets public routes through without a user', () => {
		withMetadata({ public: true, roles: [UserRole.ADMIN] })

		expect(guard.canActivate(contextFor())).toBe(true)
	})

	it('allows any signed in user when the route has no roles', () => {
		withMetadata({})

		expect(guard.canActivate(contextFor({ id: 'u1', role: UserRole.USER }))).toBe(true)
	})

	it('allows an editor on an editor route', () => {
		withMetadata({ roles: [UserRole.EDITOR] })

		expect(guard.canActivate(contextFor({ id: 'u1', role: UserRole.EDITOR }))).toBe(true)
	})

	it('always allows an admin', () => {
		withMetadata({ roles: [UserRole.EDITOR] })

		expect(guard.canActivate(contextFor({ id: 'u1', role: UserRole.ADMIN }))).toBe(true)
	})

	it('rejects a plain user on an editor route', () => {
		withMetadata({ roles: [UserRole.EDITOR] })

		expect(() => guard.canActivate(contextFor({ id: 'u1', role: UserRole.USER }))).toThrow(
			ForbiddenException,
		)
	})

	it('rejects an editor on an admin route', () => {
		withMetadata({ roles: [UserRole.ADMIN] })

		expect(() => guard.canActivate(contextFor({ id: 'u1', role: UserRole.EDITOR }))).toThrow(
			ForbiddenException,
		)
	})

	it('rejects a request with no user', () => {
		withMetadata({ roles: [UserRole.EDITOR] })

		expect(() => guard.canActivate(contextFor())).toThrow(ForbiddenException)
	})
})
