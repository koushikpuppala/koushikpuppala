import { http, HttpResponse } from 'msw'
import { createSingletonActions } from 'actions/singleton'
import { API, server } from '../../test/msw'
import { describe, expect, it, vi } from 'vitest'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

type Row = { id: string; isPublished: boolean }

const envelope = (items: Row[]) =>
	HttpResponse.json({ result: { items }, count: items.length, statusCode: 200 })

const actions = createSingletonActions<Row>('/api/v1/home')

describe('createSingletonActions', () => {
	it('loads the published record when there is one', async () => {
		server.use(
			http.get(`${API}/api/v1/home`, ({ request }) => {
				const url = new URL(request.url)
				expect(url.searchParams.get('isPublished')).toBe('true')
				return envelope([{ id: 'live', isPublished: true }])
			}),
		)

		const res = await actions.get()

		expect(res.data).toEqual({ id: 'live', isPublished: true })
	})

	it('falls back to the newest draft so unpublished content stays editable', async () => {
		server.use(
			http.get(`${API}/api/v1/home`, ({ request }) =>
				new URL(request.url).searchParams.has('isPublished')
					? envelope([])
					: envelope([{ id: 'draft', isPublished: false }]),
			),
		)

		const res = await actions.get()

		expect(res.data).toEqual({ id: 'draft', isPublished: false })
	})

	it('returns no record when nothing exists yet', async () => {
		server.use(http.get(`${API}/api/v1/home`, () => envelope([])))

		const res = await actions.get()

		expect(res).toMatchObject({ data: null, error: null })
	})

	it('toggles publish through the record publish endpoint', async () => {
		server.use(
			http.patch(`${API}/api/v1/home/draft/publish`, () =>
				HttpResponse.json({ result: { id: 'draft', isPublished: true }, statusCode: 200 }),
			),
		)

		const res = await actions.togglePublish('draft')

		expect(res.data).toEqual({ id: 'draft', isPublished: true })
	})
})
