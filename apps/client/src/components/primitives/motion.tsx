'use client'

import type {
	DisplayLinesProps,
	MagneticProps,
	MarqueeProps,
	RevealFrom,
	RevealProps,
	ScrollProgressProps,
	SpotlightProps,
} from 'types/components/client'
import { useCallback, useEffect, useRef, type PointerEvent, type CSSProperties } from 'react'
import { useMotionValue, useScroll, useSpring } from 'motion/react'
import { div as MotionDiv } from 'motion/react-m'
import { useInteractiveMotion, useRevealRef } from 'lib/use-reveal'
import { classNames } from 'utils/classNames'

const revealVars: Record<RevealFrom, CSSProperties> = {
	up: { '--reveal-y': '22px' } as CSSProperties,
	down: { '--reveal-y': '-22px' } as CSSProperties,
	left: { '--reveal-x': '-28px', '--reveal-y': '0px' } as CSSProperties,
	right: { '--reveal-x': '28px', '--reveal-y': '0px' } as CSSProperties,
	scale: { '--reveal-y': '10px', '--reveal-scale': '0.97' } as CSSProperties,
	fade: { '--reveal-y': '0px' } as CSSProperties,
}

export const Reveal = ({
	children,
	className,
	delay = 0,
	from = 'up',
	as: Tag = 'div',
	style,
}: RevealProps) => {
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

export const DisplayLines = ({
	lines,
	className,
	lineClassName,
	startDelay = 0,
	step = 55,
	accentWord,
}: DisplayLinesProps) => {
	let index = 0

	return (
		<span className={className}>
			{lines.map(line => (
				<span key={line} className={classNames('block', lineClassName)}>
					{line.split(' ').map(word => {
						const delay = startDelay + index * step

						const wordKey = `${word}-${index}`

						index += 1

						return (
							<span
								key={wordKey}
								className='mr-[0.26em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0'>
								<span
									className={classNames('enter-mask inline-block', {
										'text-signal-ink': word === accentWord,
									})}
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

export const Magnetic = ({ children, className, strength = 0.32 }: MagneticProps) => {
	const ref = useRef<HTMLDivElement>(null)

	const enabled = useInteractiveMotion()

	const x = useMotionValue(0)
	const y = useMotionValue(0)

	const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 })
	const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 })

	const handleMove = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
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
		<MotionDiv
			ref={ref}
			onPointerMove={handleMove}
			onPointerLeave={reset}
			{...(enabled ? { style: { x: sx, y: sy } } : {})}
			className={classNames('inline-flex', className)}>
			{children}
		</MotionDiv>
	)
}

export const Spotlight = ({ children, className, size = 460, intensity = 0.1 }: SpotlightProps) => {
	const ref = useRef<HTMLDivElement>(null)

	const enabled = useInteractiveMotion()

	const frame = useRef(0)

	const handleMove = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
			if (!enabled || !ref.current) return

			const el = ref.current

			const { clientX, clientY } = event

			// Batch pointer moves into one style write per frame.
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
			className={classNames('relative', className)}
			style={{ '--spot-o': '0' } as CSSProperties}>
			{enabled ? (
				<div
					aria-hidden
					className='pointer-events-none absolute inset-0 opacity-(--spot-o) transition-opacity duration-500'
					style={{
						background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--signal) ${intensity * 100}%, transparent), transparent 70%)`,
					}}
				/>
			) : null}
			{children}
		</div>
	)
}

export const Marquee = ({ children, className, speed = 42, reverse = false }: MarqueeProps) => {
	return (
		<div className={classNames('mask-fade-x relative overflow-hidden', className)}>
			<div
				className='animate-marquee flex w-max items-center will-change-transform'
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

export const ScrollProgress = ({ className }: ScrollProgressProps) => {
	const { scrollYProgress } = useScroll()

	const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

	return (
		<MotionDiv
			aria-hidden
			style={{ scaleX }}
			className={classNames('bg-signal h-px origin-left', className)}
		/>
	)
}
