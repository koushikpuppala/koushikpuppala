import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API, server } from '../../../test/msw'
import { AboutView } from './about-view'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

const about = {
	id: 'about-1',
	title: 'Engineer and mathematician',
	leadStatement: 'I turn ideas into working systems.',
	content: 'Short overview.',
	biography: 'Long biography.',
	location: 'London',
	ctaLabel: 'Say hello',
	ctaUrl: '/contact',
	highlights: ['Write the spec first'],
	stats: [{ label: 'Years', value: '3', detail: 'shipping' }],
	isPublished: true,
}

let requests: Array<{ method: string; path: string; body: unknown }>

const serve = (live: unknown[] = [about], drafts: unknown[] = []) =>
	server.use(
		http.get(`${API}/api/v1/about`, ({ request }) => {
			const onlyLive = new URL(request.url).searchParams.has('isPublished')
			return HttpResponse.json({ result: { items: onlyLive ? live : drafts }, statusCode: 200 })
		}),
		http.patch(`${API}/api/v1/about/:id`, async ({ request }) => {
			requests.push({ method: 'PATCH', path: new URL(request.url).pathname, body: await request.json() })
			return HttpResponse.json({ result: { ...about, isPublished: true } })
		}),
		http.patch(`${API}/api/v1/about/:id/publish`, async ({ request }) => {
			requests.push({ method: 'PATCH', path: new URL(request.url).pathname, body: null })
			return HttpResponse.json({ result: { ...about, isPublished: false } })
		}),
	)

beforeEach(() => {
	requests = []
})

describe('AboutView', () => {
	it('edits text, stats and the How I work list, then saves', async () => {
		serve()
		render(<AboutView />)

		const heading = await screen.findByLabelText(/heading title/i)
		expect(heading).toHaveValue('Engineer and mathematician')

		await userEvent.type(screen.getByLabelText(/lead statement/i), ' Fast.')
		await userEvent.type(screen.getByLabelText('New stat label'), 'Projects')
		await userEvent.type(screen.getByLabelText('New stat value'), '12')
		await userEvent.type(screen.getByLabelText('New stat detail'), 'shipped')
		let statRow = screen.getByLabelText('New stat label').parentElement as HTMLElement
		while (!within(statRow).queryByRole('button', { name: /^add$/i })) statRow = statRow.parentElement as HTMLElement
		await userEvent.click(within(statRow).getByRole('button', { name: /^add$/i }))
		await userEvent.click(screen.getByRole('button', { name: 'Remove Years stat' }))
		await userEvent.type(screen.getByPlaceholderText(/add a way you work/i), 'Ship small{Enter}')

		await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

		expect(await screen.findByText(/saved/i)).toBeInTheDocument()
		expect(requests[0]).toMatchObject({
			method: 'PATCH',
			path: '/api/v1/about/about-1',
			body: expect.objectContaining({
				leadStatement: 'I turn ideas into working systems. Fast.',
				stats: [{ label: 'Projects', value: '12', detail: 'shipped' }],
				highlights: ['Write the spec first', 'Ship small'],
			}),
		})
	})

	it('discards unsaved edits by loading the record again', async () => {
		serve()
		render(<AboutView />)
		const heading = await screen.findByLabelText(/heading title/i)

		await userEvent.type(heading, ' extra')
		await userEvent.click(screen.getByRole('button', { name: /discard/i }))

		await waitFor(() => expect(screen.getByLabelText(/heading title/i)).toHaveValue('Engineer and mathematician'))
	})

	it('unpublishes the page', async () => {
		serve()
		render(<AboutView />)
		await screen.findByLabelText(/heading title/i)

		await userEvent.click(screen.getByRole('button', { name: 'Unpublish' }))

		expect(await screen.findByText(/moved back to draft/i)).toBeInTheDocument()
		expect(requests).toContainEqual(expect.objectContaining({ path: '/api/v1/about/about-1/publish' }))
	})

	it('falls back to the newest draft when nothing is published', async () => {
		serve([], [{ ...about, id: 'draft-1', title: 'Draft title', isPublished: false }])
		render(<AboutView />)

		expect(await screen.findByDisplayValue('Draft title')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
	})

	it('refuses to save without a heading', async () => {
		serve()
		render(<AboutView />)
		const heading = await screen.findByLabelText(/heading title/i)

		await userEvent.clear(heading)
		await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

		expect(await screen.findByText(/API Error:/)).toBeInTheDocument()
		expect(requests).toHaveLength(0)
	})

	it('shows save and load errors, and retries the load', async () => {
		serve()
		server.use(http.patch(`${API}/api/v1/about/:id`, () => HttpResponse.json({ message: 'Bio too long' }, { status: 400 })))
		const { unmount } = render(<AboutView />)
		await userEvent.type(await screen.findByLabelText(/lead statement/i), '!')
		await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
		expect(await screen.findByText('Bio too long')).toBeInTheDocument()
		unmount()

		server.use(http.get(`${API}/api/v1/about`, () => HttpResponse.json({ message: 'About offline' }, { status: 503 })))
		render(<AboutView />)
		expect(await screen.findByText('About offline')).toBeInTheDocument()

		serve()
		await userEvent.click(within(screen.getByText('About offline').closest('div')?.parentElement as HTMLElement).getByRole('button', { name: /retry/i }))
		expect(await screen.findByDisplayValue('Engineer and mathematician')).toBeInTheDocument()
	})
})
