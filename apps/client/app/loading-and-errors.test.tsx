import type { ComponentType } from 'react'

import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../test/msw'
import { failingApi, projects, publishedApi } from '../test/fixtures'
import HomeLoading from './loading'
import AboutLoading from './about/loading'
import ContactLoading from './contact/loading'
import EducationLoading from './education/loading'
import ExperienceLoading from './experience/loading'
import ProjectsLoading from './projects/loading'
import ProjectLoading from './projects/[slug]/loading'
import ResumeLoading from './resume/loading'
import ServicesLoading from './services/loading'
import RootError from './error'
import sitemap from './sitemap'

const captureException = vi.hoisted(() => vi.fn())
vi.mock('@sentry/nextjs', () => ({ captureException }))
vi.mock('next/navigation', () => ({
	usePathname: () => '/',
	useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}))

describe('loading screens', () => {
	it.each([
		['home page', HomeLoading],
		['about page', AboutLoading],
		['contact page', ContactLoading],
		['education', EducationLoading],
		['experience', ExperienceLoading],
		['projects', ProjectsLoading],
		['case study', ProjectLoading],
		['resume', ResumeLoading],
		['skills', ServicesLoading],
	] as Array<[string, ComponentType]>)('announces one loading message for the %s', (label, Loading) => {
		render(<Loading />)

		const status = screen.getByRole('status')
		expect(status).toHaveAttribute('aria-busy', 'true')
		expect(status).toHaveTextContent(`Loading ${label}`)
	})
})

describe('error page', () => {
	it('reports the error, shows its digest and retries on request', async () => {
		const reset = vi.fn()
		const error = Object.assign(new Error('boom'), { digest: 'abc123' })

		render(<RootError error={error} reset={reset} />)

		expect(captureException).toHaveBeenCalledWith(error)
		expect(screen.getByText(/fault signature: abc123/i)).toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: /retry execution/i }))

		expect(reset).toHaveBeenCalledTimes(1)
		expect(screen.getByRole('link', { name: /return to home/i })).toHaveAttribute('href', '/')
	})

	it('leaves out the digest line when there is none', () => {
		render(<RootError error={new Error('boom')} reset={vi.fn()} />)

		expect(screen.queryByText(/fault signature/i)).not.toBeInTheDocument()
	})
})

describe('sitemap', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
	})

	it('lists every static page plus published projects, leaving archived ones out', async () => {
		server.use(
			...publishedApi({
				projects: [...projects, { ...projects[2], id: 'p4', slug: 'old', status: 'ARCHIVED' }],
			}),
		)

		const entries = await sitemap()
		const urls = entries.map(entry => entry.url)

		expect(urls).toContain('https://site.test')
		expect(urls).toContain('https://site.test/projects')
		expect(urls).toContain('https://site.test/contact')
		expect(urls).toContain('https://site.test/projects/payments')
		expect(urls).not.toContain('https://site.test/projects/old')
		expect(entries.find(e => e.url === 'https://site.test')).toMatchObject({ priority: 1 })
		expect(entries.find(e => e.url === 'https://site.test/projects/payments')).toMatchObject({
			priority: 0.85,
		})
		expect(entries.find(e => e.url === 'https://site.test/projects/portfolio')).toMatchObject({
			priority: 0.7,
		})
	})

	it('still lists the static pages when the API is down', async () => {
		server.use(...failingApi())

		const urls = (await sitemap()).map(entry => entry.url)

		expect(urls).toContain('https://site.test/about')
		expect(urls.some(url => url.includes('/projects/'))).toBe(false)
	})
})
