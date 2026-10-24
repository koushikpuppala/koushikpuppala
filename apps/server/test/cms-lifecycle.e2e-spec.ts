import { AuditAction, UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, resetState, type TestApp } from './helpers'
import { TEST_ENV } from './env'

type Collection = {
	path: string
	entity: string
	create: Record<string, unknown>
	update: Record<string, unknown>
	publishRoute: boolean
	publishedByDefault: boolean
}

const COLLECTIONS: Collection[] = [
	{
		path: 'education',
		entity: 'Education',
		create: {
			degree: 'BTech',
			fieldOfStudy: 'Computer Science',
			university: 'Test University',
			location: 'Hyderabad',
			description: ['Studied systems.'],
			startDate: '2018-07-01',
		},
		update: { location: 'Bengaluru', endDate: '2022-05-01' },
		publishRoute: true,
		publishedByDefault: false,
	},
	{
		path: 'experience',
		entity: 'Experience',
		create: {
			title: 'Engineer',
			organization: 'Acme',
			location: 'Remote',
			employmentType: 'FULL_TIME',
			startDate: '2022-06-01',
			description: ['Built things.'],
		},
		update: { organization: 'Acme Corp', endDate: '2024-01-01' },
		publishRoute: true,
		publishedByDefault: false,
	},
	{
		path: 'services',
		entity: 'Service',
		create: { title: 'APIs', description: 'Backend APIs.' },
		update: { subtitle: 'REST and events' },
		publishRoute: true,
		publishedByDefault: false,
	},
	{
		path: 'skills',
		entity: 'Skill',
		create: { name: 'TypeScript', category: 'Languages' },
		update: { proficiency: 90 },
		publishRoute: true,
		publishedByDefault: true,
	},
	{
		path: 'socials',
		entity: 'Social',
		create: { platform: 'GITHUB', url: 'https://github.com/example' },
		update: { label: 'GitHub' },
		publishRoute: false,
		publishedByDefault: false,
	},
	{
		path: 'home',
		entity: 'Home',
		create: { title: 'Hello', subtitles: ['Engineer'], content: 'Welcome.' },
		update: { content: 'Welcome back.' },
		publishRoute: true,
		publishedByDefault: false,
	},
	{
		path: 'about',
		entity: 'About',
		create: { title: 'About me', content: 'I build software.' },
		update: { content: 'I build reliable software.' },
		publishRoute: true,
		publishedByDefault: false,
	},
	{
		path: 'metadata',
		entity: 'Metadata',
		create: { type: 'PAGE', key: '/lifecycle', value: {} },
		update: { title: 'Lifecycle' },
		publishRoute: true,
		publishedByDefault: false,
	},
]

describe('CMS collection lifecycle (e2e)', () => {
	let t: TestApp
	let auth: Record<string, string>

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(async () => {
		await resetState(t.prisma)
		auth = (await createUser(t.prisma, UserRole.EDITOR)).auth
	})

	const actions = async (entity: string, entityId: string) =>
		(
			await t.prisma.auditLog.findMany({
				where: { entity, entityId },
				orderBy: { createdAt: 'asc' },
			})
		).map(log => log.action)

	it.each(COLLECTIONS)('$entity: create, update, publish and delete are audited', async c => {
		const created = await t.http().post(`/api/v1/${c.path}`).set(auth).send(c.create).expect(201)
		const id = created.body.result.id

		expect(created.body.result.isPublished ?? false).toBe(c.publishedByDefault)

		const updated = await t
			.http()
			.patch(`/api/v1/${c.path}/${id}`)
			.set(auth)
			.send(c.update)
			.expect(200)
		expect(updated.body.result).toMatchObject(
			Object.fromEntries(
				Object.entries(c.update).filter(([key]) => !key.toLowerCase().endsWith('date')),
			),
		)

		const expected: AuditAction[] = [AuditAction.CREATE, AuditAction.UPDATE]

		if (c.publishRoute) {
			const toggled = await t.http().patch(`/api/v1/${c.path}/${id}/publish`).set(auth).expect(200)
			const nowPublished = !c.publishedByDefault

			expect(toggled.body.result.isPublished).toBe(nowPublished)
			expect(Boolean(toggled.body.result.publishedAt)).toBe(nowPublished)
			expected.push(nowPublished ? AuditAction.PUBLISH : AuditAction.UNPUBLISH)
		}

		const removed = await t.http().delete(`/api/v1/${c.path}/${id}`).set(auth).expect(200)
		expect(removed.body.result).toEqual({ id, deleted: true })
		expected.push(AuditAction.DELETE)

		await t.http().get(`/api/v1/${c.path}/${id}`).set(auth).expect(404)
		expect(await actions(c.entity, id)).toEqual(expected)
	})

	it('keeps the first publish date when a published record is saved again', async () => {
		const created = await t
			.http()
			.post('/api/v1/services')
			.set(auth)
			.send({ title: 'APIs', description: 'Backend APIs.', isPublished: true })
			.expect(201)
		const { id, publishedAt } = created.body.result

		const saved = await t
			.http()
			.patch(`/api/v1/services/${id}`)
			.set(auth)
			.send({ isPublished: true, title: 'APIs and events' })
			.expect(200)

		expect(saved.body.result.publishedAt).toBe(publishedAt)

		const unpublished = await t
			.http()
			.patch(`/api/v1/services/${id}`)
			.set(auth)
			.send({ isPublished: false })
			.expect(200)

		expect(unpublished.body.result.publishedAt).toBeNull()
	})

	it('rejects a second social link for the same platform', async () => {
		const body = { platform: 'GITHUB', url: 'https://github.com/example' }

		await t.http().post('/api/v1/socials').set(auth).send(body).expect(201)
		await t.http().post('/api/v1/socials').set(auth).send(body).expect(409)
	})

	it('only accepts an OpenGraph image served from the CDN', async () => {
		const create = { type: 'PAGE', key: '/og', value: {} }

		await t
			.http()
			.post('/api/v1/metadata')
			.set(auth)
			.send({ ...create, ogImage: 'https://elsewhere.example/og.png' })
			.expect(400)
		// Starts with the CDN host but is a different host, so a bare prefix check would let it through.
		await t
			.http()
			.post('/api/v1/metadata')
			.set(auth)
			.send({ ...create, ogImage: `${TEST_ENV.CDN_URL}.evil.example/og.png` })
			.expect(400)

		const created = await t
			.http()
			.post('/api/v1/metadata')
			.set(auth)
			.send({ ...create, ogImage: `${TEST_ENV.CDN_URL}/images/og.png` })
			.expect(201)
		const { id } = created.body.result

		await t
			.http()
			.patch(`/api/v1/metadata/${id}`)
			.set(auth)
			.send({ ogImage: 'https://elsewhere.example/og.png' })
			.expect(400)
		await t.http().patch(`/api/v1/metadata/${id}`).set(auth).send({ ogImage: null }).expect(200)
	})

	it('creates, publishes and deletes a resume', async () => {
		const media = await t.prisma.media.create({
			data: {
				fileName: 'cv.pdf',
				originalName: 'cv.pdf',
				size: 10,
				mimeType: 'application/pdf',
				extension: '.pdf',
				bucket: 'test',
				storageKey: 'docs/cv.pdf',
			},
		})

		const created = await t
			.http()
			.post('/api/v1/resume')
			.set(auth)
			.send({ title: 'CV', mediaId: media.id })
			.expect(201)
		const id = created.body.result.id

		await t.http().patch(`/api/v1/resume/${id}`).set(auth).send({ title: 'Resume' }).expect(200)
		await t.http().patch(`/api/v1/resume/${id}/publish`).set(auth).expect(200)
		await t.http().delete(`/api/v1/resume/${id}`).set(auth).expect(200)

		expect(await actions('Resume', id)).toEqual([
			AuditAction.CREATE,
			AuditAction.UPDATE,
			AuditAction.PUBLISH,
			AuditAction.DELETE,
		])
	})
})
