import { UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, resetState, type TestApp } from './helpers'

describe('admin list filters (e2e)', () => {
	let t: TestApp

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(() => resetState(t.prisma))

	const contact = (email: string, createdAt: string) =>
		t.prisma.contact.create({
			data: {
				name: 'Ada',
				email,
				subject: 'Hello',
				message: 'A message long enough.',
				createdAt: new Date(createdAt),
			},
		})

	it('filters contacts by a date range instead of rejecting it', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		await contact('early@example.test', '2026-09-01T10:00:00Z')
		await contact('inside@example.test', '2026-10-05T10:00:00Z')

		const res = await t
			.http()
			.get('/api/v1/contacts?from=2026-10-04&to=2026-10-09')
			.set(auth)
			.expect(200)

		expect(res.body.result.items.map((c: { email: string }) => c.email)).toEqual([
			'inside@example.test',
		])
	})

	it('rejects a date that is not a date', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)

		await t.http().get('/api/v1/contacts?from=yesterday').set(auth).expect(400)
	})

	it('filters users by a date range', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)

		const none = await t
			.http()
			.get('/api/v1/users?from=2020-01-01&to=2020-01-31')
			.set(auth)
			.expect(200)
		const all = await t.http().get('/api/v1/users').set(auth).expect(200)

		expect(none.body.result.items).toHaveLength(0)
		expect(all.body.result.items).toHaveLength(1)
	})

	it('pages at 10 by default and reports the total', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		for (let i = 0; i < 12; i++)
			await contact(
				`sender${i}@example.test`,
				`2026-10-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
			)

		const first = await t.http().get('/api/v1/contacts').set(auth).expect(200)
		const second = await t.http().get('/api/v1/contacts?page=2').set(auth).expect(200)

		expect(first.body.result.items).toHaveLength(10)
		expect(second.body.result.items).toHaveLength(2)
		expect(first.body.result.pagination).toMatchObject({ total: 12, totalPages: 2, limit: 10 })
	})

	it('sorts by a whitelisted column and rejects any other', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		await contact('bravo@example.test', '2026-10-01T10:00:00Z')
		await contact('alpha@example.test', '2026-10-02T10:00:00Z')
		await contact('charlie@example.test', '2026-10-03T10:00:00Z')

		const emails = async (query: string) => {
			const res = await t.http().get(`/api/v1/contacts?${query}`).set(auth).expect(200)

			return res.body.result.items.map((c: { email: string }) => c.email)
		}

		expect(await emails('sortBy=email&sortOrder=asc')).toEqual([
			'alpha@example.test',
			'bravo@example.test',
			'charlie@example.test',
		])
		expect(await emails('sortBy=email&sortOrder=desc')).toEqual([
			'charlie@example.test',
			'bravo@example.test',
			'alpha@example.test',
		])
		expect(await emails('')).toEqual([
			'charlie@example.test',
			'alpha@example.test',
			'bravo@example.test',
		])

		await t.http().get('/api/v1/contacts?sortBy=ipAddress').set(auth).expect(400)
		await t.http().get('/api/v1/contacts?sortBy=email&sortOrder=sideways').set(auth).expect(400)
	})

	it('counts unread, urgent and resolved contacts across the whole inbox', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		const base = { name: 'Ada', subject: 'Hello', message: 'A message long enough.' }
		await t.prisma.contact.createMany({
			data: [
				{ ...base, email: 'a@example.test', priority: 'URGENT' },
				{ ...base, email: 'b@example.test', priority: 'HIGH', status: 'RESOLVED' },
				{ ...base, email: 'c@example.test', status: 'READ' },
			],
		})

		const res = await t.http().get('/api/v1/contacts?search=c@example').set(auth).expect(200)

		expect(res.body.result.items).toHaveLength(1)
		expect(res.body.result).toMatchObject({ unreadCount: 1, urgentCount: 2, resolvedCount: 1 })
	})

	it('counts users by role and status across every user', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		await createUser(t.prisma, UserRole.EDITOR)
		await createUser(t.prisma, UserRole.EDITOR, 'SUSPENDED')

		const res = await t.http().get('/api/v1/users?role=ADMIN').set(auth).expect(200)

		expect(res.body.result.items).toHaveLength(1)
		expect(res.body.result).toMatchObject({ adminCount: 1, editorCount: 2, activeCount: 2 })
		expect(res.body.result.pagination.total).toBe(1)
	})

	it('searches social links', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		await t.prisma.social.createMany({
			data: [
				{ platform: 'GITHUB', url: 'https://github.com/ada', label: 'Code' },
				{ platform: 'LINKEDIN', url: 'https://linkedin.com/in/ada', handle: 'ada-lovelace' },
			],
		})

		const platforms = async (search: string) => {
			const res = await t.http().get(`/api/v1/socials?search=${search}`).set(auth).expect(200)

			return res.body.result.items.map((s: { platform: string }) => s.platform)
		}

		expect(await platforms('code')).toEqual(['GITHUB'])
		expect(await platforms('LOVELACE')).toEqual(['LINKEDIN'])
		expect(await platforms('linkedin.com')).toEqual(['LINKEDIN'])
	})

	it('finds metadata records by their exact keys', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		await t.prisma.metadata.createMany({
			data: [
				{ type: 'PAGE', key: '/', value: {} },
				{ type: 'PAGE', key: '/about', value: {} },
				{ type: 'PAGE', key: '/about/team', value: {} },
			],
		})

		const keys = async (query: string) => {
			const res = await t.http().get(`/api/v1/metadata?${query}`).set(auth).expect(200)

			return res.body.result.items.map((m: { key: string }) => m.key).sort()
		}

		expect(await keys('key=%2F')).toEqual(['/'])
		expect(await keys('key=%2F&key=%2Fabout')).toEqual(['/', '/about'])
	})

	it('accepts a mailto address for an Email social link', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)

		await t
			.http()
			.post('/api/v1/socials')
			.set(auth)
			.send({ platform: 'EMAIL', url: 'mailto:hello@example.test' })
			.expect(201)
		await t
			.http()
			.post('/api/v1/socials')
			.set(auth)
			.send({ platform: 'GITHUB', url: 'not a url' })
			.expect(400)
	})

	it.each(['mailto:a@b', 'mailto:a@b..c', 'mailto:a@.b.c', 'mailto:a b@c.d'])(
		'refuses the malformed mailto address %s',
		async url => {
			const { auth } = await createUser(t.prisma, UserRole.ADMIN)

			const res = await t
				.http()
				.post('/api/v1/socials')
				.set(auth)
				.send({ platform: 'EMAIL', url })
				.expect(400)
			expect(JSON.stringify(res.body)).toMatch(/http\(s\) URL or a mailto: address/)
		},
	)

	it('reads isPublished=false as false', async () => {
		const { auth } = await createUser(t.prisma, UserRole.ADMIN)
		const base = { features: [], description: 'Text' }
		await t.prisma.service.create({ data: { ...base, title: 'Draft', isPublished: false } })
		await t.prisma.service.create({ data: { ...base, title: 'Live', isPublished: true } })

		const res = await t.http().get('/api/v1/services?isPublished=false').set(auth).expect(200)

		expect(res.body.result.items.map((s: { title: string }) => s.title)).toEqual(['Draft'])
	})
})
