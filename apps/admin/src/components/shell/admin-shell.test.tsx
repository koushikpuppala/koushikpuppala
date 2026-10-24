import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from 'lib/theme'
import { AdminShell } from 'components/shell/admin-shell'

const nav = vi.hoisted(() => ({ pathname: '/', replace: vi.fn(), push: vi.fn() }))
vi.mock('next/navigation', () => ({
	usePathname: () => nav.pathname,
	useRouter: () => ({ replace: nav.replace, push: nav.push }),
	useSearchParams: () => new URLSearchParams(),
}))

const auth = vi.hoisted(() => ({
	user: { email: 'ada@example.test', displayName: 'Ada', role: 'ADMIN' } as Record<
		string,
		string
	> | null,
	loading: false,
	stage: 'ready',
	logout: vi.fn(async () => undefined),
}))
vi.mock('lib/auth', () => ({ useAuth: () => auth }))

const setMediaQuery = (query: string, matches: boolean) =>
	(globalThis as unknown as { setMediaQuery: (q: string, m: boolean) => void }).setMediaQuery(
		query,
		matches,
	)

const renderShell = () =>
	render(
		<ThemeProvider>
			<AdminShell>
				<p>Studio page</p>
			</AdminShell>
		</ThemeProvider>,
	)

const palette = () => screen.getByRole('dialog', { name: 'Command palette' })
const paletteInput = () => within(palette()).getByPlaceholderText(/type a command/i)

beforeEach(() => {
	nav.pathname = '/'
	nav.replace.mockClear()
	nav.push.mockClear()
	auth.user = { email: 'ada@example.test', displayName: 'Ada', role: 'ADMIN' }
	auth.loading = false
	auth.stage = 'ready'
	auth.logout.mockClear()
	localStorage.clear()
	document.documentElement.className = ''
})

afterEach(() => {
	setMediaQuery('(prefers-color-scheme: dark)', false)
	vi.restoreAllMocks()
})

describe('AdminShell', () => {
	it('renders the login page alone, without the studio chrome', () => {
		nav.pathname = '/login'
		auth.user = null
		renderShell()

		expect(screen.getByText('Studio page')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument()
	})

	it('shows the boot screen while the session is checked', () => {
		auth.loading = true
		auth.stage = 'session'
		renderShell()

		expect(screen.getByText('Checking your session')).toBeInTheDocument()
		expect(screen.queryByText('Studio page')).not.toBeInTheDocument()
	})

	it('sends a signed out visitor to the login page', async () => {
		auth.user = null
		auth.stage = 'signed-out'
		renderShell()

		await waitFor(() => expect(nav.replace).toHaveBeenCalledWith('/login'))
	})

	it('sends a signed in user away from the login page', async () => {
		nav.pathname = '/login'
		renderShell()

		await waitFor(() => expect(nav.replace).toHaveBeenCalledWith('/'))
	})

	it('renders the page in a focusable main region with the navigation around it', () => {
		nav.pathname = '/content/projects'
		renderShell()

		expect(within(screen.getByRole('main')).getByText('Studio page')).toBeInTheDocument()
		expect(screen.getAllByRole('link', { name: /projects/i }).length).toBeGreaterThan(0)
	})

	it('opens the mobile navigation, signs out from it and closes it', async () => {
		renderShell()

		await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
		await userEvent.click(screen.getByRole('button', { name: 'Close navigation' }))
		expect(screen.queryByRole('button', { name: 'Close navigation' })).not.toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
		await userEvent.click(screen.getByRole('button', { name: /sign out/i }))
		expect(auth.logout).toHaveBeenCalled()
	})

	it('opens the user menu, closes it on an outside click and signs out from it', async () => {
		renderShell()
		const menuButton = screen.getByRole('button', { name: /ada/i, expanded: false })

		await userEvent.click(menuButton)
		expect(menuButton).toHaveAttribute('aria-expanded', 'true')

		fireEvent.mouseDown(document.body)
		await waitFor(() => expect(menuButton).toHaveAttribute('aria-expanded', 'false'))

		await userEvent.click(menuButton)
		await userEvent.click(screen.getByRole('link', { name: /settings/i }))
		expect(menuButton).toHaveAttribute('aria-expanded', 'false')

		await userEvent.click(menuButton)
		await userEvent.click(screen.getByRole('button', { name: /sign out/i }))
		expect(auth.logout).toHaveBeenCalled()
	})

	it('switches theme from the top bar and remembers it', async () => {
		setMediaQuery('(prefers-color-scheme: dark)', true)
		renderShell()

		await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
		await userEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }))

		expect(document.documentElement).not.toHaveClass('dark')
		expect(localStorage.getItem('kp.admin.theme')).toBe('light')
	})

	it('starts with the saved theme', async () => {
		localStorage.setItem('kp.admin.theme', 'light')
		renderShell()

		expect(await screen.findByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
		expect(document.documentElement).not.toHaveClass('dark')
	})

	describe('command palette', () => {
		it('opens with Ctrl+K or the search button and closes with Escape or its button', async () => {
			renderShell()

			fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
			expect(palette()).toBeInTheDocument()

			fireEvent.keyDown(paletteInput(), { key: 'Escape' })
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument(),
			)

			await userEvent.click(screen.getByRole('button', { name: /search commands/i }))
			await userEvent.click(
				within(palette()).getByRole('button', { name: 'Close command palette' }),
			)
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument(),
			)
		})

		it('ignores K without a modifier', () => {
			renderShell()

			fireEvent.keyDown(window, { key: 'k' })

			expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument()
		})

		it('filters commands and navigates with the keyboard', async () => {
			renderShell()
			fireEvent.keyDown(window, { key: 'k', metaKey: true })

			await userEvent.type(paletteInput(), 'content')
			fireEvent.keyDown(paletteInput(), { key: 'ArrowDown' })
			fireEvent.keyDown(paletteInput(), { key: 'ArrowUp' })
			fireEvent.keyDown(paletteInput(), { key: 'ArrowUp' })
			fireEvent.keyDown(paletteInput(), { key: 'ArrowDown' })
			fireEvent.keyDown(paletteInput(), { key: 'Enter' })

			expect(nav.push).toHaveBeenCalledWith('/content/home')
		})

		it('says when nothing matches and does nothing on Enter', async () => {
			renderShell()
			fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

			await userEvent.type(paletteInput(), 'zzz')
			fireEvent.keyDown(paletteInput(), { key: 'ArrowDown' })
			fireEvent.keyDown(paletteInput(), { key: 'Enter' })

			expect(within(palette()).getByText(/no commands found/i)).toBeInTheDocument()
			expect(nav.push).not.toHaveBeenCalled()
		})

		it.each([
			['Dashboard', '/'],
			['About Page Content', '/content/about'],
			['Projects & Work', '/content/projects'],
			['Experience Timeline', '/content/experience'],
			['Education & Honors', '/content/education'],
			['Skills (Services)', '/content/services'],
			['Resume Document', '/content/resume'],
			['Social Channels', '/content/social'],
			['Media Library', '/media'],
			['Inquiries & Messages', '/messages'],
			['Audit Logs', '/audit-logs'],
			['API Telemetry', '/api-metrics'],
			['Users & Permissions', '/users'],
			['Site Metadata & SEO', '/settings'],
		])('goes to %s', async (label, href) => {
			renderShell()
			fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

			await userEvent.click(
				within(palette()).getByRole('button', { name: new RegExp(label.replace(/[()&]/g, '.')) }),
			)

			expect(nav.push).toHaveBeenCalledWith(href)
		})

		it('switches theme, opens the live site and signs out', async () => {
			const open = vi.spyOn(window, 'open').mockImplementation(() => null)
			renderShell()

			fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
			await userEvent.click(
				within(palette()).getByRole('button', { name: /switch to (light|dark) mode/i }),
			)
			expect(localStorage.getItem('kp.admin.theme')).not.toBeNull()

			fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
			await userEvent.click(
				within(palette()).getByRole('button', { name: /open live portfolio site/i }),
			)
			expect(open).toHaveBeenCalledWith(expect.any(String), '_blank', 'noopener,noreferrer')

			fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
			await userEvent.click(within(palette()).getByRole('button', { name: /sign out of cms/i }))
			expect(auth.logout).toHaveBeenCalled()
		})
	})
})
