'use client'

import { useEffect, useState } from 'react'
import { classNames } from 'utils/classNames'

export const SectionRail = ({ sections }: { sections: Array<{ id: string; label: string }> }) => {
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
									className={classNames(
										'font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-all duration-500',
										isActive
											? 'text-foreground opacity-100'
											: 'text-muted-foreground opacity-0 group-hover:opacity-100',
									)}>
									{section.label}
								</span>
								<span
									className={classNames(
										'block h-px transition-all duration-500 ease-(--ease-out-expo)',
										isActive ? 'bg-signal w-7' : 'bg-border-strong w-3.5 group-hover:w-5',
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
