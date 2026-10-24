import type { ComponentType } from 'react'

import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API, server } from '../../../test/msw'
import { ProjectsView } from 'components/projects/projects-view'
import { ExperienceView } from 'components/experience/experience-view'
import { EducationView } from 'components/education/education-view'
import { ServicesView } from 'components/services/services-view'
import { SocialsView } from 'components/socials/socials-view'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

const params = vi.hoisted(() => ({ current: new URLSearchParams() }))
vi.mock('next/navigation', () => ({
	usePathname: () => '/content',
	useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
	useSearchParams: () => params.current,
}))

type Case = {
	name: string
	View: ComponentType
	base: string
	record: Record<string, unknown>
	label: string
	createLabel: string
	saveLabel: string
	published: boolean
	publishRequest: (id: string) => { method: string; path: string }
}

const collectionPublish = (base: string) => (id: string) => ({ method: 'PATCH', path: `${base}/${id}/publish` })

const CASES: Case[] = [
	{
		name: 'projects',
		View: ProjectsView,
		base: '/api/v1/projects',
		label: 'Payments Platform',
		createLabel: 'New Project',
		saveLabel: 'Save Project',
		published: true,
		publishRequest: collectionPublish('/api/v1/projects'),
		record: {
			id: 'p1',
			title: 'Payments Platform',
			slug: 'payments',
			subtitle: 'Fintech',
			category: 'Product',
			projectType: 'Professional',
			shortDescription: 'Card issuing and settlement.',
			descriptions: ['Designed the ledger.'],
			caseStudy: 'Long form.',
			technologies: ['NestJS', 'React', 'Redis', 'AWS'],
			tags: ['fintech'],
			featured: true,
			status: 'IN_PROGRESS',
			isPublished: true,
			github: 'https://github.com/ada/payments',
			liveUrl: 'https://payments.example.com',
			thumbnail: { id: 'm1', url: 'https://assets.example.com/p1.webp' },
			sortOrder: 0,
		},
	},
	{
		name: 'experience',
		View: ExperienceView,
		base: '/api/v1/experience',
		label: 'Software Engineer',
		createLabel: 'Add Experience',
		saveLabel: 'Save Experience',
		published: false,
		publishRequest: collectionPublish('/api/v1/experience'),
		record: {
			id: 'e1',
			title: 'Software Engineer',
			organization: 'Analytical Co',
			location: 'Remote',
			employmentType: 'FULL_TIME',
			startDate: '2024-01-01T00:00:00.000Z',
			endDate: null,
			isCurrent: true,
			featured: true,
			description: ['Built the platform.'],
			achievements: ['Cut latency by 45%'],
			technologies: ['React'],
			website: 'https://analytical.example.com',
			isPublished: false,
			sortOrder: 0,
		},
	},
	{
		name: 'education',
		View: EducationView,
		base: '/api/v1/education',
		label: 'B.Tech',
		createLabel: 'Add Education',
		saveLabel: 'Save Education',
		published: true,
		publishRequest: collectionPublish('/api/v1/education'),
		record: {
			id: 'ed1',
			degree: 'B.Tech',
			fieldOfStudy: 'Computer Science',
			university: 'University of London',
			location: 'London',
			startDate: '2019-08-01T00:00:00.000Z',
			endDate: '2023-05-01T00:00:00.000Z',
			isCurrent: false,
			description: ['Graduated with honours.'],
			achievements: ['Dean list'],
			focusAreas: [],
			website: 'https://london.example.edu',
			isPublished: true,
			sortOrder: 0,
		},
	},
	{
		name: 'services',
		View: ServicesView,
		base: '/api/v1/services',
		label: 'Frontend',
		createLabel: 'Add Service',
		saveLabel: 'Save Service',
		published: false,
		publishRequest: collectionPublish('/api/v1/services'),
		record: {
			id: 's1',
			title: 'Frontend',
			description: 'Interfaces people enjoy.',
			features: ['React', 'Next.js'],
			isPublished: false,
			sortOrder: 0,
		},
	},
	{
		name: 'socials',
		View: SocialsView,
		base: '/api/v1/socials',
		label: 'GitHub',
		createLabel: 'Add Channel',
		saveLabel: 'Save Social Link',
		published: true,
		publishRequest: id => ({ method: 'PATCH', path: `/api/v1/socials/${id}` }),
		record: {
			id: 'so1',
			platform: 'GITHUB',
			label: 'GitHub',
			handle: '@ada',
			url: 'https://github.com/ada',
			isVisible: true,
			sortOrder: 0,
		},
	},
]

let requests: Array<{ method: string; path: string; body: unknown }>

const listen = (c: Case, list: () => Response = () => HttpResponse.json({ result: { items: [c.record], pagination: { total: 1 } } })) => {
	requests = []
	server.use(
		http.get(`${API}${c.base}`, list),
		http.all(`${API}${c.base}/*`, async ({ request }) => {
			const body = await request.json().catch(() => null)
			requests.push({ method: request.method, path: new URL(request.url).pathname, body })
			return request.method === 'DELETE'
				? new HttpResponse(null, { status: 204 })
				: HttpResponse.json({ result: c.record, statusCode: 200 })
		}),
		http.post(`${API}${c.base}`, async ({ request }) => {
			requests.push({ method: 'POST', path: c.base, body: await request.json() })
			return HttpResponse.json({ result: c.record, statusCode: 201 }, { status: 201 })
		}),
	)
}

beforeEach(() => {
	params.current = new URLSearchParams()
})

describe.each(CASES)('$name collection', c => {
	const row = async () => (await screen.findByText(c.label)).closest('tr') as HTMLElement

	it('lists the records from the API', async () => {
		listen(c)
		render(<c.View />)

		expect(await row()).toBeInTheDocument()
	})

	it('saves an edited record through PATCH and closes the dialog', async () => {
		listen(c)
		render(<c.View />)

		await userEvent.click(within(await row()).getByRole('button', { name: `Edit ${c.label}` }))
		const dialog = await screen.findByRole('dialog')
		await userEvent.click(within(dialog).getByRole('button', { name: c.saveLabel }))

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
		expect(requests).toContainEqual(
			expect.objectContaining({ method: 'PATCH', path: `${c.base}/${c.record.id}` }),
		)
	})

	it('opens a blank dialog for a new record', async () => {
		listen(c)
		render(<c.View />)
		await row()

		await userEvent.click(screen.getAllByRole('button', { name: new RegExp(c.createLabel) })[0] as HTMLElement)

		expect(await screen.findByRole('dialog')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: c.saveLabel })).toBeInTheDocument()
	})

	it('publishes or hides a record from its row', async () => {
		listen(c)
		render(<c.View />)
		const action = c.published ? 'Unpublish' : 'Publish'

		await userEvent.click(within(await row()).getByRole('button', { name: `${action} ${c.label}` }))

		const expected = c.publishRequest(String(c.record.id))
		await waitFor(() => expect(requests).toContainEqual(expect.objectContaining(expected)))
	})

	it('shows the error when publishing fails', async () => {
		listen(c)
		server.use(
			http.patch(`${API}${c.base}/*`, () =>
				HttpResponse.json({ message: 'Publish refused' }, { status: 409 }),
			),
		)
		render(<c.View />)
		const action = c.published ? 'Unpublish' : 'Publish'

		await userEvent.click(within(await row()).getByRole('button', { name: `${action} ${c.label}` }))

		expect(await screen.findByText(/Publish refused/)).toBeInTheDocument()
	})

	it('deletes a record after confirmation', async () => {
		listen(c)
		render(<c.View />)

		await userEvent.click(within(await row()).getByRole('button', { name: `Delete ${c.label}` }))
		const confirm = await screen.findByRole('alertdialog')
		await userEvent.click(within(confirm).getByRole('button', { name: 'Delete Record' }))

		await waitFor(() =>
			expect(requests).toContainEqual(
				expect.objectContaining({ method: 'DELETE', path: `${c.base}/${c.record.id}` }),
			),
		)
	})

	it('shows a list error and loads again on retry', async () => {
		let fail = true
		listen(c, () =>
			fail
				? HttpResponse.json({ message: 'Database unavailable' }, { status: 503 })
				: HttpResponse.json({ result: { items: [c.record], pagination: { total: 1 } } }),
		)
		render(<c.View />)

		expect(await screen.findByText(/Database unavailable/)).toBeInTheDocument()

		fail = false
		await userEvent.click(screen.getByRole('button', { name: /retry/i }))

		expect(await row()).toBeInTheDocument()
	})

	it('sends the status filter from the URL to the API', async () => {
		let query = ''
		listen(c, () => HttpResponse.json({ result: { items: [], pagination: { total: 0 } } }))
		server.use(
			http.get(`${API}${c.base}`, ({ request }) => {
				query = new URL(request.url).search
				return HttpResponse.json({ result: { items: [], pagination: { total: 0 } } })
			}),
		)
		params.current = new URLSearchParams('status=PUBLISHED&search=abc&sort=status&order=desc')

		render(<c.View />)

		await waitFor(() => expect(query).toContain('search=abc'))
		expect(query).toMatch(/isPublished=true|isVisible=true/)
	})
})
