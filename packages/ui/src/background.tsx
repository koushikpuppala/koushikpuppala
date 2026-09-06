import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export type GridProps = HTMLAttributes<HTMLDivElement> & {
	className?: string
	mask?: 'radial' | 'top' | 'bottom' | 'edges' | 'none'
	opacity?: number
}

const maskMap = {
	radial: 'mask-radial-fade',
	top: 'mask-t-fade',
	bottom: 'mask-b-fade',
	edges: 'mask-edges-fade',
	none: '',
}

/**
 * FineGrid
 * Very subtle 48px hairline grid texture providing architectural structure.
 */
export const FineGrid = ({
	className,
	mask = 'radial',
	opacity,
	style,
	...props
}: GridProps) => {
	return (
		<div
			className={classNames(
				'absolute inset-0 bg-fine-grid pointer-events-none opacity-60 dark:opacity-40 select-none',
				maskMap[mask],
				className,
			)}
			style={{
				...(opacity !== undefined ? { opacity } : {}),
				...style,
			}}
			aria-hidden='true'
			{...props}
		/>
	)
}

/**
 * MicroGrid
 * Dense 16px technical grid for localized panels, cards, or technical highlights.
 */
export const MicroGrid = ({
	className,
	mask = 'none',
	opacity,
	style,
	...props
}: GridProps) => {
	return (
		<div
			className={classNames(
				'absolute inset-0 bg-micro-grid pointer-events-none opacity-40 dark:opacity-20 select-none',
				maskMap[mask],
				className,
			)}
			style={{
				...(opacity !== undefined ? { opacity } : {}),
				...style,
			}}
			aria-hidden='true'
			{...props}
		/>
	)
}

/**
 * DotGrid
 * Precision 24px dotted technical texture.
 */
export const DotGrid = ({
	className,
	mask = 'radial',
	opacity,
	style,
	...props
}: GridProps) => {
	return (
		<div
			className={classNames(
				'absolute inset-0 bg-dot-grid pointer-events-none opacity-50 dark:opacity-25 select-none',
				maskMap[mask],
				className,
			)}
			style={{
				...(opacity !== undefined ? { opacity } : {}),
				...style,
			}}
			aria-hidden='true'
			{...props}
		/>
	)
}

/**
 * Noise
 * Subtle film grain texture at low opacity to break artificial gradients.
 */
export const Noise = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={classNames(
				'pointer-events-none fixed inset-0 z-50 bg-noise opacity-80 mix-blend-overlay select-none',
				className,
			)}
			aria-hidden='true'
			{...props}
		/>
	)
}

export type FadeMaskProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode
	type?: 'radial' | 'top' | 'bottom' | 'edges'
	className?: string
}

/**
 * FadeMask
 * Applies gradient masks to child elements to blend them gently into the page canvas.
 */
export const FadeMask = ({
	children,
	type = 'radial',
	className,
	...props
}: FadeMaskProps) => {
	return (
		<div className={classNames('relative w-full h-full', maskMap[type], className)} {...props}>
			{children}
		</div>
	)
}
