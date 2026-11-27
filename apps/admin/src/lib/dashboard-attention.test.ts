import type { DashboardBlock } from 'types/components/admin'
import { describe, expect, it } from 'vitest'
import { buildAttention } from 'lib/dashboard-attention'

const block = <T>(status: DashboardBlock<T>['status'], data: T | null): DashboardBlock<T> => ({
	status,
	data,
	error: status === 'error' ? 'x' : null,
	refreshing: false,
	reload: () => {},
})

const up = { uptime: 1, timestamp: '', responseTime: '1ms', status: 'ok' as const }
const healthy = block('ready', { health: { ...up, services: { database: 'up', redis: 'up' } }, checkedAt: new Date() })

describe('buildAttention', () => {
	it('never reports a negative unpublished count', () => {
		const state = buildAttention({
			contacts: block('ready', { total: 0, unread: 0, recent: [] }),
			projects: block('ready', { total: 2, published: 5 }),
			health: healthy,
		})

		expect(state.items).toEqual([])
		expect(state.clear).toBe(true)
	})

	it('adds one item per service that is down', () => {
		const state = buildAttention({
			contacts: block('ready', { total: 0, unread: 0, recent: [] }),
			projects: block('ready', { total: 1, published: 1 }),
			health: block('ready', { health: { ...up, status: 'degraded', services: { database: 'down', redis: 'down' } }, checkedAt: new Date() }),
		})

		expect(state.items.map(item => item.id)).toEqual(['database-down', 'redis-down'])
	})

	it('is not clear while a source is loading or failed', () => {
		const loading = buildAttention({ contacts: block('loading', null), projects: block('ready', { total: 1, published: 1 }), health: healthy })
		const failed = buildAttention({ contacts: block('error', null), projects: block('ready', { total: 1, published: 1 }), health: healthy })

		expect(loading).toMatchObject({ clear: false, loading: 1 })
		expect(failed).toMatchObject({ clear: false, unavailable: ['contacts'] })
	})

	it('keeps a stale item when a refresh fails and flags an unreachable health check', () => {
		const state = buildAttention({
			contacts: block('error', { total: 4, unread: 3, recent: [] }),
			projects: block('ready', { total: 1, published: 1 }),
			health: block('error', null),
		})

		expect(state.items.map(item => item.id)).toEqual(['unread', 'health-unreachable'])
	})
})
