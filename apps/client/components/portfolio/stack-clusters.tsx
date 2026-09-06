'use client'

import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Service } from '@/lib/api-types'
import { Reveal } from '@/components/primitives'
import { splitList } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Engineering stack explorer.
 *
 * Every group is rendered into the DOM (inactive panels are `hidden`, not
 * unmounted) so the full technology list stays crawlable and available to
 * assistive tech, while the visible surface stays focused on one cluster.
 */
export function StackClusters({
	services,
	className,
}: {
	services: Service[]
	className?: string
}) {
	const [active, setActive] = useState(0)
	const baseId = useId()
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

	if (services.length === 0) return null

	const focusTab = (index: number) => {
		const next = (index + services.length) % services.length
		setActive(next)
		tabRefs.current[next]?.focus()
	}

	const onKeyDown = (event: React.KeyboardEvent, index: number) => {
		const keys: Record<string, number> = {
			ArrowDown: index + 1,
			ArrowRight: index + 1,
			ArrowUp: index - 1,
			ArrowLeft: index - 1,
			Home: 0,
			End: services.length - 1,
		}
		const next = keys[event.key]
		if (next === undefined) return
		event.preventDefault()
		focusTab(next)
	}

	return (
		<div className={cn('relative', className)}>
			<div className='grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]'>
				{/* -------------------------------------------------------- clusters */}
				<div
					role='tablist'
					aria-label='Engineering stack groups'
					aria-orientation='vertical'
					className='flex snap-x gap-px overflow-x-auto bg-border lg:flex-col lg:overflow-visible'>
					{services.map((service, i) => {
						const items = splitList(service.description)
						const selected = i === active
						return (
							<button
								key={service.id}
								ref={node => {
									tabRefs.current[i] = node
								}}
								type='button'
								role='tab'
								id={`${baseId}-tab-${i}`}
								aria-selected={selected}
								aria-controls={`${baseId}-panel-${i}`}
								tabIndex={selected ? 0 : -1}
								onClick={() => setActive(i)}
								onFocus={() => setActive(i)}
								onKeyDown={e => onKeyDown(e, i)}
								className={cn(
									'group relative flex min-w-[13rem] shrink-0 snap-start items-center gap-3 px-5 py-4 text-left transition-colors duration-300 outline-none lg:min-w-0 lg:py-6',
									selected
										? 'bg-surface text-foreground'
										: 'bg-background text-muted-foreground hover:bg-surface/60 hover:text-foreground',
								)}>
								<span
									aria-hidden
									className={cn(
										'absolute inset-y-0 left-0 w-0.5 origin-top bg-signal transition-transform duration-500 ease-[var(--ease-out-expo)]',
										selected ? 'scale-y-100' : 'scale-y-0',
									)}
								/>
								<span className='font-mono text-[0.6875rem] text-signal-ink'>
									{String(i + 1).padStart(2, '0')}
								</span>
								<span className='min-w-0 flex-1'>
									<span className='block font-display text-base font-medium tracking-tight'>
										{service.title}
									</span>
								</span>
								<span className='numeric font-mono text-[0.6875rem] text-muted-foreground'>
									{String(items.length).padStart(2, '0')}
								</span>
							</button>
						)
					})}
				</div>

				{/* --------------------------------------------------------- panels */}
				<div className='relative min-h-[19rem] bg-surface/60'>
					<div className='grid-dots pointer-events-none absolute inset-0 opacity-50' aria-hidden />
					<div
						className='pointer-events-none absolute -top-24 -right-16 size-72 opacity-60'
						style={{ background: 'var(--glow-signal)' }}
						aria-hidden
					/>
					{services.map((service, i) => {
						const items = splitList(service.description)
						const selected = i === active
						return (
							<div
								key={service.id}
								role='tabpanel'
								id={`${baseId}-panel-${i}`}
								aria-labelledby={`${baseId}-tab-${i}`}
								hidden={!selected}
								className='relative p-6 sm:p-8 lg:p-10'>
								<p className='text-eyebrow'>{service.title}</p>
								<ul className='mt-6 grid gap-x-8 sm:grid-cols-2'>
									<AnimatePresence initial={false}>
										{items.map((item, index) => (
											<motion.li
												key={item}
												initial={{ opacity: 0, y: 12 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration: 0.45,
													delay: index * 0.035,
													ease: [0.16, 1, 0.3, 1],
												}}
												className='group flex items-baseline gap-4 border-b border-border/70 py-3 last:border-none sm:py-3.5'>
												<span
													aria-hidden
													className='size-1.5 shrink-0 translate-y-[-0.15rem] rounded-full bg-border-strong transition-colors duration-300 group-hover:bg-signal'
												/>
												<span className='font-display text-lg font-medium tracking-tight text-balance text-foreground/85 transition-colors duration-300 group-hover:text-foreground sm:text-xl'>
													{item}
												</span>
											</motion.li>
										))}
									</AnimatePresence>
								</ul>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

/** Compact, non-interactive variant used inside dense pages. */
export function StackList({ services, className }: { services: Service[]; className?: string }) {
	return (
		<div className={cn('relative', className)}>
			{services.map((service, i) => (
				<Reveal key={service.id} delay={i * 45}>
					<div className='group grid gap-3 border-t border-border py-6 last:border-b sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-10'>
						<h3 className='font-display text-lg font-medium tracking-tight'>{service.title}</h3>
						<ul className='flex flex-wrap items-center gap-2'>
							{splitList(service.description).map(item => (
								<li key={item}>
									<span className='inline-flex items-center rounded-md border border-border bg-background/60 px-2.5 py-1.5 font-mono text-[0.75rem] text-muted-foreground transition-all duration-400 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-signal/50 hover:text-foreground'>
										{item}
									</span>
								</li>
							))}
						</ul>
					</div>
				</Reveal>
			))}
		</div>
	)
}
