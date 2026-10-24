import type { ComponentType } from 'react'

import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Each view has its own tests; here they are stand ins so a route test checks only its wiring.
const { stub } = vi.hoisted(() => ({
	stub: (name: string) => () => <p>{name} view</p>,
}))
vi.mock('components/api-metrics/api-metrics-view', () => ({ ApiMetricsView: stub('ApiMetrics') }))
vi.mock('components/audit-logs/audit-logs-view', () => ({ AuditLogsView: stub('AuditLogs') }))
vi.mock('components/about/about-view', () => ({ AboutView: stub('About') }))
vi.mock('components/education/education-view', () => ({ EducationView: stub('Education') }))
vi.mock('components/experience/experience-view', () => ({ ExperienceView: stub('Experience') }))
vi.mock('components/home/home-view', () => ({ HomeView: stub('Home') }))
vi.mock('components/projects/projects-view', () => ({ ProjectsView: stub('Projects') }))
vi.mock('components/resume/resume-view', () => ({ ResumeView: stub('Resume') }))
vi.mock('components/services/services-view', () => ({ ServicesView: stub('Services') }))
vi.mock('components/socials/socials-view', () => ({ SocialsView: stub('Socials') }))
vi.mock('components/auth/login-view', () => ({ LoginView: stub('Login') }))
vi.mock('components/media/media-view', () => ({ MediaView: stub('Media') }))
vi.mock('components/messages/messages-view', () => ({ MessagesView: stub('Messages') }))
vi.mock('components/dashboard/dashboard-view', () => ({ DashboardView: stub('Dashboard') }))
vi.mock('components/settings/settings-view', () => ({ SettingsView: stub('Settings') }))
vi.mock('components/users/users-view', () => ({ UsersView: stub('Users') }))
vi.mock('components/shell/admin-shell', () => ({
	AdminShell: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('lib/auth', () => ({
	AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-nonce': 'test-nonce' }) }))
vi.mock('next/font/google', () => ({
	Plus_Jakarta_Sans: () => ({ variable: 'font-jakarta', className: 'jakarta' }),
}))

const pages = import.meta.glob<{ default: ComponentType; metadata?: { title?: unknown } }>(
	'./**/page.tsx',
	{ eager: true },
)
const loadings = import.meta.glob<{ default: ComponentType }>('./**/loading.tsx', { eager: true })

const VIEW_FOR: Record<string, string> = {
	'./page.tsx': 'Dashboard',
	'./api-metrics/page.tsx': 'ApiMetrics',
	'./audit-logs/page.tsx': 'AuditLogs',
	'./content/about/page.tsx': 'About',
	'./content/education/page.tsx': 'Education',
	'./content/experience/page.tsx': 'Experience',
	'./content/home/page.tsx': 'Home',
	'./content/projects/page.tsx': 'Projects',
	'./content/resume/page.tsx': 'Resume',
	'./content/services/page.tsx': 'Services',
	'./content/social/page.tsx': 'Socials',
	'./login/page.tsx': 'Login',
	'./media/page.tsx': 'Media',
	'./messages/page.tsx': 'Messages',
	'./settings/page.tsx': 'Settings',
	'./users/page.tsx': 'Users',
}

describe('admin routes', () => {
	it('has a page for every view', () => {
		expect(Object.keys(pages).sort()).toEqual(Object.keys(VIEW_FOR).sort())
	})

	it.each(Object.entries(VIEW_FOR))('%s renders its view and has a title', (path, view) => {
		const { default: Page, metadata } = pages[path] as (typeof pages)[string]

		render(<Page />)

		expect(screen.getByText(`${view} view`)).toBeInTheDocument()
		expect(metadata?.title).toBeTruthy()
	})

	it.each(Object.keys(loadings))('%s announces a loading state', path => {
		const { default: Loading } = loadings[path] as (typeof loadings)[string]

		render(<Loading />)

		expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
	})

	it('the not found page links back to the dashboard', async () => {
		const { default: NotFound } = await import('./not-found')

		render(<NotFound />)

		expect(screen.getByRole('link', { name: 'Return to Dashboard' })).toHaveAttribute('href', '/')
	})

	it('the error page logs the error, shows its digest and retries', async () => {
		const { default: ErrorPage } = await import('./error')
		const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const reset = vi.fn()
		const error = Object.assign(new Error('boom'), { digest: 'd1' })

		render(<ErrorPage error={error} reset={reset} />)
		await userEvent.click(screen.getByRole('button', { name: 'Retry View' }))

		expect(log).toHaveBeenCalledWith('[CMS Studio Runtime Error]', error)
		expect(screen.getByText('Digest: d1')).toBeInTheDocument()
		expect(reset).toHaveBeenCalled()
	})

	it('the root layout wraps the page in the providers inside body', async () => {
		const { default: RootLayout } = await import('./layout')

		const html = await RootLayout({ children: <p>child</p> })

		expect(html.type).toBe('html')
		const [head, body] = html.props.children
		expect(body.type).toBe('body')
		expect(body.props.className).toContain('min-h-screen')
		// The inline theme script only runs under the content security policy with this request's nonce.
		expect(head.props.children.props.nonce).toBe('test-nonce')
	})
})
