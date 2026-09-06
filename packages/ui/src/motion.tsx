'use client'

import {
	type HTMLMotionProps,
	motion,
	useReducedMotion,
	AnimatePresence,
} from 'motion/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export { AnimatePresence, motion, useReducedMotion }

// Standardized Easing Tokens matching the Signal Aesthetic
export const EASING = {
	expoOut: [0.16, 1, 0.3, 1] as const,
	quartOut: [0.25, 1, 0.5, 1] as const,
	spring: [0.2, 0.8, 0.2, 1] as const,
}

export type MotionBaseProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
	children: ReactNode
	className?: string
	delay?: number
	duration?: number
}

/**
 * StaggerContainer
 * Container that staggers the reveal of child elements sequentially.
 */
export const StaggerContainer = ({
	children,
	className,
	delay = 0,
	...props
}: MotionBaseProps) => {
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return (
			<div className={className} {...(props as HTMLAttributes<HTMLDivElement>)}>
				{children}
			</div>
		)
	}

	return (
		<motion.div
			initial='hidden'
			animate='visible'
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: 0.08,
						delayChildren: delay,
					},
				},
			}}
			className={className}
			{...props}>
			{children}
		</motion.div>
	)
}

/**
 * PageEntrance
 * Subtle upward fade entrance for pages and top-level views.
 */
export const PageEntrance = ({
	children,
	className,
	delay = 0,
	duration = 0.6,
	...props
}: MotionBaseProps) => {
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return (
			<div className={className} {...(props as HTMLAttributes<HTMLDivElement>)}>
				{children}
			</div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration,
				delay,
				ease: EASING.expoOut,
			}}
			className={className}
			{...props}>
			{children}
		</motion.div>
	)
}

/**
 * MaskedText
 * Cinematic masked typography entrance revealing headline text upwards from an overflow clip.
 */
export const MaskedText = ({
	children,
	className,
	delay = 0.1,
	duration = 0.8,
	...props
}: MotionBaseProps) => {
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return (
			<div className={className} {...(props as HTMLAttributes<HTMLDivElement>)}>
				{children}
			</div>
		)
	}

	return (
		<div className={classNames('overflow-hidden', className)} {...(props as HTMLAttributes<HTMLDivElement>)}>
			<motion.div
				initial={{ y: '105%' }}
				animate={{ y: '0%' }}
				transition={{
					duration,
					delay,
					ease: EASING.expoOut,
				}}>
				{children}
			</motion.div>
		</div>
	)
}

/**
 * FadeEntrance
 * Lightweight opacity entrance for atmospheric elements, background textures, and borders.
 */
export const FadeEntrance = ({
	children,
	className,
	delay = 0,
	duration = 0.5,
	...props
}: MotionBaseProps) => {
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return (
			<div className={className} {...(props as HTMLAttributes<HTMLDivElement>)}>
				{children}
			</div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration,
				delay,
				ease: EASING.quartOut,
			}}
			className={className}
			{...props}>
			{children}
		</motion.div>
	)
}

export type ScrollRevealProps = MotionBaseProps & {
	yOffset?: number
	once?: boolean
	margin?: string
}

/**
 * ScrollReveal
 * Reveals sections and milestones smoothly as the viewport scrolls past them.
 */
export const ScrollReveal = ({
	children,
	className,
	delay = 0,
	duration = 0.6,
	yOffset = 20,
	once = true,
	margin = '-60px',
	...props
}: ScrollRevealProps) => {
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return (
			<div className={className} {...(props as HTMLAttributes<HTMLDivElement>)}>
				{children}
			</div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: yOffset }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once, margin: margin as any }}
			transition={{
				duration,
				delay,
				ease: EASING.expoOut,
			}}
			className={className}
			{...props}>
			{children}
		</motion.div>
	)
}

/**
 * SignalArrow
 * Precision CTA arrow that micro-translates diagonally on hover.
 */
export const SignalArrow = ({
	className,
	size = 14,
	...props
}: HTMLAttributes<HTMLSpanElement> & { size?: number }) => {
	return (
		<span
			className={classNames(
				'inline-flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5',
				className,
			)}
			aria-hidden='true'
			{...props}>
			<svg
				width={size}
				height={size}
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<line x1='7' y1='17' x2='17' y2='7' />
				<polyline points='7 7 17 7 17 17' />
			</svg>
		</span>
	)
}

/**
 * Floating
 * Subtle sinusoidal ambient float for decorative tokens and icons.
 */
export const Floating = ({
	children,
	className,
	distance = 6,
	duration = 6,
	...props
}: MotionBaseProps & { distance?: number }) => {
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return (
			<div className={className} {...(props as HTMLAttributes<HTMLDivElement>)}>
				{children}
			</div>
		)
	}

	return (
		<motion.div
			animate={{
				y: [-distance, distance, -distance],
			}}
			transition={{
				duration,
				ease: 'easeInOut',
				repeat: Infinity,
			}}
			className={className}
			{...props}>
			{children}
		</motion.div>
	)
}
