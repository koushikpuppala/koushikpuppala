import { http, HttpResponse } from 'msw'
import { apiMetricsActions } from 'actions/api-metrics'
import { API, server } from '../../test/msw'
import { describe, expect, it, vi } from 'vitest'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

describe('apiMetricsActions.health', () => {
	it('reads the version neutral health route the API serves', async () => {
		const health = {
			uptime: 120,
			services: { database: 'up', redis: 'up' },
			timestamp: '2026-10-11T00:00:00.000Z',
			responseTime: '4ms',
			status: 'ok',
		}
		server.use(
			http.get(`${API}/api/health`, () => HttpResponse.json({ result: health, statusCode: 200 })),
		)

		const res = await apiMetricsActions.health<typeof health>()

		expect(res.data).toEqual(health)
	})
})
