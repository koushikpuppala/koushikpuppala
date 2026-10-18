import { describe, expect, it, vi } from 'vitest'

vi.mock('next/server', async importOriginal => ({
	...(await importOriginal<typeof import('next/server')>()),
	connection: async () => {},
}))

import { GET } from './route'

describe('GET /api/health', () => {
	it('reports the server as up without caching', async () => {
		const res = await GET()

		expect(res.status).toBe(200)
		expect(res.headers.get('Cache-Control')).toBe('no-store')
		await expect(res.json()).resolves.toMatchObject({ status: 'ok', uptime: expect.any(Number) })
	})
})
