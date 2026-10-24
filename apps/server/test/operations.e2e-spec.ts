import { UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, resetState, type TestApp } from './helpers'

describe('health, API metrics and metadata (e2e)', () => {
	let t: TestApp

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(() => resetState(t.prisma))

	describe('health', () => {
		it('reports the API, database and cache as up without signing in', async () => {
			const res = await t.http().get('/api/health').expect(200)

			expect(res.body.result).toMatchObject({
				status: 'ok',
				services: { database: 'up', redis: 'up' },
				uptime: expect.any(Number),
				responseTime: expect.stringMatching(/ms$/),
			})
		})
	})

	describe('API metrics', () => {
		const seed = () =>
			t.prisma.apiMetric.createMany({
				data: [
					{ method: 'GET', endpoint: '/api/v1/projects', status: 200, duration: 10, ip: '10.0.0.1', requestId: 'req-a', userAgent: 'test' },
					{ method: 'GET', endpoint: '/api/v1/projects', status: 200, duration: 30, ip: '10.0.0.1', requestId: 'req-b', userAgent: 'test' },
					{ method: 'POST', endpoint: '/api/v1/contacts', status: 301, duration: 50, ip: '10.0.0.2', requestId: 'req-c', userAgent: 'test' },
					{ method: 'PATCH', endpoint: '/api/v1/home/1', status: 404, duration: 70, ip: '10.0.0.3', requestId: 'req-d', userAgent: 'test' },
					{ method: 'DELETE', endpoint: '/api/v1/media/1', status: 500, duration: 90, ip: '10.0.0.4', requestId: 'req-e', userAgent: 'test' },
				],
			})

		it('needs an editor', async () => {
			const { auth } = await createUser(t.prisma, UserRole.USER)

			await t.http().get('/api/v1/api-metrics').expect(401)
			await t.http().get('/api/v1/api-metrics').set(auth).expect(403)
		})

		it('summarises durations, status classes and the busiest endpoints', async () => {
			await seed()
			const { auth } = await createUser(t.prisma, UserRole.EDITOR)

			const res = await t.http().get('/api/v1/api-metrics/stats').set(auth).expect(200)
			const stats = res.body.result

			expect(stats.statusBreakdown).toEqual({ '2xx': 2, '3xx': 1, '4xx': 1, '5xx': 1 })
			expect(stats.minDurationMs).toBe(10)
			expect(stats.maxDurationMs).toBe(90)
			expect(stats.topEndpoints[0]).toMatchObject({ endpoint: '/api/v1/projects', method: 'GET', count: 2, avgDuration: 20 })
		})

		it('reports zeros when nothing has been recorded', async () => {
			const { auth } = await createUser(t.prisma, UserRole.EDITOR)
			await t.prisma.apiMetric.deleteMany()

			const res = await t.http().get('/api/v1/api-metrics/stats').set(auth).expect(200)

			expect(res.body.result).toMatchObject({ minDurationMs: 0, maxDurationMs: 0, avgDurationMs: 0 })
		})

		it('filters by method, status, search and date, and pages', async () => {
			await seed()
			const { auth } = await createUser(t.prisma, UserRole.EDITOR)
			const list = async (query: string) => {
				const res = await t.http().get(`/api/v1/api-metrics?${query}`).set(auth).expect(200)
				return res.body.result.map((m: { requestId: string }) => m.requestId).filter((id: string) => id.startsWith('req-'))
			}

			expect(await list('method=patch')).toEqual(['req-d'])
			expect(await list('status=500')).toEqual(['req-e'])
			expect((await list('search=contacts'))).toEqual(['req-c'])
			expect((await list('search=10.0.0.1')).sort()).toEqual(['req-a', 'req-b'])
			expect((await list(`from=2000-01-01&to=2999-12-31&search=req-`)).length).toBe(5)
			expect(await list('to=2000-01-01')).toEqual([])
			expect(await list('from=2999-01-01')).toEqual([])

			const page = await t.http().get('/api/v1/api-metrics?limit=2&page=1&search=req-').set(auth).expect(200)
			expect(page.body.result).toHaveLength(2)
			// The API also records this test's own requests, whose URLs contain the search text.
			expect(page.body.count).toBeGreaterThanOrEqual(5)
		})
	})

	describe('metadata', () => {
		const create = (auth: Record<string, string>, body: Record<string, unknown>) =>
			t.http().post('/api/v1/metadata').set(auth).send({ type: 'PAGE', value: {}, ...body })

		it('creates, reads, updates, publishes and deletes a record', async () => {
			const { auth } = await createUser(t.prisma, UserRole.EDITOR)

			const created = await create(auth, { key: '/about', title: 'About', isPublished: false }).expect(201)
			const id = created.body.result.id

			await t.http().get(`/api/v1/metadata/${id}`).set(auth).expect(200)
			await t.http().patch(`/api/v1/metadata/${id}`).set(auth).send({ title: 'About Ada', key: '/about-ada' }).expect(200)

			const toggled = await t.http().patch(`/api/v1/metadata/${id}/publish`).set(auth).expect(200)
			expect(toggled.body.result.isPublished).toBe(true)

			const byKey = await t.http().get('/api/v1/metadata/key/%2Fabout-ada').expect(200)
			expect(byKey.body.result.title).toBe('About Ada')

			const published = await t.http().get('/api/v1/metadata/published').expect(200)
			expect(published.body.result.map((m: { key: string }) => m.key)).toContain('/about-ada')

			await t.http().delete(`/api/v1/metadata/${id}`).set(auth).expect(200)
			await t.http().get(`/api/v1/metadata/${id}`).set(auth).expect(404)
		})

		it('refuses a key that is already taken, on create and on rename', async () => {
			const { auth } = await createUser(t.prisma, UserRole.EDITOR)
			await create(auth, { key: '/taken' }).expect(201)
			const other = await create(auth, { key: '/other' }).expect(201)

			await create(auth, { key: '/taken' }).expect(409)
			await t.http().patch(`/api/v1/metadata/${other.body.result.id}`).set(auth).send({ key: '/taken' }).expect(409)
		})

		it('lists with search, key, type and published filters', async () => {
			const { auth } = await createUser(t.prisma, UserRole.EDITOR)
			await create(auth, { key: '/', title: 'Home', isPublished: true })
			await create(auth, { key: '/contact', title: 'Contact', isPublished: false })
			await create(auth, { key: 'layout', type: 'LAYOUT', title: 'Layout', isPublished: true })
			const keys = async (query: string) => {
				const res = await t.http().get(`/api/v1/metadata?${query}`).set(auth).expect(200)
				return res.body.result.items.map((m: { key: string }) => m.key).sort()
			}

			expect(await keys('search=cont')).toEqual(['/contact'])
			expect(await keys('key=%2F&key=layout')).toEqual(['/', 'layout'])
			expect(await keys('type=LAYOUT')).toEqual(['layout'])
			expect(await keys('isPublished=false')).toEqual(['/contact'])
		})

		it('resolves a path through its fallbacks: exact, without slash, project template, then site default', async () => {
			const { auth } = await createUser(t.prisma, UserRole.EDITOR)
			await create(auth, { key: 'home', title: 'Site default', isPublished: true })
			await create(auth, { key: 'about', title: 'About without slash', isPublished: true })
			await create(auth, { key: '/projects/[slug]', title: 'Project template', isPublished: true })
			await create(auth, { key: '/resume', title: 'Resume exact', isPublished: true })
			const title = async (pathname: string) => {
				const res = await t.http().get(`/api/v1/metadata/by-path?pathname=${encodeURIComponent(pathname)}`).expect(200)
				return res.body.result.title
			}

			expect(await title('resume/')).toBe('Resume exact')
			expect(await title('/about')).toBe('About without slash')
			expect(await title('/projects/payments')).toBe('Project template')
			expect(await title('/unknown')).toBe('Site default')
			expect(await title('')).toBe('Site default')
		})

		it('answers 404 when no record or default matches', async () => {
			await t.http().get('/api/v1/metadata/by-path?pathname=%2Fnothing').expect(404)
		})
	})
})
