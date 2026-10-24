import { AuditAction, UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, resetState, type TestApp } from './helpers'

type Entry = { actor: string; actorEmail: string | null; actorId: string | null; entity: string }

describe('Audit logs (e2e)', () => {
	let t: TestApp

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(() => resetState(t.prisma))

	const list = async (auth: Record<string, string>, search?: string) => {
		const res = await t
			.http()
			.get('/api/v1/audit-logs')
			.query(search ? { search } : {})
			.set(auth)
			.expect(200)

		return res.body.result as Entry[]
	}

	it('names the actor of a content change by display name, with their email', async () => {
		const { auth, user } = await createUser(t.prisma, UserRole.ADMIN)

		await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send({
				slug: 'audit',
				title: 'Audit',
				subtitle: 'Trail',
				category: 'Backend',
				descriptions: ['x'],
				tags: ['audit'],
				sortOrder: 1,
			})
			.expect(201)

		const stored = await t.prisma.auditLog.findFirst({ where: { entity: 'Project' } })
		expect(stored).toMatchObject({ actor: user.displayName, actorId: user.id })

		const project = (await list(auth)).find(entry => entry.entity === 'Project')
		expect(project).toMatchObject({ actor: user.displayName, actorEmail: user.email })
	})

	it('shows older entries that saved only an email under the same name', async () => {
		const { auth, user } = await createUser(t.prisma, UserRole.ADMIN)
		await t.prisma.auditLog.create({
			data: { action: AuditAction.UPDATE, entity: 'Contact', entityId: 'c1', actor: user.email },
		})

		const [entry] = await list(auth, 'Contact')
		expect(entry).toMatchObject({ actor: user.displayName, actorEmail: user.email })
	})

	it('finds entries by the actor name, whichever way they were saved', async () => {
		const { auth, user } = await createUser(t.prisma, UserRole.ADMIN)
		await t.prisma.auditLog.createMany({
			data: [
				{ action: AuditAction.UPDATE, entity: 'Contact', entityId: 'c1', actor: user.email },
				{
					action: AuditAction.LOGIN,
					entity: 'User',
					entityId: user.id,
					actor: 'x',
					actorId: user.id,
				},
			],
		})

		const entries = await list(auth, user.displayName)
		expect(entries.map(entry => entry.entity).sort()).toEqual(['Contact', 'User'])
	})
})
