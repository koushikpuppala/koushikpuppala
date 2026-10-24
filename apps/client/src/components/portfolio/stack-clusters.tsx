'use client'

import type { StackClustersProps } from 'types/components/client'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { classNames } from 'utils/classNames'

export const StackClusters = ({ services, className }: StackClustersProps) => {
	const [active, setActive] = useState(0)
	const baseId = useId()
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

	if (services.length === 0) return null

	const focusTab = (index: number) => {
		const next = (index + services.length) % services.length
		setActive(next)
		tabRefs.current[next]?.focus()
	}

	const onKeyDown = (event: KeyboardEvent, index: number) => {
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
		<div className={classNames('relative', className)}>
			<div className='border-border bg-border grid gap-px overflow-hidden rounded-2xl border lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]'>
				<div
					role='tablist'
					aria-label='Engineering stack groups'
					aria-orientation='vertical'
					className='bg-border flex snap-x gap-px overflow-x-auto lg:flex-col lg:overflow-visible'>
					{services.map((service, i) => {
						const items = service.features
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
								className={classNames(
									'group relative flex min-w-52 shrink-0 snap-start items-center gap-3 px-5 py-4 text-left transition-colors duration-300 outline-none lg:min-w-0 lg:py-6',
									selected
										? 'bg-surface text-foreground'
										: 'bg-background text-muted-foreground hover:bg-surface/60 hover:text-foreground',
								)}>
								<span
									aria-hidden
									className={classNames(
										'bg-signal absolute inset-y-0 left-0 w-0.5 origin-top transition-transform duration-500 ease-(--ease-out-expo)',
										selected ? 'scale-y-100' : 'scale-y-0',
									)}
								/>
								<span className='text-signal-ink font-mono text-[0.6875rem]'>
									{String(i + 1).padStart(2, '0')}
								</span>
								<span className='min-w-0 flex-1'>
									<span className='font-display block text-base font-medium tracking-tight'>
										{service.title}
									</span>
								</span>
								<span className='numeric text-muted-foreground font-mono text-[0.6875rem]'>
									{String(items.length).padStart(2, '0')}
								</span>
							</button>
						)
					})}
				</div>

				<div className='bg-surface/60 relative min-h-76'>
					<div className='grid-dots pointer-events-none absolute inset-0 opacity-50' aria-hidden />
					<div
						className='pointer-events-none absolute -top-24 -right-16 size-72 opacity-60'
						style={{ background: 'var(--glow-signal)' }}
						aria-hidden
					/>
					{services.map((service, i) => {
						const items = service.features
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
												className='group border-border/70 flex items-baseline gap-4 border-b py-3 last:border-none sm:py-3.5'>
												<span
													aria-hidden
													className='bg-border-strong group-hover:bg-signal size-1.5 shrink-0 translate-y-[-0.15rem] rounded-full transition-colors duration-300'
												/>
												<span className='font-display text-foreground/85 group-hover:text-foreground text-lg font-medium tracking-tight text-balance transition-colors duration-300 sm:text-xl'>
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
