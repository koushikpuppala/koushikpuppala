import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { API, server } from '../../../test/msw'
import { MediaPickerModal } from 'components/cms/media-picker-modal'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

const asset = (id: string, extra = {}) => ({
	id,
	fileName: `${id}.png`,
	originalName: `${id}.png`,
	url: `https://cdn.test/${id}.png`,
	mimeType: 'image/png',
	...extra,
})

const queries: string[] = []

const serve = (total = 3) =>
	server.use(
		http.get(`${API}/api/v1/media`, ({ request }) => {
			const query = new URL(request.url).searchParams
			queries.push(query.toString())
			if (query.get('search') === 'none')
				return HttpResponse.json({ result: { items: [], pagination: { total: 0 } } })
			const items =
				query.get('page') === '2'
					? [asset('third')]
					: [asset('first', { altText: 'First image' }), asset('second')]
			return HttpResponse.json({ result: { items, pagination: { total } } })
		}),
	)

const renderPicker = () => {
	const onSelect = vi.fn()
	const onOpenChange = vi.fn()
	const { container } = render(
		<MediaPickerModal open onOpenChange={onOpenChange} onSelect={onSelect} title='Pick a cover' />,
	)
	return { onSelect, onOpenChange, container }
}

describe('MediaPickerModal', () => {
	it('loads images only, pages with Load more and confirms the chosen one', async () => {
		serve()
		const { onSelect, onOpenChange } = renderPicker()
		const dialog = await screen.findByRole('dialog', { name: 'Pick a cover' })

		await userEvent.click(await within(dialog).findByRole('button', { name: /first image/i }))
		await userEvent.click(within(dialog).getByRole('button', { name: /load more/i }))
		expect(await within(dialog).findByRole('button', { name: /third\.png/ })).toBeInTheDocument()
		expect(queries[0]).toContain('type=IMAGE')

		await userEvent.click(within(dialog).getAllByRole('button').at(-1) as HTMLElement)

		expect(onSelect).toHaveBeenCalledWith({
			id: 'first',
			url: 'https://cdn.test/first.png',
			fileName: 'first.png',
			altText: 'First image',
		})
		expect(onOpenChange).toHaveBeenCalledWith(false)
	})

	it('keeps confirm disabled until something is chosen, and cancels', async () => {
		serve(2)
		const { onSelect, onOpenChange } = renderPicker()
		const dialog = await screen.findByRole('dialog')
		await within(dialog).findByRole('button', { name: /second\.png/ })

		const buttons = within(dialog).getAllByRole('button')
		expect(buttons.at(-1)).toBeDisabled()
		expect(within(dialog).queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()

		await userEvent.click(buttons.at(-2) as HTMLElement)
		expect(onOpenChange).toHaveBeenCalledWith(false)
		expect(onSelect).not.toHaveBeenCalled()
	})

	it('searches after a pause and says when nothing matches', async () => {
		serve()
		renderPicker()
		const dialog = await screen.findByRole('dialog')
		await within(dialog).findByRole('button', { name: /second\.png/ })

		await userEvent.type(within(dialog).getByPlaceholderText(/search media assets/i), 'none')

		expect(await within(dialog).findByText(/no media files found/i)).toBeInTheDocument()
	})

	it('uploads a new image, selects it and returns it', async () => {
		serve()
		server.use(
			http.post(`${API}/api/v1/media/presigned-url`, () =>
				HttpResponse.json({
					result: {
						uploadUrl: 'https://bucket.test/upload',
						storageKey: 'general/new.png',
						url: '',
					},
				}),
			),
			http.put('https://bucket.test/upload', () => new HttpResponse(null, { status: 200 })),
			http.post(`${API}/api/v1/media/complete`, () =>
				HttpResponse.json({
					result: {
						id: 'new',
						fileName: 'new.png',
						url: 'https://cdn.test/new.png',
						storageKey: 'general/new.png',
					},
				}),
			),
		)
		const { onSelect, container } = renderPicker()
		const dialog = await screen.findByRole('dialog')
		await within(dialog).findByRole('button', { name: /second\.png/ })

		await userEvent.upload(
			container.ownerDocument.querySelector('input[type="file"]') as HTMLInputElement,
			new File(['png'], 'new.png', { type: 'image/png' }),
		)
		await waitFor(() => expect(within(dialog).getAllByRole('button').at(-1)).toBeEnabled())
		await userEvent.click(within(dialog).getAllByRole('button').at(-1) as HTMLElement)

		expect(onSelect).toHaveBeenCalledWith({
			id: 'new',
			url: 'https://cdn.test/new.png',
			fileName: 'new.png',
			altText: undefined,
		})
	})

	it('shows the upload error', async () => {
		serve()
		server.use(
			http.post(`${API}/api/v1/media/presigned-url`, () =>
				HttpResponse.json({ message: 'Too large' }, { status: 400 }),
			),
		)
		const { container } = renderPicker()
		const dialog = await screen.findByRole('dialog')
		await within(dialog).findByRole('button', { name: /second\.png/ })

		await userEvent.upload(
			container.ownerDocument.querySelector('input[type="file"]') as HTMLInputElement,
			new File(['png'], 'x.png', { type: 'image/png' }),
		)

		expect(await within(dialog).findByText(/Too large/)).toBeInTheDocument()
	})
})
