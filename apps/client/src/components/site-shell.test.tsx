import userEvent from '@testing-library/user-event'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SiteShell } from 'components/site-shell'

const push = vi.fn()
vi.mock('next/navigation', () => ({
	usePathname: () => '/projects',
	useRouter: () => ({ push, prefetch: vi.fn() }),
}))

const SOCIALS = [
	{
		id: 's1',
		platform: 'GITHUB',
		url: 'https://github.com/ada',
		label: 'GitHub',
		handle: '@ada',
		sortOrder: 0,
	},
	{
		id: 's2',
		platform: 'LINKEDIN',
		url: 'https://linkedin.com/in/ada',
		label: 'LinkedIn',
		handle: 'in/ada',
		sortOrder: 1,
	},
] as const

const renderShell = () =>
	render(
		<SiteShell socials={[...SOCIALS]}>
			<p>Page body</p>
		</SiteShell>,
	)

const palette = () => screen.getByRole('dialog', { name: 'Quick navigation' })
const search = () => within(palette()).getByPlaceholderText(/jump to a page/i)

beforeEach(() => {
	push.mockClear()
	document.documentElement.className = ''
	localStorage.clear()
})

afterEach(() => vi.restoreAllMocks())

describe('SiteShell', () => {
	it('renders the page inside main with a skip link', () => {
		renderShell()

		expect(within(screen.getByRole('main')).getByText('Page body')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
	})

	it('toggles the quick palette with Ctrl+K and locks page scrolling while open', async () => {
		renderShell()

		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
		expect(await screen.findByRole('dialog', { name: 'Quick navigation' })).toBeInTheDocument()
		expect(document.body.style.overflow).toBe('hidden')

		fireEvent.keyDown(window, { key: 'K', metaKey: true })
		expect(screen.queryByRole('dialog', { name: 'Quick navigation' })).not.toBeInTheDocument()
		expect(document.body.style.overflow).toBe('')
	})

	it('ignores K without a modifier', () => {
		renderShell()

		fireEvent.keyDown(window, { key: 'k' })

		expect(screen.queryByRole('dialog', { name: 'Quick navigation' })).not.toBeInTheDocument()
	})

	it('opens from the header button and navigates to a clicked page', async () => {
		renderShell()

		await userEvent.click(screen.getByRole('button', { name: /jump to/i }))
		await userEvent.click(within(palette()).getByRole('button', { name: /about/i }))

		expect(push).toHaveBeenCalledWith('/about')
		expect(screen.queryByRole('dialog', { name: 'Quick navigation' })).not.toBeInTheDocument()
	})

	it('filters pages and socials, and says when nothing matches', async () => {
		renderShell()
		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

		await userEvent.type(search(), 'link')

		expect(within(palette()).getByRole('button', { name: /linkedin/i })).toBeInTheDocument()
		expect(within(palette()).queryByRole('button', { name: /github/i })).not.toBeInTheDocument()
		expect(within(palette()).queryByText('Pages')).not.toBeInTheDocument()

		await userEvent.clear(search())
		await userEvent.type(search(), 'zzz')

		expect(within(palette()).getByText(/no matches found/i)).toBeInTheDocument()
	})

	it('moves the selection with the arrow keys and opens it with Enter', async () => {
		renderShell()
		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
		await userEvent.type(search(), 'pro')

		fireEvent.keyDown(search(), { key: 'ArrowDown' })
		fireEvent.keyDown(search(), { key: 'ArrowUp' })
		fireEvent.keyDown(search(), { key: 'Enter' })

		expect(push).toHaveBeenCalledWith('/projects')
	})

	it('opens a social profile in a new tab from the keyboard and by click', async () => {
		const open = vi.spyOn(window, 'open').mockImplementation(() => null)
		renderShell()
		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
		await userEvent.type(search(), 'github')

		fireEvent.keyDown(search(), { key: 'Enter' })

		expect(open).toHaveBeenCalledWith('https://github.com/ada', '_blank', 'noopener,noreferrer')

		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
		await userEvent.type(search(), 'linked')
		await userEvent.hover(within(palette()).getByRole('button', { name: /linkedin/i }))
		await userEvent.click(within(palette()).getByRole('button', { name: /linkedin/i }))

		expect(open).toHaveBeenCalledWith(
			'https://linkedin.com/in/ada',
			'_blank',
			'noopener,noreferrer',
		)
	})

	it('wraps the selection past the last item and closes on Enter there', async () => {
		renderShell()
		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
		await userEvent.type(search(), 'zzz')

		fireEvent.keyDown(search(), { key: 'ArrowUp' })
		fireEvent.keyDown(search(), { key: 'Enter' })

		expect(push).not.toHaveBeenCalled()
		expect(screen.queryByRole('dialog', { name: 'Quick navigation' })).not.toBeInTheDocument()
	})

	it('closes the palette with Escape or the backdrop', async () => {
		renderShell()
		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

		fireEvent.keyDown(search(), { key: 'Escape' })
		expect(screen.queryByRole('dialog', { name: 'Quick navigation' })).not.toBeInTheDocument()

		fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
		await userEvent.click(screen.getByRole('button', { name: 'Close quick navigation' }))
		expect(screen.queryByRole('dialog', { name: 'Quick navigation' })).not.toBeInTheDocument()
	})

	it('opens the mobile menu and closes it with Escape, the close button or a link', async () => {
		renderShell()
		const menu = () => screen.queryByRole('dialog', { name: 'Site navigation' })

		await userEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }))
		expect(await screen.findByRole('dialog', { name: 'Site navigation' })).toBeInTheDocument()
		expect(within(menu() as HTMLElement).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
			'href',
			'https://github.com/ada',
		)

		fireEvent.keyDown(window, { key: 'Escape' })
		await waitFor(() => expect(menu()).not.toBeInTheDocument())

		await userEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }))
		await userEvent.click(screen.getByRole('button', { name: 'Close navigation menu' }))
		await waitFor(() => expect(menu()).not.toBeInTheDocument())

		await userEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }))
		const nav = within(menu() as HTMLElement).getByRole('navigation', { name: 'Mobile' })
		await userEvent.click(within(nav).getAllByRole('link')[0] as HTMLElement)
		await waitFor(() => expect(menu()).not.toBeInTheDocument())
	})

	it('switches between light and dark themes and remembers the choice', async () => {
		renderShell()
		const toggle = screen.getByRole('button', { name: 'Toggle light and dark theme' })

		await userEvent.click(toggle)
		expect(document.documentElement).toHaveClass('dark')
		expect(document.documentElement.style.colorScheme).toBe('dark')
		expect(localStorage.getItem('theme')).toBe('dark')

		await userEvent.click(toggle)
		expect(document.documentElement).not.toHaveClass('dark')
		expect(localStorage.getItem('theme')).toBe('light')
	})

	it('still switches theme when storage is blocked', async () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked')
		})
		renderShell()

		await userEvent.click(screen.getByRole('button', { name: 'Toggle light and dark theme' }))

		expect(document.documentElement).toHaveClass('dark')
	})

	it('marks the current section in the header and condenses it after scrolling', () => {
		const { container } = renderShell()
		const header = container.querySelector('header') as HTMLElement
		const before = header.innerHTML

		Object.defineProperty(window, 'scrollY', { value: 400, configurable: true })
		act(() => {
			window.dispatchEvent(new Event('scroll'))
		})

		expect(header.innerHTML).not.toBe(before)
		expect(
			within(screen.getByRole('navigation', { name: 'Primary' })).getByRole('link', {
				name: 'Projects',
			}),
		).toHaveAttribute('aria-current', 'page')

		Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
	})
})
