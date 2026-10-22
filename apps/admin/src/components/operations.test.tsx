import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { API, server } from '../../test/msw'
import { UsersView } from 'components/users/users-view'
import { MessagesView } from 'components/messages/messages-view'
import { AuditLogsView } from 'components/audit-logs/audit-logs-view'
import { ApiMetricsView } from 'components/api-metrics/api-metrics-view'
import { MediaView } from 'components/media/media-view'
import { DashboardView } from 'components/dashboard/dashboard-view'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))
vi.mock('lib/auth', () => ({
	useAuth: () => ({ user: { email: 'admin@example.test', displayName: 'Ada', role: 'ADMIN' } }),
}))

const params = vi.hoisted(() => ({ current: new URLSearchParams() }))
vi.mock('next/navigation', () => ({
	usePathname: () => '/',
	useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
	useSearchParams: () => params.current,
}))

let requests: Array<{ method: string; path: string; search: string; body: unknown }>

const record = async (request: Request) => {
	const url = new URL(request.url)
	requests.push({
		method: request.method,
		path: url.pathname,
		search: url.search,
		body: await request.clone().json().catch(() => null),
	})
}

const ok = (result: unknown, extra = {}) => HttpResponse.json({ result, statusCode: 200, ...extra })

beforeEach(() => {
	requests = []
	params.current = new URLSearchParams()
})

afterEach(() => vi.restoreAllMocks())

describe('UsersView', () => {
	const users = [
		{ id: 'u1', email: 'admin@example.test', name: 'Ada', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
		{ id: 'u2', email: 'grace@example.test', name: 'Grace', role: 'EDITOR', status: 'INACTIVE', createdAt: '2026-02-01T00:00:00.000Z' },
		{ id: 'u3', email: 'linus@example.test', name: '', role: 'USER', status: 'SUSPENDED', createdAt: '2026-03-01T00:00:00.000Z' },
	]

	beforeEach(() => {
		server.use(
			http.get(`${API}/api/v1/users`, async ({ request }) => {
				await record(request)
				return ok({ items: users, pagination: { total: 3 }, adminCount: 1, editorCount: 1, activeCount: 1 })
			}),
			http.all(`${API}/api/v1/users/:id`, async ({ request }) => {
				await record(request)
				return request.method === 'DELETE' ? new HttpResponse(null, { status: 204 }) : ok(users[1])
			}),
		)
	})

	it('lists users with role and status badges and the whole table counts', async () => {
		render(<UsersView />)

		expect(await screen.findByText('grace@example.test')).toBeInTheDocument()
		expect(screen.getByText('linus')).toBeInTheDocument()
		for (const badge of ['ADMIN', 'EDITOR', 'USER', 'ACTIVE', 'INACTIVE', 'SUSPENDED'])
			expect(screen.getAllByText(badge).length).toBeGreaterThan(0)
		expect(screen.getByText('Administrators').closest('div')?.parentElement).toHaveTextContent('1')
	})

	it('cannot delete the signed in account, only others', async () => {
		render(<UsersView />)
		await screen.findByText('grace@example.test')

		expect(screen.queryByRole('button', { name: 'Delete admin@example.test' })).not.toBeInTheDocument()
		await userEvent.click(screen.getByRole('button', { name: 'Delete grace@example.test' }))
		await userEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Revoke & Delete' }))

		await waitFor(() =>
			expect(requests).toContainEqual(expect.objectContaining({ method: 'DELETE', path: '/api/v1/users/u2' })),
		)
	})

	it('changes a role and status from the edit dialog', async () => {
		render(<UsersView />)
		await screen.findByText('grace@example.test')

		await userEvent.click(screen.getByRole('button', { name: 'Edit grace@example.test' }))
		const dialog = await screen.findByRole('dialog')
		await userEvent.click(within(dialog).getByRole('button', { name: 'Edit user role' }))
		await userEvent.click(await screen.findByRole('option', { name: /^ADMIN/ }))
		await userEvent.click(within(dialog).getByRole('button', { name: 'Edit user status' }))
		await userEvent.click(await screen.findByRole('option', { name: /^ACTIVE/ }))
		await userEvent.click(within(dialog).getByRole('button', { name: 'Save Permissions' }))

		await waitFor(() =>
			expect(requests).toContainEqual(
				expect.objectContaining({ method: 'PATCH', path: '/api/v1/users/u2', body: { role: 'ADMIN', status: 'ACTIVE' } }),
			),
		)
	})

	it('reloads the list on refresh', async () => {
		render(<UsersView />)
		await screen.findByText('grace@example.test')
		const before = requests.filter(r => r.method === 'GET').length

		await userEvent.click(screen.getByRole('button', { name: /refresh/i }))

		await waitFor(() => expect(requests.filter(r => r.method === 'GET').length).toBeGreaterThan(before))
	})
})

describe('MessagesView', () => {
	const unread = {
		id: 'c1',
		name: 'Grace Hopper',
		email: 'grace@example.test',
		subject: 'Compiler project',
		message: 'Can we talk about compilers?',
		status: 'UNREAD',
		priority: 'HIGH',
		internalNotes: '',
		createdAt: '2026-10-01T10:00:00.000Z',
	}
	const read = { ...unread, id: 'c2', name: 'Alan Turing', subject: '', status: 'RESOLVED', priority: 'LOW' }

	beforeEach(() => {
		server.use(
			http.get(`${API}/api/v1/contacts`, () =>
				ok({ items: [unread, read], pagination: { total: 2 }, unreadCount: 1, urgentCount: 0, resolvedCount: 1 }),
			),
			http.all(`${API}/api/v1/contacts/:id`, async ({ request, params: p }) => {
				await record(request)
				if (request.method === 'DELETE') return new HttpResponse(null, { status: 204 })
				return ok(p.id === 'c2' ? read : unread)
			}),
		)
	})

	it('marks an unread message as read when it is opened, and saves triage notes', async () => {
		render(<MessagesView />)

		await userEvent.click(await screen.findByRole('button', { name: 'Inspect message from Grace Hopper' }))

		const dialog = await screen.findByRole('dialog')
		expect(within(dialog).getByText('Can we talk about compilers?')).toBeInTheDocument()
		expect(within(dialog).getByRole('link', { name: /reply/i })).toHaveAttribute(
			'href',
			expect.stringContaining('mailto:grace@example.test?subject=Re%3A%20Compiler%20project'),
		)
		await waitFor(() =>
			expect(requests).toContainEqual(expect.objectContaining({ method: 'PATCH', body: { status: 'READ' } })),
		)

		await userEvent.type(within(dialog).getByLabelText('Internal Triage Notes'), 'Reply this week')
		await userEvent.click(within(dialog).getByRole('button', { name: 'Save Triage Status' }))

		await waitFor(() =>
			expect(requests).toContainEqual(
				expect.objectContaining({
					method: 'PATCH',
					body: { internalNotes: 'Reply this week', status: 'READ', priority: 'HIGH' },
				}),
			),
		)
	})

	it('shows the error when saving triage fails', async () => {
		render(<MessagesView />)
		await userEvent.click(await screen.findByRole('button', { name: 'Inspect message from Alan Turing' }))
		server.use(http.patch(`${API}/api/v1/contacts/:id`, () => HttpResponse.json({ message: 'Locked' }, { status: 423 })))

		const dialog = await screen.findByRole('dialog')
		await userEvent.click(within(dialog).getByRole('button', { name: 'Save Triage Status' }))

		expect(await within(dialog).findByText(/Locked/)).toBeInTheDocument()
	})

	it('deletes a message from the dialog after confirmation', async () => {
		render(<MessagesView />)
		await userEvent.click(await screen.findByRole('button', { name: 'Inspect message from Alan Turing' }))

		await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: /delete inquiry/i }))
		const confirm = await screen.findByRole('alertdialog')
		await userEvent.click(within(confirm).getAllByRole('button').at(-1) as HTMLElement)

		await waitFor(() =>
			expect(requests).toContainEqual(expect.objectContaining({ method: 'DELETE', path: '/api/v1/contacts/c2' })),
		)
	})

	it('opens the message linked from an email notification', async () => {
		params.current = new URLSearchParams('id=c1')
		render(<MessagesView />)

		expect(await screen.findByRole('dialog')).toHaveTextContent('Compiler project')
		expect(requests).toContainEqual(expect.objectContaining({ method: 'GET', path: '/api/v1/contacts/c1' }))
	})
})

describe('AuditLogsView', () => {
	const logs = [
		{ id: 'a1', action: 'UPDATE', entity: 'Project', entityId: 'p1', actor: 'Ada', actorEmail: 'ada@example.test', ipAddress: '10.0.0.1', oldData: { title: 'Old', featured: false }, newData: { title: 'New', featured: true }, createdAt: '2026-10-01T10:00:00.000Z' },
		{ id: 'a2', action: 'CREATE', entity: 'Service', entityId: 's1', actor: 'ada@example.test', actorEmail: 'ada@example.test', newData: { title: 'Frontend', features: ['React'] }, createdAt: '2026-10-02T10:00:00.000Z' },
		{ id: 'a3', action: 'DELETE', entity: 'Media', entityId: 'm1', actor: 'Ada', oldData: { fileName: 'old.png', size: 10 }, createdAt: '2026-10-03T10:00:00.000Z' },
		{ id: 'a4', action: 'LOGIN', entity: 'Session', entityId: 'sess', actor: 'Ada', createdAt: '2026-10-04T10:00:00.000Z' },
		{ id: 'a5', action: 'PUBLISH', entity: 'Home', entityId: 'h1', actor: 'Ada', createdAt: '2026-10-05T10:00:00.000Z' },
	]

	beforeEach(() => {
		server.use(
			http.get(`${API}/api/v1/audit-logs`, async ({ request }) => {
				await record(request)
				return ok(logs, { count: 40 })
			}),
		)
	})

	const openPayload = async (index: number) => {
		const buttons = await screen.findAllByRole('button', { name: /payload/i })
		await userEvent.click(buttons[index] as HTMLElement)
		return screen.findByRole('dialog')
	}

	it('lists events with their actors and sends the URL filters to the API', async () => {
		params.current = new URLSearchParams('search=ada&action=UPDATE&page=2')
		render(<AuditLogsView />)

		expect(await screen.findAllByText('Project')).not.toHaveLength(0)
		expect(screen.getByText('10.0.0.1')).toBeInTheDocument()
		expect(screen.getAllByText('Internal').length).toBeGreaterThan(0)
		expect(requests[0]?.search).toContain('search=ada')
		expect(requests[0]?.search).toContain('action=UPDATE')
		expect(requests[0]?.search).toContain('page=2')
	})

	it('shows what changed for an update', async () => {
		render(<AuditLogsView />)
		const dialog = await openPayload(0)

		expect(within(dialog).getByText('What changed')).toBeInTheDocument()
		expect(within(dialog).getByText('Old')).toBeInTheDocument()
		expect(within(dialog).getByText('New')).toBeInTheDocument()
	})

	it('shows the created record, the removed record, and a note for sign ins and empty events', async () => {
		render(<AuditLogsView />)

		let dialog = await openPayload(1)
		expect(within(dialog).getByText('Created with')).toBeInTheDocument()
		fireEvent.keyDown(dialog, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

		dialog = await openPayload(2)
		expect(within(dialog).getByText('Record before it was removed')).toBeInTheDocument()
		fireEvent.keyDown(dialog, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

		dialog = await openPayload(3)
		expect(within(dialog).getByText(/sign in events record who/i)).toBeInTheDocument()
		fireEvent.keyDown(dialog, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

		dialog = await openPayload(4)
		expect(within(dialog).getByText(/saved no record data/i)).toBeInTheDocument()
	})

	it('shows an error banner when the API fails', async () => {
		server.use(http.get(`${API}/api/v1/audit-logs`, () => HttpResponse.json({ message: 'Audit store down' }, { status: 500 })))
		render(<AuditLogsView />)

		expect(await screen.findByText(/Audit store down/)).toBeInTheDocument()
	})
})

describe('ApiMetricsView', () => {
	const health = { status: 'ok', uptime: 93784, responseTime: '3ms', timestamp: '', services: { database: 'up', redis: 'down' } }
	const stats = { totalRequests: 1200, avgDurationMs: 42, minDurationMs: 1, maxDurationMs: 900, statusBreakdown: { '2xx': 1000, '3xx': 20, '4xx': 150, '5xx': 30 }, topEndpoints: [] }
	const metric = (id: string, method: string, status: number, duration: number) => ({
		id,
		ip: '10.0.0.1',
		method,
		status,
		duration,
		endpoint: `/api/v1/${id}`,
		requestId: `req-${id}`,
		userAgent: 'test',
		createdAt: '2026-10-01T10:00:00.000Z',
	})
	const metrics = [
		metric('a', 'GET', 200, 12),
		metric('b', 'POST', 301, 250),
		metric('c', 'PATCH', 404, 900),
		metric('d', 'PUT', 500, 2500),
		metric('e', 'DELETE', 204, 30),
		metric('f', 'OPTIONS', 100, 5),
	]

	const serve = (h = health) =>
		server.use(
			http.get(`${API}/api/health`, () => ok(h)),
			http.get(`${API}/api/v1/api-metrics/stats`, () => ok(stats)),
			http.get(`${API}/api/v1/api-metrics`, async ({ request }) => {
				await record(request)
				return ok(metrics, { count: 60 })
			}),
		)

	it('shows service health, uptime, totals and each request with its method and status', async () => {
		serve()
		render(<ApiMetricsView />)

		expect(await screen.findByText('Operational')).toBeInTheDocument()
		expect(screen.getByText('1d 2h 3m')).toBeInTheDocument()
		expect(screen.getByText('1200')).toBeInTheDocument()
		for (const method of ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'])
			expect(screen.getAllByText(method).length).toBeGreaterThan(0)
		for (const status of ['200', '301', '404', '500'])
			expect(screen.getAllByText(status).length).toBeGreaterThan(0)
		expect(screen.getByText('/api/v1/a')).toBeInTheDocument()
	})

	it.each([
		[{ ...health, status: 'degraded', uptime: 7300 }, 'Degraded', '2h 1m'],
		[{ ...health, uptime: 125 }, 'Operational', '2m 5s'],
		[{ ...health, uptime: 0 }, 'Operational', 'Online'],
	])('formats a degraded or short uptime', async (h, state, uptime) => {
		serve(h as typeof health)
		render(<ApiMetricsView />)

		expect(await screen.findByText(state)).toBeInTheDocument()
		expect(screen.getByText(uptime)).toBeInTheDocument()
	})

	it('reloads every ten seconds while auto refresh is on', async () => {
		serve()
		const intervals: Array<() => void> = []
		const realSetInterval = window.setInterval
		vi.spyOn(window, 'setInterval').mockImplementation(((callback: () => void, ms?: number) => {
			if (ms === 10000) intervals.push(callback)
			return realSetInterval(() => undefined, 1_000_000)
		}) as typeof window.setInterval)
		render(<ApiMetricsView />)
		await screen.findByText('Operational')

		await userEvent.click(screen.getByRole('button', { name: /auto/i }))
		const before = requests.length
		intervals.at(-1)?.()

		await waitFor(() => expect(requests.length).toBeGreaterThan(before))
	})
})

describe('MediaView', () => {
	const asset = (id: string, extra = {}) => ({
		id,
		fileName: `${id}.png`,
		originalName: `${id}.png`,
		url: `https://assets.example.com/${id}.png`,
		storageKey: `general/${id}.png`,
		mimeType: 'image/png',
		size: 2048,
		createdAt: '2026-10-01T10:00:00.000Z',
		...extra,
	})

	const serve = () =>
		server.use(
			http.get(`${API}/api/v1/media`, async ({ request }) => {
				await record(request)
				const page = new URL(request.url).searchParams.get('page')
				const items = page === '2' ? [asset('m3', { mimeType: 'application/pdf', size: 3_000_000 })] : [asset('m1'), asset('m2', { size: 500 })]
				return ok({ items, pagination: { total: 3 } })
			}),
			http.delete(`${API}/api/v1/media/:id`, async ({ request }) => {
				await record(request)
				return new HttpResponse(null, { status: 204 })
			}),
		)

	it('loads more assets, filters by type and searches after a pause', async () => {
		serve()
		render(<MediaView />)

		expect(await screen.findByText('m1.png')).toBeInTheDocument()
		await userEvent.click(screen.getByRole('button', { name: /load more/i }))
		expect(await screen.findByText('m3.png')).toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: /^images?$/i }))
		await waitFor(() => expect(requests.some(r => r.search.includes('type=IMAGE'))).toBe(true))

		await userEvent.type(screen.getByPlaceholderText(/search assets/i), 'hero')
		await waitFor(() => expect(requests.some(r => r.search.includes('search=hero'))).toBe(true), { timeout: 2000 })
	})

	it('copies an asset URL and deletes an asset after confirmation', async () => {
		serve()
		const writeText = vi.fn(async () => undefined)
		Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
		render(<MediaView />)
		await screen.findByText('m1.png')

		await userEvent.click(screen.getAllByTitle('Copy URL')[0] as HTMLElement)
		expect(writeText).toHaveBeenCalledWith('https://assets.example.com/m1.png')

		await userEvent.click(screen.getAllByTitle('Delete asset')[0] as HTMLElement)
		const confirm = await screen.findByRole('alertdialog')
		await userEvent.click(within(confirm).getAllByRole('button').at(-1) as HTMLElement)

		await waitFor(() =>
			expect(requests).toContainEqual(expect.objectContaining({ method: 'DELETE', path: '/api/v1/media/m1' })),
		)
	})

	it('uploads a file through a presigned URL and adds it to the top of the grid', async () => {
		serve()
		server.use(
			http.post(`${API}/api/v1/media/presigned-url`, () =>
				ok({ uploadUrl: 'https://bucket.example.com/upload', storageKey: 'general/new.png', url: '' }),
			),
			http.put('https://bucket.example.com/upload', () => new HttpResponse(null, { status: 200 })),
			http.post(`${API}/api/v1/media/complete`, () =>
				ok({ id: 'new', fileName: 'new.png', url: 'https://assets.example.com/new.png', storageKey: 'general/new.png' }),
			),
		)
		const { container } = render(<MediaView />)
		await screen.findByText('m1.png')

		const input = container.querySelector('input[type="file"]') as HTMLInputElement
		await userEvent.upload(input, new File(['png'], 'new.png', { type: 'image/png' }))

		expect(await screen.findByText('new.png')).toBeInTheDocument()
	})

	it('shows the upload error when signing fails', async () => {
		serve()
		server.use(http.post(`${API}/api/v1/media/presigned-url`, () => HttpResponse.json({ message: 'Type not allowed' }, { status: 400 })))
		const { container } = render(<MediaView />)
		await screen.findByText('m1.png')

		await userEvent.upload(container.querySelector('input[type="file"]') as HTMLInputElement, new File(['x'], 'x.png', { type: 'image/png' }))

		expect(await screen.findByText(/Type not allowed/)).toBeInTheDocument()
	})
})

describe('DashboardView', () => {
	const serve = (contactsStatus = 200) =>
		server.use(
			http.get(`${API}/api/v1/projects`, ({ request }) =>
				ok({ items: [], pagination: { total: new URL(request.url).searchParams.get('isPublished') ? 3 : 5 } }),
			),
			http.get(`${API}/api/v1/contacts`, () =>
				contactsStatus === 200
					? ok({
							items: [{ id: 'c1', name: 'Grace', email: 'g@example.test', subject: 'Hello', status: 'UNREAD', createdAt: '2026-10-01T00:00:00.000Z' }],
							pagination: { total: 4 },
							unreadCount: 2,
						})
					: HttpResponse.json({ message: 'Inbox offline' }, { status: contactsStatus }),
			),
			http.get(`${API}/api/v1/media`, () => ok({ items: [], pagination: { total: 9 } })),
			http.get(`${API}/api/v1/audit-logs`, () =>
				ok([{ id: 'a1', action: 'UPDATE', entity: 'Project', entityId: 'p1', actor: 'Ada', createdAt: '2026-10-01T00:00:00.000Z' }]),
			),
			http.get(`${API}/api/health`, () => ok({ status: 'ok', uptime: 1, responseTime: '2ms', timestamp: '', services: { database: 'up', redis: 'up' } })),
		)

	it('shows counts, recent inquiries, recent changes and service health', async () => {
		serve()
		render(<DashboardView />)

		expect(await screen.findByText('3 Published')).toBeInTheDocument()
		expect(screen.getByText('2 Unread')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Review' })).toHaveAttribute('href', '/messages?id=c1')
		expect(screen.getAllByText('Project').length).toBeGreaterThan(0)
		expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
	})

	it('shows the first failure with a retry', async () => {
		serve(503)
		render(<DashboardView />)

		expect(await screen.findByText(/Inbox offline/)).toBeInTheDocument()

		serve()
		await userEvent.click(screen.getByRole('button', { name: /retry/i }))

		expect(await screen.findByText('2 Unread')).toBeInTheDocument()
	})
})
