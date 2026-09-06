import type { HTMLAttributes, SVGProps } from 'react'
import { classNames } from 'utils/classNames'

export type SignalRuleProps = HTMLAttributes<HTMLDivElement> & {
	variant?: 'left' | 'centered' | 'full'
	glow?: boolean
	dot?: boolean
}

/**
 * SignalRule
 * Thin horizontal pink-to-transparent engineering line with optional glowing signal pip.
 */
export const SignalRule = ({
	className,
	variant = 'left',
	glow = false,
	dot = false,
	...props
}: SignalRuleProps) => {
	return (
		<div className={classNames('relative w-full flex items-center', className)} {...props}>
			{dot && variant === 'left' && (
				<span className='h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(255,51,102,0.8)] mr-2 shrink-0' />
			)}
			<div
				className={classNames(
					'h-[1px] w-full',
					variant === 'left' &&
						'bg-gradient-to-r from-signal via-signal/40 to-transparent',
					variant === 'centered' &&
						'bg-gradient-to-r from-transparent via-signal/60 to-transparent',
					variant === 'full' && 'bg-border',
					glow && 'shadow-[0_0_10px_rgba(255,51,102,0.4)]',
				)}
			/>
		</div>
	)
}

export type AmbientBloomProps = HTMLAttributes<HTMLDivElement> & {
	size?: 'sm' | 'md' | 'lg' | 'xl'
	position?: 'top-center' | 'top-right' | 'center' | 'bottom-left'
	intensity?: 'subtle' | 'normal' | 'vivid'
}

/**
 * AmbientBloom
 * Very subtle pink radial glow establishing atmospheric technical depth.
 */
export const AmbientBloom = ({
	className,
	size = 'lg',
	position = 'top-center',
	intensity = 'subtle',
	...props
}: AmbientBloomProps) => {
	const sizeMap = {
		sm: 'w-[280px] h-[280px]',
		md: 'w-[480px] h-[480px]',
		lg: 'w-[720px] h-[720px]',
		xl: 'w-[960px] h-[960px]',
	}

	const positionMap = {
		'top-center': 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/3',
		'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
		center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
		'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
	}

	const intensityMap = {
		subtle: 'opacity-40 dark:opacity-25',
		normal: 'opacity-60 dark:opacity-40',
		vivid: 'opacity-80 dark:opacity-60',
	}

	return (
		<div
			className={classNames(
				'pointer-events-none absolute -z-10 rounded-full ambient-bloom select-none',
				sizeMap[size],
				positionMap[position],
				intensityMap[intensity],
				className,
			)}
			aria-hidden='true'
			{...props}
		/>
	)
}

/**
 * BrandGlyph
 * Precision vector icon of the Koushik Puppala architectural monogram.
 */
export const BrandGlyph = ({
	className,
	size = 28,
	...props
}: SVGProps<SVGSVGElement> & { size?: number }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox='0 0 48 48'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={classNames('shrink-0', className)}
			{...props}>
			{/* Precision geometric KP Monogram */}
			<rect
				x='8'
				y='8'
				width='32'
				height='32'
				rx='6'
				stroke='currentColor'
				strokeWidth='1.5'
				className='text-border-strong'
			/>
			{/* K Vertical Spine */}
			<line
				x1='16'
				y1='15'
				x2='16'
				y2='33'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				className='text-foreground'
			/>
			{/* K Top Diagonal */}
			<line
				x1='16'
				y1='24'
				x2='26'
				y2='15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				className='text-foreground'
			/>
			{/* K Bottom Diagonal */}
			<line
				x1='19'
				y1='21'
				x2='27'
				y2='33'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				className='text-foreground'
			/>
			{/* Signal Vertex Accent */}
			<circle cx='32' cy='16' r='2.5' fill='var(--signal)' className='animate-pulse' />
		</svg>
	)
}

export type BrandWatermarkProps = HTMLAttributes<HTMLDivElement> & {
	size?: number
	opacity?: number
}

/**
 * BrandWatermark
 * Oversized, low-opacity technical background glyph.
 */
export const BrandWatermark = ({
	className,
	size = 640,
	opacity,
	style,
	...props
}: BrandWatermarkProps) => {
	return (
		<div
			className={classNames(
				'pointer-events-none absolute select-none text-foreground/5 dark:text-foreground/[0.03]',
				className,
			)}
			style={{
				...(opacity !== undefined ? { opacity } : {}),
				...style,
			}}
			aria-hidden='true'
			{...props}>
			<svg
				width={size}
				height={size}
				viewBox='0 0 100 100'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<rect
					x='10'
					y='10'
					width='80'
					height='80'
					rx='16'
					stroke='currentColor'
					strokeWidth='1.5'
				/>
				<path
					d='M32 25V75M32 50L55 25M40 43L58 75'
					stroke='currentColor'
					strokeWidth='3.5'
					strokeLinecap='round'
				/>
				<circle cx='68' cy='28' r='5' fill='currentColor' />
			</svg>
		</div>
	)
}

export type AnimatedBeamProps = HTMLAttributes<HTMLDivElement> & {
	orientation?: 'horizontal' | 'vertical'
	duration?: number
}

/**
 * AnimatedBeam
 * A thin traveling light beam moving smoothly along an edge or border.
 */
export const AnimatedBeam = ({
	className,
	orientation = 'horizontal',
	...props
}: AnimatedBeamProps) => {
	return (
		<div
			className={classNames(
				'pointer-events-none absolute overflow-hidden',
				orientation === 'horizontal' ? 'h-[1px] w-full inset-x-0' : 'w-[1px] h-full inset-y-0',
				className,
			)}
			{...props}>
			<div
				className={classNames(
					'absolute from-transparent via-signal to-transparent',
					orientation === 'horizontal'
						? 'bg-gradient-to-r h-full w-48 animate-beam-horizontal'
						: 'bg-gradient-to-b w-full h-48 animate-beam-vertical',
				)}
			/>
		</div>
	)
}
