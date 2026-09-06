'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/icons'
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from 'motion/react'
import type { Project } from '@/lib/api-types'
import { Chip, Reveal } from '@/components/primitives'
import { ProjectVisual } from '@/components/portfolio/project-visual'
import { splitTitle } from '@/lib/format'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------- featured */

/**
 * Flagship project composition: an editorial header that runs the full
 * measure, then an asymmetric media/detail split that alternates side.
 */
export function FeaturedProjectRow({
	project,
	index,
	flip = false,
	eager = false,
}: {
	project: Project
	index: number
	flip?: boolean
	eager?: boolean
}) {
	const { main, sub } = splitTitle(project.title)
	const number = String(index + 1).padStart(2, '0')
	const ref = useRef<HTMLDivElement>(null)
	const reduced = useReducedMotion()
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
	const y = useTransform(scrollYProgress, [0, 1], ['-3.5%', '3.5%'])

	return (
		<article ref={ref} className='group relative'>
			<Link
				href={`/projects/${project.slug}`}
				className='block focus-visible:outline-none'
				aria-label={`${project.title} — case study`}>
				{/* ------------------------------------------------------- header */}
				<Reveal>
					<div className='flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] tracking-[0.18em] text-muted-foreground uppercase'>
						<span className='text-signal-ink'>{number}</span>
						<span className='h-px w-10 bg-border-strong' aria-hidden />
						<span>{project.tags.join(' · ')}</span>
						<span className='numeric ml-auto hidden sm:inline'>
							{project.stack.length} technologies
						</span>
					</div>
				</Reveal>

				<Reveal delay={60}>
					<h3 className='text-display mt-5 text-[2.15rem] leading-[0.95] sm:text-[3rem] lg:text-[3.75rem]'>
						<span className='link-underline inline'>{main}</span>
					</h3>
				</Reveal>
				{sub ? (
					<Reveal delay={90}>
						<p className='mt-3 max-w-2xl font-display text-base text-muted-foreground sm:text-lg'>
							{sub}
						</p>
					</Reveal>
				) : null}

				{/* -------------------------------------------------------- body */}
				<div
					className={cn(
						'mt-9 grid items-end gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-12',
						flip && 'lg:[&>*:first-child]:order-2',
					)}>
					<Reveal from={flip ? 'right' : 'left'} className='lg:col-span-7 xl:col-span-8'>
						<div className='relative overflow-hidden rounded-2xl border border-border'>
							<motion.div {...(reduced ? {} : { style: { y } })} className='will-change-transform'>
								<ProjectVisual
									slug={project.slug}
									title={project.title}
									coverImageUrl={project.coverImageUrl}
									eager={eager}
									index={`Fig. ${number}`}
									className='aspect-16/10 w-full'
								/>
							</motion.div>

							{/* hairline crosshairs */}
							<span
								className='pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5 transition-[box-shadow] duration-700 group-hover:ring-signal/40'
								aria-hidden
							/>
							<span
								className='pointer-events-none absolute top-4 left-4 size-4 border-t border-l border-signal/0 transition-colors duration-500 group-hover:border-signal/70'
								aria-hidden
							/>
							<span
								className='pointer-events-none absolute right-4 bottom-4 size-4 border-r border-b border-signal/0 transition-colors duration-500 group-hover:border-signal/70'
								aria-hidden
							/>
							<span
								className='pointer-events-none absolute right-5 bottom-5 grid size-11 translate-y-2 place-items-center rounded-full bg-signal text-signal-foreground opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100'
								aria-hidden>
								<ArrowUpRight className='size-5' />
							</span>
						</div>
					</Reveal>

					<Reveal delay={90} from={flip ? 'left' : 'right'} className='lg:col-span-5 xl:col-span-4'>
						<p className='leading-relaxed text-muted-foreground'>{project.summary}</p>

						<div className='mt-6 flex flex-wrap gap-1.5'>
							{project.stack.slice(0, 5).map(tech => (
								<Chip key={tech} tone='outline'>
									{tech}
								</Chip>
							))}
						</div>

						<span className='mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground'>
							Read the case study
							<ArrowUpRight className='arrow-slide size-4 text-signal-ink' />
						</span>
					</Reveal>
				</div>
			</Link>
		</article>
	)
}

/* ----------------------------------------------------------- supporting */

export function ProjectListRow({
	project,
	index,
	onEnter,
	onLeave,
}: {
	project: Project
	index: number
	onEnter?: (project: Project) => void
	onLeave?: () => void
}) {
	const { main } = splitTitle(project.title)
	const number = String(index).padStart(2, '0')

	return (
		<Reveal delay={index * 45}>
			<Link
				href={`/projects/${project.slug}`}
				onMouseEnter={() => onEnter?.(project)}
				onMouseLeave={() => onLeave?.()}
				onFocus={() => onEnter?.(project)}
				onBlur={() => onLeave?.()}
				className='group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-6 transition-colors duration-500 sm:gap-6 sm:py-7'>
				<span
					className='absolute inset-x-0 -inset-y-px -z-10 scale-y-90 rounded-lg bg-surface opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-hover:opacity-100'
					aria-hidden
				/>
				<span className='pl-0 font-mono text-[0.6875rem] text-signal-ink sm:pl-4'>{number}</span>
				<span className='min-w-0'>
					<span className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
						<span className='font-display text-lg font-medium tracking-tight text-foreground transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 sm:text-xl'>
							{main}
						</span>
						<span className='font-mono text-[0.6875rem] text-muted-foreground'>
							{project.stack.slice(0, 3).join(' · ')}
						</span>
					</span>
					<span className='mt-1.5 block truncate text-sm text-muted-foreground'>
						{project.summary}
					</span>
				</span>
				<span className='grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-500 group-hover:border-signal group-hover:bg-signal group-hover:text-signal-foreground sm:mr-4'>
					<ArrowUpRight className='size-4' />
				</span>
			</Link>
		</Reveal>
	)
}

/**
 * Supporting project list with a cursor-following preview.
 */
export function SupportingProjects({
	projects,
	startIndex = 1,
	className,
}: {
	projects: Project[]
	startIndex?: number
	className?: string
}) {
	const reduced = useReducedMotion()
	const [hovered, setHovered] = useState<Project | null>(null)
	const x = useMotionValue(0)
	const yv = useMotionValue(0)
	const springX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.4 })
	const springY = useSpring(yv, { stiffness: 220, damping: 26, mass: 0.4 })

	const onMove = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			x.set(event.clientX + 24)
			yv.set(event.clientY - 90)
		},
		[x, yv],
	)

	const fine =
		typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches === true
	const enabled = fine && !reduced
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: tracking cursor coordinates for preview tooltip
		<div className={cn('relative', className)} onMouseMove={enabled ? onMove : undefined}>
			{projects.map((project, i) => (
				<ProjectListRow
					key={project.id}
					project={project}
					index={startIndex + i}
					{...(enabled ? { onEnter: setHovered, onLeave: () => setHovered(null) } : {})}
				/>
			))}

			<AnimatePresence>
				{enabled && hovered ? (
					<motion.div
						key={hovered.id}
						aria-hidden
						initial={{ opacity: 0, scale: 0.94 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
						style={{ x: springX, y: springY }}
						className='pointer-events-none fixed top-0 left-0 z-40 hidden w-56 overflow-hidden rounded-xl border border-border shadow-[var(--shadow-lift)] lg:block'>
						<ProjectVisual
							slug={hovered.slug}
							title={hovered.title}
							coverImageUrl={hovered.coverImageUrl}
							className='aspect-16/10 w-full'
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	)
}
