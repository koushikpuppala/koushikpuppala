'use client'

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'motion/react'
import { AlertTriangle, ArrowUpRight, Inbox, RefreshCw } from '@/components/icons'
import {
	useCallback,
	useEffect,
	useRef,
	type CSSProperties,
	type ElementType,
	type ReactNode,
} from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useInteractiveMotion, useRevealRef } from '@/lib/use-reveal'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  Motion primitives                                                          */
/* -------------------------------------------------------------------------- */

type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

const revealVars: Record<RevealFrom, CSSProperties> = {
	up: { '--reveal-y': '22px' } as CSSProperties,
	down: { '--reveal-y': '-22px' } as CSSProperties,
	left: { '--reveal-x': '-28px', '--reveal-y': '0px' } as CSSProperties,
	right: { '--reveal-x': '28px', '--reveal-y': '0px' } as CSSProperties,
	scale: { '--reveal-y': '10px', '--reveal-scale': '0.97' } as CSSProperties,
	fade: { '--reveal-y': '0px' } as CSSProperties,
}

/**
 * Scroll-triggered entrance. Renders visible HTML on the server; the hidden
 * state only exists once the `js` class is present (see `use-reveal`).
 */
export function Reveal({
	children,
	className,
	delay = 0,
	from = 'up',
	as: Tag = 'div',
	style,
}: {
	children: ReactNode
	className?: string
	/** milliseconds */
	delay?: number
	from?: RevealFrom
	as?: ElementType
	style?: CSSProperties
}) {
	const ref = useRevealRef<HTMLElement>()
	return (
		<Tag
			ref={ref}
			data-reveal=''
			className={className}
			style={{ ...revealVars[from], '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}>
			{children}
		</Tag>
	)
}

/**
 * Display headline with controlled line breaks and a per-word mask reveal.
 * Uses a CSS mount animation so the hero never depends on hydration.
 */
export function DisplayLines({
	lines,
	className,
	lineClassName,
	startDelay = 0,
	step = 55,
	accentWord,
}: {
	lines: string[]
	className?: string
	lineClassName?: string
	startDelay?: number
	step?: number
	/** exact word rendered in the signature colour */
	accentWord?: string
}) {
	let index = 0
	return (
		<span className={className}>
			{lines.map((line, lineIndex) => (
				/* biome-ignore lint/suspicious/noArrayIndexKey: display line breakdown */
				<span key={`${line}-${lineIndex}`} className={cn('block', lineClassName)}>
					{line.split(' ').map(word => {
						const delay = startDelay + index * step
						const wordKey = `${word}-${index}`
						index += 1
						return (
							<span
								key={wordKey}
								className='mr-[0.26em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0'>
								<span
									className={cn(
										'enter-mask inline-block',
										word === accentWord && 'text-signal-ink',
									)}
									style={{ '--enter-delay': `${delay}ms` } as CSSProperties}>
									{word}
								</span>
							</span>
						)
					})}
				</span>
			))}
		</span>
	)
}

/** Cursor-attracted wrapper for primary calls to action. */
export function Magnetic({
	children,
	className,
	strength = 0.32,
}: {
	children: ReactNode
	className?: string
	strength?: number
}) {
	const ref = useRef<HTMLDivElement>(null)
	const enabled = useInteractiveMotion()
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 })
	const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 })

	const handleMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (!enabled || !ref.current) return
			const rect = ref.current.getBoundingClientRect()
			x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
			y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
		},
		[enabled, strength, x, y],
	)

	const reset = useCallback(() => {
		x.set(0)
		y.set(0)
	}, [x, y])

	return (
		<motion.div
			ref={ref}
			onPointerMove={handleMove}
			onPointerLeave={reset}
			{...(enabled ? { style: { x: sx, y: sy } } : {})}
			className={cn('inline-flex', className)}>
			{children}
		</motion.div>
	)
}

/** Pointer-following radial highlight. Writes CSS vars directly — no re-renders. */
export function Spotlight({
	children,
	className,
	size = 460,
	intensity = 0.1,
}: {
	children: ReactNode
	className?: string
	size?: number
	intensity?: number
}) {
	const ref = useRef<HTMLDivElement>(null)
	const enabled = useInteractiveMotion()
	const frame = useRef(0)

	const handleMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (!enabled || !ref.current) return
			const el = ref.current
			const { clientX, clientY } = event
			cancelAnimationFrame(frame.current)
			frame.current = requestAnimationFrame(() => {
				const rect = el.getBoundingClientRect()
				el.style.setProperty('--spot-x', `${clientX - rect.left}px`)
				el.style.setProperty('--spot-y', `${clientY - rect.top}px`)
				el.style.setProperty('--spot-o', '1')
			})
		},
		[enabled],
	)

	useEffect(() => () => cancelAnimationFrame(frame.current), [])

	return (
		<div
			ref={ref}
			onPointerMove={handleMove}
			onPointerLeave={() => ref.current?.style.setProperty('--spot-o', '0')}
			className={cn('relative', className)}
			style={{ '--spot-o': '0' } as CSSProperties}>
			{enabled ? (
				<div
					aria-hidden
					className='pointer-events-none absolute inset-0 opacity-[var(--spot-o)] transition-opacity duration-500'
					style={{
						background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--signal) ${intensity * 100}%, transparent), transparent 70%)`,
					}}
				/>
			) : null}
			{children}
		</div>
	)
}

/** Infinite horizontal ticker. Pauses under prefers-reduced-motion via CSS. */
export function Marquee({
	children,
	className,
	speed = 42,
	reverse = false,
}: {
	children: ReactNode
	className?: string
	/** seconds per loop */
	speed?: number
	reverse?: boolean
}) {
	return (
		<div className={cn('mask-fade-x relative overflow-hidden', className)}>
			<div
				className='flex w-max animate-marquee items-center will-change-transform'
				style={{
					animationDuration: `${speed}s`,
					animationDirection: reverse ? 'reverse' : 'normal',
				}}>
				<div className='flex shrink-0 items-center' aria-hidden={false}>
					{children}
				</div>
				<div className='flex shrink-0 items-center' aria-hidden>
					{children}
				</div>
			</div>
		</div>
	)
}

/** Thin reading-progress bar for the sticky header. */
export function ScrollProgress({ className }: { className?: string }) {
	const { scrollYProgress } = useScroll()
	const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
	return (
		<motion.div
			aria-hidden
			style={{ scaleX }}
			className={cn('h-px origin-left bg-signal', className)}
		/>
	)
}

/* -------------------------------------------------------------------------- */
/*  Layout primitives                                                          */
/* -------------------------------------------------------------------------- */

export function Section({
	children,
	className,
	id,
	labelledBy,
}: {
	children: ReactNode
	className?: string
	id?: string
	labelledBy?: string
}) {
	return (
		<section
			id={id}
			aria-labelledby={labelledBy}
			data-section={id}
			className={cn('relative scroll-mt-24 py-20 md:py-28 lg:py-32', className)}>
			{children}
		</section>
	)
}

/** Editorial section header: index, rule, oversized title, optional action. */
export function SectionHeader({
	index,
	eyebrow,
	title,
	description,
	action,
	titleId,
	className,
	size = 'lg',
}: {
	index?: string
	eyebrow: string
	title: ReactNode
	description?: string
	action?: ReactNode
	titleId?: string
	className?: string
	size?: 'md' | 'lg'
}) {
	return (
		<header className={className}>
			<Reveal className='flex items-center gap-4'>
				{index ? <span className='text-mono-xs text-signal-ink'>{index}</span> : null}
				<span className='text-eyebrow whitespace-nowrap'>{eyebrow}</span>
				<span className='h-px flex-1 bg-border' />
			</Reveal>
			<div className='mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10'>
				<Reveal delay={70} className='min-w-0'>
					<h2
						id={titleId}
						className={cn(
							'text-display',
							size === 'lg'
								? 'text-[2.5rem] sm:text-5xl lg:text-[4rem]'
								: 'text-3xl sm:text-4xl lg:text-5xl',
						)}>
						{title}
					</h2>
					{description ? (
						<p className='mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]'>
							{description}
						</p>
					) : null}
				</Reveal>
				{action ? (
					<Reveal delay={140} className='shrink-0'>
						{action}
					</Reveal>
				) : null}
			</div>
		</header>
	)
}

/** Small labelled hairline used to separate stacked content blocks. */
export function LabeledRule({ label, className }: { label: string; className?: string }) {
	return (
		<div className={cn('flex items-center gap-4', className)}>
			<span className='text-eyebrow whitespace-nowrap'>{label}</span>
			<span className='h-px flex-1 bg-border' />
		</div>
	)
}

/* -------------------------------------------------------------------------- */
/*  Atoms                                                                      */
/* -------------------------------------------------------------------------- */

export function Chip({
	children,
	className,
	tone = 'default',
}: {
	children: ReactNode
	className?: string
	tone?: 'default' | 'signal' | 'outline'
}) {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-tight whitespace-nowrap',
				tone === 'default' && 'bg-surface-strong text-muted-foreground',
				tone === 'outline' && 'border border-border text-muted-foreground',
				tone === 'signal' && 'bg-signal-soft text-signal-ink',
				className,
			)}>
			{children}
		</span>
	)
}

export function ArrowLink({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span className={cn('group/al inline-flex items-center gap-1.5 font-medium', className)}>
			{children}
			<ArrowUpRight className='size-4 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover/al:translate-x-0.5 group-hover/al:-translate-y-0.5' />
		</span>
	)
}

export function StatusPill({ status }: { status: string }) {
	const tone =
		status === 'PUBLISHED' || status === 'ACTIVE'
			? 'bg-success/12 text-success border-success/25'
			: status === 'DRAFT' || status === 'INACTIVE'
				? 'bg-warning/12 text-warning border-warning/25'
				: status === 'SUSPENDED'
					? 'bg-destructive/12 text-destructive border-destructive/25'
					: 'bg-muted text-muted-foreground border-border'
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase',
				tone,
			)}>
			{status}
		</span>
	)
}

/** Live availability dot with a soft pulse ring. */
export function PulseDot({
	className,
	tone = 'signal',
}: {
	className?: string
	tone?: 'signal' | 'success'
}) {
	const color = tone === 'signal' ? 'bg-signal' : 'bg-success'
	return (
		<span className={cn('relative grid size-2 place-items-center', className)} aria-hidden>
			<span
				className={cn('absolute size-2 rounded-full opacity-60', color, 'animate-pulse-ring')}
			/>
			<span className={cn('size-2 rounded-full', color)} />
		</span>
	)
}

/* -------------------------------------------------------------------------- */
/*  Status states                                                              */
/* -------------------------------------------------------------------------- */

export function LoadingBlock({ rows = 3, className }: { rows?: number; className?: string }) {
	return (
		<div className={cn('space-y-4', className)} role='status' aria-live='polite' aria-busy='true'>
			<span className='sr-only'>Loading content</span>
			{Array.from({ length: rows }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: deterministic placeholder row count
				<div key={i} className='panel space-y-3 p-6'>
					<Skeleton className='h-4 w-1/3' />
					<Skeleton className='h-3 w-full' />
					<Skeleton className='h-3 w-4/5' />
				</div>
			))}
		</div>
	)
}

export function EmptyState({
	title,
	description,
	action,
	icon,
}: {
	title: string
	description?: string
	action?: ReactNode
	icon?: ReactNode
}) {
	return (
		<div className='panel flex flex-col items-center justify-center gap-3 px-6 py-16 text-center'>
			<div className='rounded-full bg-muted p-3 text-muted-foreground'>
				{icon ?? <Inbox className='size-5' />}
			</div>
			<h3 className='text-lg font-semibold'>{title}</h3>
			{description ? <p className='max-w-sm text-sm text-muted-foreground'>{description}</p> : null}
			{action}
		</div>
	)
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
	return (
		<div className='panel flex flex-col items-center justify-center gap-3 px-6 py-16 text-center'>
			<div className='rounded-full bg-destructive/10 p-3 text-destructive'>
				<AlertTriangle className='size-5' />
			</div>
			<h3 className='text-lg font-semibold'>This section didn&apos;t load</h3>
			<p className='max-w-sm text-sm text-muted-foreground'>
				{message ?? 'The content service is temporarily unavailable.'}
			</p>
			{onRetry ? (
				<Button variant='outline' size='sm' onClick={onRetry}>
					<RefreshCw className='size-4' /> Retry
				</Button>
			) : null}
		</div>
	)
}

export { AnimatePresence, motion }
