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

describe('GET /resume/download', () => {
	it('redirects to the signed link the API returns, uncached', async () => {
		let method = ''
		server.use(
			http.post(DOWNLOAD, ({ request }) => {
				method = request.method
				return HttpResponse.json({
					result: { url: 'https://s3.test/resume.pdf?sig=1', fileName: 'cv_1.pdf' },
				})
			}),
		)

		const res = await GET()

		expect(method).toBe('POST')
		expect(res.status).toBe(302)
		expect(res.headers.get('Location')).toBe('https://s3.test/resume.pdf?sig=1')
		expect(res.headers.get('Cache-Control')).toBe('no-store')
	})

	it('sends the visitor back to /resume when nothing is published', async () => {
		server.use(http.post(DOWNLOAD, () => HttpResponse.json({ error: true }, { status: 404 })))

		const res = await GET()

		expect(res.status).toBe(302)
		expect(res.headers.get('Location')).toBe('/resume')
	})

	it('sends the visitor back to /resume when the API is unreachable', async () => {
		server.use(http.post(DOWNLOAD, () => HttpResponse.error()))

		const res = await GET()

		expect(res.headers.get('Location')).toBe('/resume')
	})
})
