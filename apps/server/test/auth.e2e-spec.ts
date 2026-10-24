import { UserRole, UserStatus } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, refreshIdToken, resetState, type TestApp } from './helpers'

describe('authentication and roles (e2e)', () => {
	let t: TestApp

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(() => resetState(t.prisma))

	it('rejects requests without a token', async () => {
		await t.http().get('/api/v1/projects').expect(401)
	})

	it('rejects a forged token', async () => {
		await t.http().get('/api/v1/projects').set('Authorization', 'Bearer not-a-token').expect(401)
	})

	it('lets public routes through without a token', async () => {
		await t.http().get('/api/v1/projects/published').expect(200)
	})

	it('forbids a USER on editor routes', async () => {
		const { auth } = await createUser(t.prisma, UserRole.USER)

		await t.http().get('/api/v1/projects').set(auth).expect(403)
	})

	it('allows an EDITOR on editor routes but not on admin routes', async () => {
		const { auth } = await createUser(t.prisma, UserRole.EDITOR)

		await t.http().get('/api/v1/projects').set(auth).expect(200)
		await t.http().get('/api/v1/users').set(auth).expect(403)
	})

	it('allows an ADMIN everywhere', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)

		await t.http().get('/api/v1/users').set(auth).expect(200)
	})

	it('rejects an inactive account', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN, UserStatus.SUSPENDED)

		await t.http().get('/api/v1/users').set(auth).expect(401)
	})

	it('revokes the session on logout', async () => {
		const { auth } = await createUser(t.prisma, UserRole.EDITOR)

		await t.http().post('/api/v1/auth/login').set(auth).expect(201)
		await t.http().get('/api/v1/auth/me').set(auth).expect(200)
		await t.http().post('/api/v1/auth/logout').set(auth).expect(204)
		await t.http().get('/api/v1/auth/me').set(auth).expect(401)
	})

	it('rejects tokens refreshed after logout', async () => {
		const { auth, refreshToken } = await createUser(t.prisma, UserRole.EDITOR)

		await t.http().post('/api/v1/auth/login').set(auth).expect(201)
		// Firebase compares revocation times in whole seconds, so wait for the token's second to pass.
		await new Promise(resolve => setTimeout(resolve, 1100))
		await t.http().post('/api/v1/auth/logout').set(auth).expect(204)

		const fresh = await refreshIdToken(refreshToken)

		if (fresh)
			await t.http().get('/api/v1/auth/me').set('Authorization', `Bearer ${fresh}`).expect(401)
	})

	it('records the login in the audit log with the actor name', async () => {
		const { auth, user } = await createUser(t.prisma, UserRole.EDITOR)

		await t.http().post('/api/v1/auth/login').set(auth).expect(201)

		const entries = await t.prisma.auditLog.findMany({
			where: { actorId: user.id, action: 'LOGIN' },
		})
		expect(entries.length).toBeGreaterThan(0)
		expect(entries.every(entry => entry.actor === user.displayName)).toBe(true)
	})

	it('never exposes session token hashes', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		await t.http().post('/api/v1/auth/login').set(auth).expect(201)

		const res = await t.http().get('/api/v1/auth/sessions').set(auth).expect(200)

		expect(res.body.result.length).toBeGreaterThan(0)
		expect(JSON.stringify(res.body)).not.toContain('tokenHash')
	})
})
