import { delay, http, HttpResponse } from 'msw'
import { DTO_FIELDS } from 'types/api'
import { createCollectionActions } from 'actions/collection'
import { API, server } from '../../test/msw'
import { describe, expect, it, vi } from 'vitest'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

const actions = createCollectionActions<{ id: string }>('/api/v1/projects', DTO_FIELDS.project)

describe('createCollectionActions', () => {
	it('sends the table query as it is and adds no limit of its own', async () => {
		let search = ''
		server.use(
			http.get(`${API}/api/v1/projects`, ({ request }) => {
				search = new URL(request.url).search
				return HttpResponse.json({ result: { items: [] }, statusCode: 200 })
			}),
		)

		await actions.list(new URLSearchParams({ page: '2', search: 'portfolio' }))

		expect(search).toBe('?page=2&search=portfolio')
	})

	it('reports a request its caller aborted as aborted, not as an error', async () => {
		const controller = new AbortController()
		server.use(
			http.get(`${API}/api/v1/projects`, async () => {
				controller.abort()
				await delay(50)
				return HttpResponse.json({ result: { items: [] }, statusCode: 200 })
			}),
		)

		const res = await actions.list(new URLSearchParams(), controller.signal)

		expect(res).toEqual({ data: null, error: null, aborted: true })
	})

	it('saves only fields the API accepts, including the cover image and lifecycle status', async () => {
		let body: Record<string, unknown> = {}
		server.use(
			http.patch(`${API}/api/v1/projects/p1`, async ({ request }) => {
				body = (await request.json()) as Record<string, unknown>
				return HttpResponse.json({ result: { id: 'p1' }, statusCode: 200 })
			}),
		)

		await actions.save('p1', {
			thumbnailId: 'media-1',
			status: 'IN_PROGRESS',
			github: null,
			lifecycle: 'IN_PROGRESS',
			coverImageUrl: 'https://example.com/cover.webp',
		} as Partial<{ id: string }>)

		expect(body).toEqual({ thumbnailId: 'media-1', status: 'IN_PROGRESS', github: null })
	})
})
