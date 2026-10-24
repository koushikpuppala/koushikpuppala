import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../test/msw'
import { failingApi, publishedApi } from '../test/fixtures'
import HomePage, { generateMetadata as homeMetadata } from './page'
import AboutPage from './about/page'
import ContactPage from './contact/page'
import EducationPage from './education/page'
import ExperiencePage from './experience/page'
import ProjectsPage from './projects/page'
import ProjectDetailPage, {
	generateMetadata as projectMetadata,
	generateStaticParams,
} from './projects/[slug]/page'
import ResumePage from './resume/page'
import ServicesPage from './services/page'
import NotFound from './not-found'
import ProjectNotFound from './projects/[slug]/not-found'
import robots from './robots'
import { NotFoundView } from 'components/not-found-view'

vi.mock('next/navigation', () => ({
	usePathname: () => '/',
	useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
	useSearchParams: () => new URLSearchParams(),
	notFound: () => {
		throw new Error('NEXT_NOT_FOUND')
	},
}))

vi.mock('next-recaptcha-v3', () => ({
	ReCaptchaProvider: ({ children }: { children: React.ReactNode }) => children,
	useReCaptcha: () => ({ executeRecaptcha: vi.fn(async () => 'token') }),
}))

const slug = (value: string) => ({ params: Promise.resolve({ slug: value }) })

// Display headings split words into animated spans, so compare text with the spaces taken out.
const mainText = () => (screen.getByRole('main').textContent ?? '').replace(/\s+/g, '')
const squash = (text: string) => text.replace(/\s+/g, '')

describe('public pages with published content', () => {
	beforeEach(() => {
		server.use(...publishedApi())
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
	})

	it('home shows the hero, featured work, stack, experience, education, about and contact', async () => {
		render(await HomePage())

		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Ada\s*Lovelace/)
		expect(screen.getByText('Builds analytical engines and the web apps that run on them.')).toBeInTheDocument()
		expect(screen.getAllByRole('link', { name: /Payments Platform/ }).length).toBeGreaterThan(0)
		expect(screen.getAllByText('Travel Booking').length).toBeGreaterThan(0)
		expect(screen.getAllByText(/Portfolio/).length).toBeGreaterThan(0)
		expect(screen.getAllByText('Analytical Co').length).toBeGreaterThan(0)
		expect(screen.getAllByText(/University of London/).length).toBeGreaterThan(0)
		expect(screen.getByRole('heading', { name: 'Engineer and mathematician' })).toBeInTheDocument()
		expect(screen.getAllByRole('link', { name: /ada@example\.com/ }).length).toBeGreaterThan(0)
	})

	it('home metadata comes from the API', async () => {
		expect(await homeMetadata()).toMatchObject({ title: expect.anything() })
	})

	it('about shows the biography, highlights and stats', async () => {
		render(await AboutPage())

		expect(mainText()).toContain(squash('Engineer and mathematician'))
		expect(screen.getByText('I turn ideas into working systems.')).toBeInTheDocument()
		expect(mainText()).toContain(squash('Analytical engine notes'))
		expect(screen.getByRole('link', { name: 'See the timeline' })).toHaveAttribute('href', '/experience')
	})

	it('experience lists every role, current first', async () => {
		render(await ExperiencePage())

		const main = screen.getByRole('main')
		const text = main.textContent ?? ''
		expect(text.indexOf('Software Engineer')).toBeLessThan(text.indexOf('Engineering Intern'))
		expect(within(main).getAllByText('Difference Labs').length).toBeGreaterThan(0)
		expect(within(main).getAllByText('Cut latency by 45%').length).toBeGreaterThan(0)
	})

	it('education lists degrees with their focus areas', async () => {
		render(await EducationPage())

		expect(mainText()).toContain(squash('B.Tech · Computer Science'))
		expect(mainText()).toContain(squash('2019 — 2023'))
		expect(mainText()).toContain(squash('Graduated with honours.'))
		expect(mainText()).toContain(squash('Student Lead · University Club'))
	})

	it('projects lists every published project', async () => {
		render(await ProjectsPage())

		for (const title of ['Payments Platform', 'Travel Booking'])
			expect(screen.getAllByText(new RegExp(title)).length).toBeGreaterThan(0)
	})

	it('services lists each skill area and its tools', async () => {
		render(await ServicesPage())

		expect(screen.getAllByText('Frontend').length).toBeGreaterThan(0)
		expect(screen.getAllByText('Redis').length).toBeGreaterThan(0)
	})

	it('resume shows the headline and a counted download link', async () => {
		render(await ResumePage())

		expect(mainText()).toContain(squash('Ada Lovelace Resume'))
		expect(mainText()).toContain(squash('Updated Oct 1, 2026'))
		expect(mainText()).toContain(squash('Jan 2024 — Present'))
		expect(screen.getByRole('link', { name: /download pdf/i })).toHaveAttribute(
			'href',
			expect.stringContaining('/resume/download'),
		)
	})

	it('contact shows the form and the direct email', async () => {
		render(await ContactPage())

		expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument()
		expect(screen.getAllByText(/ada@example\.com/).length).toBeGreaterThan(0)
	})

	it('a project page shows its case study, links and the next project', async () => {
		render(await ProjectDetailPage(slug('payments')))

		expect(squash(screen.getByRole('heading', { level: 1 }).textContent ?? '')).toBe('PaymentsPlatform')
		expect(mainText()).toContain(squash('Payments were slow.'))
		expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute(
			'href',
			'https://github.com/example/payments',
		)
		expect(screen.getByRole('link', { name: /visit live site/i })).toHaveAttribute(
			'href',
			'https://payments.example.com',
		)
		expect(screen.getByRole('link', { name: /next case study/i })).toHaveAttribute(
			'href',
			'/projects/travel',
		)
	})

	it('a project page builds metadata and static params from the API', async () => {
		expect(await projectMetadata(slug('payments'))).toMatchObject({ title: expect.anything() })
		expect(await generateStaticParams()).toEqual([
			{ slug: 'payments' },
			{ slug: 'travel' },
			{ slug: 'portfolio' },
		])
	})

	it('an unknown project slug is not found and not indexed', async () => {
		await expect(ProjectDetailPage(slug('missing'))).rejects.toThrow('NEXT_NOT_FOUND')
		expect(await projectMetadata(slug('missing'))).toEqual({
			title: 'Project not found',
			robots: { index: false },
		})
	})

	it('the not found pages offer a way back', async () => {
		const { unmount } = render(await NotFoundView(NotFound().props))
		expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /see projects/i })).toHaveAttribute('href', '/projects')
		unmount()

		render(await NotFoundView(ProjectNotFound().props))
		expect(screen.getByRole('heading', { name: 'Project not found' })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /all projects/i })).toHaveAttribute('href', '/projects')
	})

	it('robots blocks the counted download route', () => {
		expect(JSON.stringify(robots())).toContain('/resume/download')
	})
})

describe('public pages when the API is down', () => {
	beforeEach(() => {
		server.use(...failingApi())
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
	})

	it.each([
		['home', () => HomePage()],
		['about', () => AboutPage()],
		['experience', () => ExperiencePage()],
		['education', () => EducationPage()],
		['projects', () => ProjectsPage()],
		['services', () => ServicesPage()],
		['resume', () => ResumePage()],
		['contact', () => ContactPage()],
	])('%s still renders, with no sample content', async (_, page) => {
		render(await page())

		expect(screen.getByRole('main')).toBeInTheDocument()
		expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument()
	})

	it('static params fall back to a placeholder so the build still succeeds', async () => {
		expect(await generateStaticParams()).toEqual([{ slug: '__no-projects__' }])
	})
})
