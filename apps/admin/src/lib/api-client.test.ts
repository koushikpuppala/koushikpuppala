import { http, HttpResponse } from 'msw'
import { adminFetch } from './api-client'
import { API, server } from '../../test/msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getIdToken = vi.fn<() => Promise<string | null>>()
vi.mock('lib/firebase', () => ({ getIdToken: () => getIdToken() }))

describe('adminFetch', () => {
	beforeEach(() => getIdToken.mockResolvedValue('id-token-1'))

	it('sends the signed in user token and unwraps the API envelope', async () => {
		let authorization: string | null = null
		server.use(
			http.get(`${API}/api/v1/projects`, ({ request }) => {
				authorization = request.headers.get('authorization')
				return HttpResponse.json({
					result: [{ id: 'p1' }],
					count: 1,
					statusCode: 200,
					message: 'ok',
				})
			}),
		)

		const res = await adminFetch<{ id: string }[]>('/api/v1/projects')

		expect(authorization).toBe('Bearer id-token-1')
		expect(res).toEqual({ data: [{ id: 'p1' }], error: null, count: 1, statusCode: 200 })
	})

	it('sends no Authorization header when nobody is signed in', async () => {
		getIdToken.mockResolvedValue(null)
		let hasAuth = true
		server.use(
			http.get(`${API}/api/v1/auth/me`, ({ request }) => {
				hasAuth = request.headers.has('authorization')
				return HttpResponse.json({ message: 'Authorization header is missing' }, { status: 401 })
			}),
		)

		const res = await adminFetch('/api/v1/auth/me')

		expect(hasAuth).toBe(false)
		expect(res).toMatchObject({
			data: null,
			error: 'Authorization header is missing',
			statusCode: 401,
		})
	})

	it('maps API errors to the server message', async () => {
		server.use(
			http.post(`${API}/api/v1/projects`, () =>
				HttpResponse.json(
					{ error: true, message: 'property status should not exist' },
					{ status: 400 },
				),
			),
		)

		const res = await adminFetch('/api/v1/projects', { method: 'POST', body: '{}' })

		expect(res).toMatchObject({
			data: null,
			error: 'property status should not exist',
			statusCode: 400,
		})
	})

	it('reports a network failure as 503', async () => {
		server.use(http.get(`${API}/api/v1/home`, () => HttpResponse.error()))

		const res = await adminFetch('/api/v1/home')

		expect(res.statusCode).toBe(503)
		expect(res.error).toBeTruthy()
	})
})
