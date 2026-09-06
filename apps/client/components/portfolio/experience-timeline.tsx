'use client'

import { useRef, useState } from 'react'
import { ChevronDown } from '@/components/icons'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import type { Experience } from '@/lib/api-types'
import { Chip, PulseDot } from '@/components/primitives'
import { durationLabel, formatMonthYear } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Pull a resume-stated metric out of a highlight so it can be shown as a stat. */
function extractMetric(highlights: string[]) {
	for (const line of highlights) {
		const match = line.match(/(~?\d{1,3}%)/)
		if (match) return match[1] as string
	}
	return null
}

function yearOf(value: string | null | undefined) {
	if (!value) return null
	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed.getFullYear()
}

const viewport = { once: true, margin: '0px 0px -18% 0px' } as const
const ease = [0.16, 1, 0.3, 1] as const

function TimelineEntry({
	item,
	index,
	defaultOpen,
}: {
	item: Experience
	index: number
	defaultOpen: boolean
}) {
	const [open, setOpen] = useState(defaultOpen)
	const current = !item.endDate
	const panelId = `exp-panel-${item.id}`
	const metric = extractMetric(item.highlights)
	const startYear = yearOf(item.startDate)

	return (
		<motion.article
			initial={{ opacity: 0, y: 26 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={viewport}
			transition={{ duration: 0.7, ease, delay: Math.min(index, 3) * 0.05 }}
			className='relative pl-10 sm:pl-16'>
			{/* axis node */}
			<motion.span
				initial={{ scale: 0.2, opacity: 0 }}
				whileInView={{ scale: 1, opacity: 1 }}
				viewport={viewport}
				transition={{ duration: 0.5, ease, delay: 0.1 }}
				className={cn(
					'absolute top-9 left-[0.28rem] grid size-4 place-items-center rounded-full sm:left-[1.03rem]',
					current ? 'bg-signal-soft' : 'bg-background',
				)}
				aria-hidden>
				<span
					className={cn(
						'size-2 rounded-full transition-colors duration-500',
						current ? 'bg-signal' : 'bg-border-strong',
					)}
				/>
			</motion.span>

			<div
				className={cn(
					'group relative grid gap-x-10 gap-y-5 py-9 lg:grid-cols-[10.5rem_minmax(0,1fr)]',
					index > 0 && 'border-t border-border',
					current && 'lg:pr-6',
				)}>
				{current ? (
					<span
						className='pointer-events-none absolute inset-y-0 -left-10 -z-10 w-[calc(100%+2.5rem)] rounded-r-2xl bg-surface/70 sm:-left-16 sm:w-[calc(100%+4rem)]'
						aria-hidden
					/>
				) : null}

				{/* date rail */}
				<div className='min-w-0'>
					{startYear ? (
						<p
							className={cn(
								'numeric font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl',
								current ? 'text-signal-ink' : 'text-foreground/35',
							)}>
							{startYear}
						</p>
					) : null}
					<p className='numeric mt-2 font-mono text-[0.75rem] tracking-tight text-foreground'>
						{formatMonthYear(item.startDate, '—')}
						<span className='text-muted-foreground'> → </span>
						{item.endDate ? (
							formatMonthYear(item.endDate)
						) : (
							<span className='text-signal-ink'>Present</span>
						)}
					</p>
					<p className='mt-1.5 font-mono text-[0.6875rem] text-muted-foreground'>
						{durationLabel(item.startDate, item.endDate)}
						{item.location ? ` · ${item.location}` : ''}
					</p>
					{current ? (
						<span className='mt-3 inline-flex items-center gap-2 rounded-full bg-signal-soft px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-signal-ink uppercase'>
							<PulseDot />
							Current
						</span>
					) : null}
				</div>

				{/* body */}
				<div className='min-w-0'>
					<div className='grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4'>
						<div className='min-w-0'>
							<h3
								className={cn(
									'font-display font-semibold tracking-tight text-balance',
									current ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
								)}>
								{item.role}
							</h3>
							<p className='mt-1.5 text-sm text-muted-foreground'>
								<span className='text-foreground'>{item.organization}</span>
							</p>
						</div>
						{metric ? (
							<span className='numeric shrink-0 font-display text-2xl font-semibold tracking-tight text-signal-ink sm:text-3xl'>
								{metric}
							</span>
						) : null}
					</div>

					<p className='mt-4 max-w-2xl leading-relaxed text-muted-foreground'>{item.description}</p>

					{item.technologies.length ? (
						<div className='mt-5 flex flex-wrap gap-1.5'>
							{item.technologies.map(tech => (
								<Chip key={tech} tone='outline'>
									{tech}
								</Chip>
							))}
						</div>
					) : null}

					{item.highlights.length ? (
						<>
							<button
								type='button'
								onClick={() => setOpen(v => !v)}
								aria-expanded={open}
								aria-controls={panelId}
								className='mt-5 inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground'>
								{open ? 'Hide detail' : `${item.highlights.length} highlights`}
								<ChevronDown
									className={cn('size-3.5 transition-transform duration-500', open && 'rotate-180')}
								/>
							</button>

							<AnimatePresence initial={false}>
								{open ? (
									<motion.div
										id={panelId}
										key='panel'
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.45, ease }}
										className='overflow-hidden'>
										<ul className='mt-5 space-y-3 border-l border-border pl-5'>
											{item.highlights.map(highlight => (
												<li
													key={highlight}
													className='relative text-sm leading-relaxed text-muted-foreground before:absolute before:top-[0.6em] before:-left-5 before:h-px before:w-3 before:bg-border-strong'>
													{highlight}
												</li>
											))}
										</ul>
									</motion.div>
								) : null}
							</AnimatePresence>
						</>
					) : null}
				</div>
			</div>
		</motion.article>
	)
}

export function ExperienceTimeline({ items }: { items: Experience[] }) {
	const ref = useRef<HTMLDivElement>(null)
	const reduced = useReducedMotion()
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 72%', 'end 62%'],
	})
	const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

	return (
		<div ref={ref} className='relative'>
			{/* static rail */}
			<span
				className='absolute top-6 bottom-6 left-[0.72rem] w-px bg-border sm:left-[1.47rem]'
				aria-hidden
			/>
			{/* scroll-drawn rail */}
			<motion.span
				{...(reduced ? {} : { style: { scaleY } })}
				className='absolute top-6 bottom-6 left-[0.72rem] w-px origin-top bg-gradient-to-b from-signal to-signal/20 sm:left-[1.47rem]'
				aria-hidden
			/>
			{items.map((item, i) => (
				<TimelineEntry key={item.id} item={item} index={i} defaultOpen={i === 0} />
			))}
		</div>
	)
}
