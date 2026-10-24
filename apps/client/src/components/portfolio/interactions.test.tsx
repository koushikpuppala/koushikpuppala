import userEvent from '@testing-library/user-event'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Magnetic, Marquee, Reveal, Spotlight } from 'components/primitives/motion'
import { ProjectVisual } from 'components/projects/project-visual'
import { SectionRail } from 'components/portfolio/section-rail'
import { StackClusters } from 'components/portfolio/stack-clusters'
import { SupportingProjects } from 'components/portfolio/work-showcase'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

const setMediaQuery = (query: string, matches: boolean) =>
	(globalThis as unknown as { setMediaQuery: (q: string, m: boolean) => void }).setMediaQuery(
		query,
		matches,
	)
const intersectAll = () => (globalThis as unknown as { intersectAll: () => void }).intersectAll()

afterEach(() => setMediaQuery('(pointer: fine)', false))

const services = [
	{ id: 's1', title: 'Frontend', description: 'UI', features: ['React', 'Next.js'], sortOrder: 0 },
	{ id: 's2', title: 'Backend', description: 'APIs', features: ['NestJS'], sortOrder: 1 },
	{ id: 's3', title: 'Infra', description: 'Ops', features: ['Docker', 'AWS'], sortOrder: 2 },
]

const project = (id: string, extra = {}) => ({
	id,
	slug: `project-${id}`,
	title: `Project ${id} — Subtitle`,
	subtitle: '',
	category: 'Product',
	projectType: 'Personal',
	featured: false,
	status: 'COMPLETED' as const,
	shortDescription: `Summary ${id}`,
	descriptions: [],
	tags: [],
	technologies: ['React', 'Node.js', 'Redis', 'AWS'],
	sortOrder: 0,
	...extra,
})

describe('StackClusters', () => {
	it('renders nothing without services', () => {
		const { container } = render(<StackClusters services={[]} />)

		expect(container).toBeEmptyDOMElement()
	})

	it('switches panels by click and moves between tabs with the arrow, Home and End keys', async () => {
		render(<StackClusters services={services} />)
		const tab = (name: string) => screen.getByRole('tab', { name: new RegExp(name) })

		expect(tab('Frontend')).toHaveAttribute('aria-selected', 'true')

		await userEvent.click(tab('Backend'))
		expect(tab('Backend')).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tabpanel')).toHaveTextContent('NestJS')

		fireEvent.keyDown(tab('Backend'), { key: 'ArrowDown' })
		expect(tab('Infra')).toHaveFocus()

		fireEvent.keyDown(tab('Infra'), { key: 'ArrowRight' })
		expect(tab('Frontend')).toHaveFocus()

		fireEvent.keyDown(tab('Frontend'), { key: 'ArrowUp' })
		expect(tab('Infra')).toHaveFocus()

		fireEvent.keyDown(tab('Infra'), { key: 'Home' })
		expect(tab('Frontend')).toHaveFocus()

		fireEvent.keyDown(tab('Frontend'), { key: 'End' })
		expect(tab('Infra')).toHaveAttribute('aria-selected', 'true')

		fireEvent.keyDown(tab('Infra'), { key: 'Tab' })
		expect(tab('Infra')).toHaveAttribute('aria-selected', 'true')
	})
})

describe('SectionRail', () => {
	it('marks the section that scrolls into view', () => {
		render(
			<>
				<section id='work'>Work</section>
				<section id='stack'>Stack</section>
				<SectionRail
					sections={[
						{ id: 'work', label: 'Work' },
						{ id: 'stack', label: 'Stack' },
					]}
				/>
			</>,
		)
		const rail = screen.getByRole('navigation', { name: 'Page sections' })

		expect(within(rail).getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'true')

		act(() => intersectAll())

		expect(
			within(rail)
				.getAllByRole('link')
				.some(link => link.getAttribute('aria-current')),
		).toBe(true)
	})

	it('does nothing when none of its sections are on the page', () => {
		render(<SectionRail sections={[{ id: 'missing', label: 'Missing' }]} />)

		expect(screen.getByRole('link', { name: 'Missing' })).toHaveAttribute('aria-current', 'true')
	})
})

describe('SupportingProjects', () => {
	it('lists each project with its number, stack and summary', () => {
		render(<SupportingProjects projects={[project('1'), project('2')]} startIndex={3} />)

		expect(screen.getByRole('link', { name: /Project 1/ })).toHaveAttribute(
			'href',
			'/projects/project-1',
		)
		expect(screen.getByText('03')).toBeInTheDocument()
		expect(screen.getAllByText('React · Node.js · Redis')).toHaveLength(2)
	})

	it('follows the pointer with a preview of the hovered project on a fine pointer', async () => {
		setMediaQuery('(pointer: fine)', true)
		const { container } = render(
			<SupportingProjects projects={[project('1', { imageUrl: '/p1.webp' })]} />,
		)
		const link = screen.getByRole('link', { name: /Project 1/ })

		fireEvent.mouseEnter(link)
		fireEvent.mouseMove(container.firstChild as Element, { clientX: 100, clientY: 200 })

		await waitFor(() =>
			expect(container.querySelector('[aria-hidden="true"].fixed')).not.toBeNull(),
		)

		fireEvent.mouseLeave(link)
		fireEvent.focus(link)
		fireEvent.blur(link)
	})
})

describe('motion primitives', () => {
	it('reveals content once it scrolls into view', () => {
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
			top: 5000,
			bottom: 5200,
		} as DOMRect)
		render(<Reveal from='left'>Later content</Reveal>)
		const el = screen.getByText('Later content')

		expect(el).not.toHaveAttribute('data-revealed')

		act(() => intersectAll())

		expect(el).toHaveAttribute('data-revealed', 'true')
		vi.restoreAllMocks()
	})

	it('reveals content already on screen right away', () => {
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			bottom: 100,
		} as DOMRect)
		render(<Reveal as='section'>Visible content</Reveal>)

		expect(screen.getByText('Visible content')).toHaveAttribute('data-revealed', 'true')
		vi.restoreAllMocks()
	})

	it('moves magnetic and spotlight elements with a fine pointer, and resets on leave', async () => {
		setMediaQuery('(pointer: fine)', true)
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
			callback(0)
			return 1
		})
		render(
			<>
				<Magnetic>
					<span>Magnet</span>
				</Magnetic>
				<Spotlight>
					<span>Spot</span>
				</Spotlight>
			</>,
		)
		const spot = screen.getByText('Spot').parentElement as HTMLElement

		fireEvent.pointerMove(screen.getByText('Magnet').parentElement as HTMLElement, {
			clientX: 40,
			clientY: 40,
		})
		fireEvent.pointerLeave(screen.getByText('Magnet').parentElement as HTMLElement)
		fireEvent.pointerMove(spot, { clientX: 30, clientY: 20 })

		expect(spot.style.getPropertyValue('--spot-o')).toBe('1')

		fireEvent.pointerLeave(spot)

		expect(spot.style.getPropertyValue('--spot-o')).toBe('0')
		vi.restoreAllMocks()
	})

	it('ignores pointer moves without a fine pointer', () => {
		render(
			<Spotlight>
				<span>Spot</span>
			</Spotlight>,
		)
		const spot = screen.getByText('Spot').parentElement as HTMLElement

		fireEvent.pointerMove(spot, { clientX: 30, clientY: 20 })

		expect(spot.style.getPropertyValue('--spot-o')).toBe('0')
	})

	it('repeats marquee content once for the loop, hidden from screen readers', () => {
		const { container } = render(
			<Marquee reverse speed={10}>
				<span>Item</span>
			</Marquee>,
		)

		expect(screen.getAllByText('Item')).toHaveLength(2)
		expect(container.querySelector('.animate-marquee')).toHaveStyle({
			animationDirection: 'reverse',
		})
	})
})

describe('ProjectVisual', () => {
	it('uses the cover image when there is one', () => {
		render(<ProjectVisual slug='a' title='Alpha' coverImageUrl='/alpha.webp' index='Fig. 01' />)

		expect(screen.getByRole('img', { name: /alpha/i })).toHaveAttribute(
			'src',
			expect.stringContaining('alpha.webp'),
		)
	})

	it('draws seeded artwork from the slug when there is no image, the same every time', () => {
		const slugs = Array.from({ length: 16 }, (_, i) => `project-${i}`)
		const drawn = slugs.map(slug => {
			const { container, unmount } = render(<ProjectVisual slug={slug} title={slug} />)
			const svg = container.querySelector('svg')?.innerHTML
			unmount()
			return svg
		})

		expect(drawn.every(Boolean)).toBe(true)
		expect(new Set(drawn).size).toBeGreaterThan(1)

		const { container } = render(<ProjectVisual slug='project-0' title='project-0' />)
		expect(container.querySelector('svg')?.innerHTML.replace(/_r_[^"]+_/g, '')).toBe(
			drawn[0]?.replace(/_r_[^"]+_/g, ''),
		)
	})
})
