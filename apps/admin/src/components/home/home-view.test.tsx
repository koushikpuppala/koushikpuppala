import { http, HttpResponse } from 'msw'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomeView } from 'components/home/home-view'
import { API, server } from '../../../test/msw'
import { describe, expect, it, vi } from 'vitest'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

const draft = { id: 'home-1', title: 'Koushik Puppala', subtitles: [], isPublished: false }

describe('HomeView', () => {
	it('loads the draft and publishes it', async () => {
		let published = false
		server.use(
			http.get(`${API}/api/v1/home`, ({ request }) => {
				const onlyLive = new URL(request.url).searchParams.has('isPublished')
				const items = onlyLive ? [] : [draft]
				return HttpResponse.json({ result: { items }, statusCode: 200 })
			}),
			http.patch(`${API}/api/v1/home/home-1/publish`, () => {
				published = true
				return HttpResponse.json({ result: { ...draft, isPublished: true }, statusCode: 200 })
			}),
		)

		render(<HomeView />)

		expect(await screen.findByDisplayValue('Koushik Puppala')).toBeInTheDocument()
		expect(screen.getByText('Draft')).toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: 'Publish' }))

		expect(await screen.findByText('Published')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Unpublish' })).toBeInTheDocument()
		expect(screen.getByText('Homepage published to the live site.')).toBeInTheDocument()
		expect(published).toBe(true)
	})

	it('keeps Publish disabled until edits are saved', async () => {
		server.use(
			http.get(`${API}/api/v1/home`, ({ request }) => {
				const onlyLive = new URL(request.url).searchParams.has('isPublished')
				return HttpResponse.json({ result: { items: onlyLive ? [] : [draft] }, statusCode: 200 })
			}),
		)

		render(<HomeView />)

		const title = await screen.findByDisplayValue('Koushik Puppala')
		await userEvent.type(title, '!')

		expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled()
	})
})
