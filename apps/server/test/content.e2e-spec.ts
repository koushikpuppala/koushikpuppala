import { UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { bootApp, createUser, isRevalidateRequest, resetState, type TestApp } from './helpers'

const project = (slug: string) => ({
	slug,
	title: 'Payments Platform',
	subtitle: 'Ledger and payouts',
	category: 'Backend',
	descriptions: ['Moves money.'],
	tags: ['fintech'],
	sortOrder: 3,
})

describe('CMS content (e2e)', () => {
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

	it('publishes a project to the public API', async () => {
		const created = await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send(project('pay'))
			.expect(201)
		const id = created.body.result.id

		expect((await t.http().get('/api/v1/projects/published').expect(200)).body.result).toEqual([])
		await t.http().get('/api/v1/projects/published/pay').expect(404)

		await t.http().patch(`/api/v1/projects/${id}/publish`).set(auth).expect(200)

		const published = await t.http().get('/api/v1/projects/published/pay').expect(200)
		expect(published.body.result).toMatchObject({ slug: 'pay', title: 'Payments Platform' })
	})

	it('rejects fields the DTO does not declare', async () => {
		const res = await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send({ ...project('x'), status: 'PUBLISHED', id: 'nope' })
			.expect(400)

		expect(res.body.message).toMatch(/property id should not exist/)
	})

	it('changes only the fields a PATCH sends', async () => {
		const created = await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send({ ...project('keep'), isPublished: true, featured: true })
			.expect(201)
		const id = created.body.result.id

		await t.http().patch(`/api/v1/projects/${id}`).set(auth).send({ title: 'Renamed' }).expect(200)

		const row = await t.prisma.project.findUniqueOrThrow({ where: { id } })
		expect(row).toMatchObject({
			title: 'Renamed',
			isPublished: true,
			featured: true,
			tags: ['fintech'],
			sortOrder: 3,
		})
	})

	it('frees the slug when a project is deleted', async () => {
		const created = await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send(project('reuse'))
			.expect(201)

		await t.http().delete(`/api/v1/projects/${created.body.result.id}`).set(auth).expect(200)
		await t.http().post('/api/v1/projects').set(auth).send(project('reuse')).expect(201)
	})

	it('rejects blank required text', async () => {
		await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send({ ...project('blank'), title: '' })
			.expect(400)

		const created = await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send(project('kept'))
			.expect(201)

		await t
			.http()
			.patch(`/api/v1/projects/${created.body.result.id}`)
			.set(auth)
			.send({ title: '' })
			.expect(400)
	})

	it('rejects an end date before the start date', async () => {
		const experience = {
			title: 'Engineer',
			organization: 'Acme',
			location: 'Remote',
			employmentType: 'FULL_TIME',
			startDate: '2025-06-01',
			description: ['Built things.'],
		}

		await t
			.http()
			.post('/api/v1/experience')
			.set(auth)
			.send({ ...experience, endDate: '2025-01-01' })
			.expect(400)

		const created = await t
			.http()
			.post('/api/v1/experience')
			.set(auth)
			.send({ ...experience, endDate: '2025-12-01' })
			.expect(201)

		await t
			.http()
			.patch(`/api/v1/experience/${created.body.result.id}`)
			.set(auth)
			.send({ endDate: '2025-01-01' })
			.expect(400)
	})

	it('asks the public site to refresh after a successful write only', async () => {
		const realFetch = globalThis.fetch
		const fetchSpy = vi
			.spyOn(globalThis, 'fetch')
			.mockImplementation((input, init) =>
				isRevalidateRequest(input) ? Promise.resolve(new Response('{}')) : realFetch(input, init),
			)

		try {
			await t.http().post('/api/v1/projects').set(auth).send({ slug: 'bad' }).expect(400)
			await t.http().post('/api/v1/projects').set(auth).send(project('ok')).expect(201)

			await vi.waitFor(() =>
				expect(fetchSpy).toHaveBeenCalledWith(
					'http://revalidate.test/api/revalidate',
					expect.objectContaining({
						method: 'POST',
						body: JSON.stringify({ tags: ['projects'] }),
						headers: expect.objectContaining({ 'x-revalidate-secret': 'test-revalidate-secret' }),
					}),
				),
			)
			const revalidations = fetchSpy.mock.calls.filter(([url]) => isRevalidateRequest(url))
			expect(revalidations).toHaveLength(1)
		} finally {
			fetchSpy.mockRestore()
		}
	})
})
