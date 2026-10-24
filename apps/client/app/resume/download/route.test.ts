// @vitest-environment node
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { API, server } from '../../../test/msw'

vi.mock('next/server', async importOriginal => ({
	...(await importOriginal<typeof import('next/server')>()),
	connection: async () => {},
}))

import { GET } from './route'

const DOWNLOAD = `${API}/api/v1/resume/download`

const visit = (headers: Record<string, string> = {}) =>
	new Request('http://site.test/resume/download', { headers })

describe('GET /resume/download', () => {
	it('redirects to the signed link the API returns, uncached', async () => {
		let method = ''
		let forwarded: string | null = null
		let agent: string | null = null
		server.use(
			http.post(DOWNLOAD, ({ request }) => {
				method = request.method
				forwarded = request.headers.get('x-forwarded-for')
				agent = request.headers.get('user-agent')
				return HttpResponse.json({
					result: { url: 'https://s3.test/resume.pdf?sig=1', fileName: 'cv_1.pdf' },
				})
			}),
		)

		const res = await GET(
			visit({ 'x-forwarded-for': '198.51.100.7, 203.0.113.9', 'user-agent': 'Visitor/1.0' }),
		)

		expect(method).toBe('POST')
		expect(forwarded).toBe('203.0.113.9')
		expect(agent).toBe('Visitor/1.0')
		expect(res.status).toBe(302)
		expect(res.headers.get('Location')).toBe('https://s3.test/resume.pdf?sig=1')
		expect(res.headers.get('Cache-Control')).toBe('no-store')
	})

	it('sends the visitor back to /resume when nothing is published', async () => {
		server.use(http.post(DOWNLOAD, () => HttpResponse.json({ error: true }, { status: 404 })))

		const res = await GET(visit())

		expect(res.status).toBe(302)
		expect(res.headers.get('Location')).toBe('/resume#download-unavailable')
	})

	it('sends the visitor back to /resume when the API is unreachable', async () => {
		server.use(http.post(DOWNLOAD, () => HttpResponse.error()))

		const res = await GET(visit())

		expect(res.headers.get('Location')).toBe('/resume#download-unavailable')
	})

	it('answers the router fetch from a Link click without counting a download', async () => {
		const res = await GET(visit({ rsc: '1' }))

		expect(res.status).toBe(204)
		expect(res.headers.get('Location')).toBeNull()
	})
})
