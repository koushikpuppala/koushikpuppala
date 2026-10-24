import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API, server } from '../../../test/msw'
import { SettingsView } from 'components/settings/settings-view'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))
vi.mock('next/navigation', () => ({
	usePathname: () => '/settings',
	useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
	useSearchParams: () => new URLSearchParams(),
}))

const home = {
	id: 'meta-home',
	key: '/',
	type: 'PAGE',
	title: 'Ada Lovelace',
	description: 'Portfolio of Ada.',
	canonicalUrl: 'https://site.test',
	ogImage: '',
	robots: 'index,follow',
	keywords: ['Ada'],
	isPublished: true,
}
const about = {
	...home,
	id: 'meta-about',
	key: '/about',
	title: 'About Ada',
	keywords: [],
	isPublished: false,
}

let requests: Array<{ method: string; path: string; body: unknown }>

const serve = () =>
	server.use(
		http.get(`${API}/api/v1/metadata`, () =>
			HttpResponse.json({ result: { items: [home, about], pagination: { total: 2 } } }),
		),
		http.patch(`${API}/api/v1/metadata/:id`, async ({ request }) => {
			requests.push({
				method: 'PATCH',
				path: new URL(request.url).pathname,
				body: await request.json(),
			})
			return HttpResponse.json({ result: home })
		}),
		http.post(`${API}/api/v1/metadata`, async ({ request }) => {
			requests.push({ method: 'POST', path: '/api/v1/metadata', body: await request.json() })
			return HttpResponse.json(
				{ result: { ...home, id: 'meta-new', key: '/contact' } },
				{ status: 201 },
			)
		}),
	)

const save = () => userEvent.click(screen.getByRole('button', { name: /save/i }))

beforeEach(() => {
	requests = []
})

describe('SettingsView', () => {
	it('loads the home record, edits it and saves through PATCH', async () => {
		serve()
		render(<SettingsView />)

		const title = await screen.findByLabelText(/global title template/i)
		expect(title).toHaveValue('Ada Lovelace')

		await userEvent.clear(title)
		await userEvent.click(title)
		await userEvent.paste('Ada | Engineer')
		await userEvent.click(screen.getByLabelText('New keyword'))
		await userEvent.paste('Engines')
		await userEvent.keyboard('{Enter}')
		await userEvent.click(screen.getByLabelText('New keyword'))
		await userEvent.paste('Ada')
		await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
		// A duplicate is ignored and stays in the box for the editor to change.
		expect(screen.getByLabelText('New keyword')).toHaveValue('Ada')
		await userEvent.clear(screen.getByLabelText('New keyword'))
		await userEvent.click(screen.getByLabelText('New keyword'))
		await userEvent.paste('Math')
		await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
		await userEvent.click(screen.getByRole('button', { name: 'Remove keyword Math' }))
		await userEvent.click(screen.getByRole('switch', { name: 'Publish these SEO tags' }))
		await save()

		expect(await screen.findByText('Settings updated successfully')).toBeInTheDocument()
		expect(requests).toContainEqual({
			method: 'PATCH',
			path: '/api/v1/metadata/meta-home',
			body: expect.objectContaining({
				title: 'Ada | Engineer',
				keywords: ['Ada', 'Engines'],
				isPublished: false,
			}),
		})
	})

	it('switches to a saved path, and starts a blank record for a new one that saves through POST', async () => {
		serve()
		render(<SettingsView />)
		await screen.findByDisplayValue('Ada Lovelace')

		await userEvent.click(screen.getByRole('button', { name: '/about' }))
		expect(screen.getByLabelText(/global title template/i)).toHaveValue('About Ada')

		await userEvent.click(screen.getByRole('button', { name: '/contact' }))
		expect(screen.getByLabelText(/global title template/i)).toHaveValue('')
		expect(screen.getByLabelText(/canonical base url/i)).toHaveValue('https://site.test/contact')

		await userEvent.click(screen.getByLabelText(/global title template/i))
		await userEvent.paste('Contact Ada')
		await userEvent.click(screen.getByLabelText(/global meta description/i))
		await userEvent.paste('Say hello.')
		await save()

		await waitFor(() =>
			expect(requests).toContainEqual({
				method: 'POST',
				path: '/api/v1/metadata',
				body: expect.objectContaining({ key: '/contact', title: 'Contact Ada', type: 'PAGE' }),
			}),
		)
	})

	it('loads a record from the table into the form', async () => {
		serve()
		render(<SettingsView />)
		await screen.findByDisplayValue('Ada Lovelace')

		const rows = await screen.findAllByRole('button', { name: /load in form/i })
		await userEvent.click(rows[1] as HTMLElement)

		expect(screen.getByLabelText(/global title template/i)).toHaveValue('About Ada')
	})

	it('shows the error when saving fails', async () => {
		serve()
		server.use(
			http.patch(`${API}/api/v1/metadata/:id`, () =>
				HttpResponse.json({ message: 'Title too long' }, { status: 400 }),
			),
		)
		render(<SettingsView />)
		await screen.findByDisplayValue('Ada Lovelace')

		await save()

		expect(await screen.findByText(/Title too long/)).toBeInTheDocument()
	})

	it('shows a load error with a retry', async () => {
		server.use(
			http.get(`${API}/api/v1/metadata`, () =>
				HttpResponse.json({ message: 'Metadata store down' }, { status: 503 }),
			),
		)
		render(<SettingsView />)

		expect((await screen.findAllByText(/Metadata store down/)).length).toBeGreaterThan(0)

		serve()
		await userEvent.click(
			screen.getAllByRole('button', { name: /retry|refresh/i })[0] as HTMLElement,
		)

		expect(await screen.findByDisplayValue('Ada Lovelace')).toBeInTheDocument()
	})

	it('picks the OpenGraph image from the media library', async () => {
		serve()
		server.use(
			http.get(`${API}/api/v1/media`, () =>
				HttpResponse.json({
					result: {
						items: [
							{
								id: 'm1',
								fileName: 'og.png',
								originalName: 'og.png',
								url: 'https://assets.example.com/og.png',
								mimeType: 'image/png',
							},
						],
						pagination: { total: 1 },
					},
				}),
			),
		)
		render(<SettingsView />)
		await screen.findByDisplayValue('Ada Lovelace')

		// There is no URL box to type into: the API only accepts uploaded media from the CDN.
		expect(screen.queryByLabelText('OpenGraph image URL')).not.toBeInTheDocument()

		const pick = async (button: string) => {
			await userEvent.click(screen.getByRole('button', { name: button }))
			const picker = await screen.findByRole('dialog')
			await userEvent.click(await within(picker).findByRole('button', { name: /og\.png/i }))
			await userEvent.click(within(picker).getAllByRole('button').at(-1) as HTMLElement)
			await waitFor(() => expect(screen.getAllByAltText('OG Preview')).toHaveLength(2))
		}

		await pick('Choose from media library')
		await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
		expect(screen.queryAllByAltText('OG Preview')).toHaveLength(0)

		await pick('Choose from media library')
		await save()
		await waitFor(() =>
			expect(requests).toContainEqual({
				method: 'PATCH',
				path: '/api/v1/metadata/meta-home',
				body: expect.objectContaining({ ogImage: 'https://assets.example.com/og.png' }),
			}),
		)
	})
})
