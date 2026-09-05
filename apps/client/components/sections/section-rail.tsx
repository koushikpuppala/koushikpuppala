'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'ui/motion'
import { classNames } from '../../lib/utils'

export interface RailSection {
	id: string
	number: string
	shortLabel: string
	fullLabel: string
}

export const RAIL_SECTIONS: RailSection[] = [
	{ id: 'projects', number: '01', shortLabel: 'WORK', fullLabel: 'Selected Projects' },
	{ id: 'experience', number: '02', shortLabel: 'EXP', fullLabel: 'Professional Experience' },
	{ id: 'skills', number: '03', shortLabel: 'STACK', fullLabel: 'Technical Competencies' },
	{ id: 'about', number: '04', shortLabel: 'ABOUT', fullLabel: 'Biography & Engineering' },
	{ id: 'education', number: '05', shortLabel: 'EDU', fullLabel: 'Academic Background' },
	{ id: 'resume', number: '06', shortLabel: 'RESUME', fullLabel: 'Authoritative Resume' },
	{ id: 'contact', number: '07', shortLabel: 'CONTACT', fullLabel: 'Inquiries & Contact' },
]

export interface SectionRailProps {
	className?: string
}

/**
 * SectionRail
 * Sticky vertical indicator reproducing the Lovable desktop section rail.
 * Tracks active viewport section via IntersectionObserver with hover tooltips and quick navigation.
 */
export const SectionRail = ({ className }: SectionRailProps) => {
	const [activeId, setActiveId] = useState<string>('')
	const shouldReduceMotion = useReducedMotion()

	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: '-20% 0px -50% 0px',
			threshold: 0,
		}

		const observerCallback: IntersectionObserverCallback = entries => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					setActiveId(entry.target.id)
				}
			}
		}

		const observer = new IntersectionObserver(observerCallback, observerOptions)

		for (const section of RAIL_SECTIONS) {
			const element = document.getElementById(section.id)
			if (element) {
				observer.observe(element)
			}
		}

		return () => {
			observer.disconnect()
		}
	}, [])

	const handleScrollTo = (id: string) => {
		const target = document.getElementById(id)
		if (target) {
			target.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })
		}
	}

	return (
		<nav
			aria-label='Homepage Section Navigation'
			className={classNames(
				'fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-end gap-3',
				className,
			)}>
			<div className='flex flex-col gap-2 rounded-full border border-border/80 bg-surface/80 p-2 backdrop-blur-md shadow-lg'>
				{RAIL_SECTIONS.map(section => {
					const isActive = activeId === section.id

					return (
						<button
							key={section.id}
							type='button'
							onClick={() => handleScrollTo(section.id)}
							aria-label={`Scroll to ${section.fullLabel}`}
							aria-current={isActive ? 'true' : undefined}
							className={classNames(
								'group relative flex items-center justify-center h-8 px-2.5 rounded-full font-mono text-[10px] transition-all duration-200',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal',
								isActive
									? 'bg-signal text-white font-semibold shadow-[0_0_12px_rgba(255,51,102,0.6)]'
									: 'text-muted-foreground hover:text-foreground hover:bg-surface-strong',
							)}>
							{/* Short Monospace Code */}
							<span className='tracking-wider'>{section.number}</span>

							{/* Active Indicator Pulse */}
							{isActive && (
								<span
									className='ml-1.5 h-1.5 w-1.5 rounded-full bg-white animate-pulse shrink-0'
									aria-hidden='true'
								/>
							)}

							{/* Hover Tooltip Card (Flyout Left) */}
							<div
								role='tooltip'
								className='pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[10px] text-foreground shadow-md backdrop-blur-md opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200'>
								<span className='text-signal font-semibold'>{section.number}</span>
								<span className='text-border-strong mx-1'>{'//'}</span>
								<span>{section.fullLabel}</span>
							</div>
						</button>
					)
				})}
			</div>
		</nav>
	)
}
