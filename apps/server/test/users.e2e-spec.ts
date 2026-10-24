import { UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, resetState, type TestApp } from './helpers'

describe('user management (e2e)', () => {
	let t: TestApp

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(() => resetState(t.prisma))

	it('creates a Firebase and database user, then deletes both', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)

		const created = await t
			.http()
			.post('/api/v1/users')
			.set(auth)
			.send({
				fullName: 'New Editor',
				email: 'new.editor@example.test',
				password: 'password123',
				role: 'EDITOR',
			})
			.expect(201)
		const id = created.body.result.id

		await t.http().delete(`/api/v1/users/${id}`).set(auth).expect(204)
		expect(await t.prisma.user.findUnique({ where: { id } })).toBeNull()
	})

	it('stops an admin from demoting or deleting their own account', async () => {
		const { auth, user } = await createUser(t.prisma, UserRole.ADMIN)

		const demote = await t
			.http()
			.patch(`/api/v1/users/${user.id}`)
			.set(auth)
			.send({ role: 'EDITOR' })
			.expect(400)
		expect(demote.body.message).toMatch(/cannot demote their own/i)

		await t.http().delete(`/api/v1/users/${user.id}`).set(auth).expect(400)
	})

	it('stops an admin from deactivating their own account', async () => {
		const { auth, user } = await createUser(t.prisma, UserRole.ADMIN)

		const deactivate = await t
			.http()
			.patch(`/api/v1/users/${user.id}`)
			.set(auth)
			.send({ status: 'INACTIVE' })
			.expect(400)
		expect(deactivate.body.message).toMatch(/cannot deactivate their own/i)

		const stored = await t.prisma.user.findUnique({ where: { id: user.id } })
		expect(stored?.status).toBe('ACTIVE')
	})

	it('lets an admin demote another admin', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		const { user: other } = await createUser(t.prisma, UserRole.ADMIN)

		await t.http().patch(`/api/v1/users/${other.id}`).set(auth).send({ role: 'EDITOR' }).expect(200)
	})
})
