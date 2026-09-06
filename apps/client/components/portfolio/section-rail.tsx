'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Fixed vertical index of the page's sections with an active indicator.
 * Desktop only — it is decorative navigation duplicated by the header and
 * in-page links, so it is hidden from assistive tech on small screens.
 */
export function SectionRail({ sections }: { sections: Array<{ id: string; label: string }> }) {
	const [active, setActive] = useState(sections[0]?.id ?? '')

	useEffect(() => {
		const nodes = sections
			.map(section => document.getElementById(section.id))
			.filter((node): node is HTMLElement => Boolean(node))
		if (!nodes.length || typeof IntersectionObserver === 'undefined') return

		const observer = new IntersectionObserver(
			entries => {
				const visible = entries
					.filter(entry => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
				if (visible?.target.id) setActive(visible.target.id)
			},
			{ rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
		)

		nodes.forEach(node => {
			observer.observe(node)
		})
		return () => observer.disconnect()
	}, [sections])

	return (
		<nav
			aria-label='Page sections'
			className='pointer-events-none fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 2xl:block'>
			<ul className='pointer-events-auto flex flex-col items-end gap-3.5'>
				{sections.map(section => {
					const isActive = active === section.id
					return (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								aria-current={isActive ? 'true' : undefined}
								className='group flex items-center justify-end gap-3'>
								<span
									className={cn(
										'font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-all duration-500',
										isActive
											? 'text-foreground opacity-100'
											: 'text-muted-foreground opacity-0 group-hover:opacity-100',
									)}>
									{section.label}
								</span>
								<span
									className={cn(
										'block h-px transition-all duration-500 ease-[var(--ease-out-expo)]',
										isActive ? 'w-7 bg-signal' : 'w-3.5 bg-border-strong group-hover:w-5',
									)}
								/>
							</a>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
