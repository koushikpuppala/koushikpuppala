import { describe, expect, it } from 'vitest'
import { buildDashboardMetrics, firstError, listTotal } from './dashboard-metrics'

const ok = <T>(data: T, count?: number) => ({ data, error: null, count })

const contact = (id: string, status: 'UNREAD' | 'READ') => ({
	id,
	name: id,
	email: `${id}@example.com`,
	subject: 'Hello',
	createdAt: '2026-01-01T00:00:00.000Z',
	status,
})

describe('dashboard metrics', () => {
	it('counts a page by its total and a bare list by its length', () => {
		expect(
			listTotal({ items: [1], pagination: { page: 1, limit: 1, total: 9, totalPages: 9 } }),
		).toBe(9)
		expect(listTotal([1, 2, 3])).toBe(3)
		expect(listTotal(null)).toBe(0)
	})

	it('prefers the counts the API sends over counting the page', () => {
		const metrics = buildDashboardMetrics({
			projects: ok({ pagination: { page: 1, limit: 1, total: 12, totalPages: 12 } }),
			published: ok({ pagination: { page: 1, limit: 1, total: 4, totalPages: 4 } }),
			contacts: ok({
				items: [contact('a', 'UNREAD'), contact('b', 'READ')],
				pagination: { page: 1, limit: 5, total: 30, totalPages: 6 },
				unreadCount: 7,
			}),
			media: ok([1, 2], 40),
			audits: ok([], 3),
		})

		expect(metrics).toMatchObject({
			projectsCount: 12,
			publishedProjects: 4,
			inboxCount: 30,
			unreadInquiries: 7,
			mediaCount: 40,
			auditEventsCount: 3,
		})
		expect(metrics.recentContacts).toHaveLength(2)
	})

	it('falls back to counting unread messages on the page', () => {
		const metrics = buildDashboardMetrics({
			projects: ok({}),
			published: ok({}),
			contacts: ok([contact('a', 'UNREAD'), contact('b', 'UNREAD'), contact('c', 'READ')]),
			media: ok(null),
			audits: ok(null),
		})

		expect(metrics).toMatchObject({ unreadInquiries: 2, inboxCount: 3, mediaCount: 0 })
	})

	it('reports the first failed request', () => {
		const failed = { data: null, error: 'media down' }

		expect(
			firstError({
				projects: ok({}),
				published: ok({}),
				contacts: ok([]),
				media: failed,
				audits: ok([]),
			}),
		).toBe('media down')
	})
})
