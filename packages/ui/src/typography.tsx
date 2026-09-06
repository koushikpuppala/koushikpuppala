import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export type TypographyBaseProps = HTMLAttributes<HTMLElement> & {
	children: ReactNode
	className?: string
	as?: ElementType
}

/**
 * DisplayHero
 * Huge editorial typography for high-impact statements and hero headlines.
 */
export const DisplayHero = ({
	children,
	className,
	as: Component = 'h1',
	...props
}: TypographyBaseProps) => {
	return (
		<Component
			className={classNames(
				'font-display font-medium text-foreground tracking-[-0.035em]',
				'text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px]',
				'leading-[0.98] sm:leading-[0.94] md:leading-[0.92]',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}

/**
 * SectionTitle
 * Large section headings with strong technical editorial presence.
 */
export const SectionTitle = ({
	children,
	className,
	as: Component = 'h2',
	...props
}: TypographyBaseProps) => {
	return (
		<Component
			className={classNames(
				'font-display font-medium text-foreground tracking-[-0.025em]',
				'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
				'leading-[1.06]',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}

/**
 * SubsectionTitle
 * Secondary headers for cards, case study milestones, and grouped content.
 */
export const SubsectionTitle = ({
	children,
	className,
	as: Component = 'h3',
	...props
}: TypographyBaseProps) => {
	return (
		<Component
			className={classNames(
				'font-display font-medium text-foreground tracking-[-0.015em]',
				'text-xl sm:text-2xl md:text-3xl',
				'leading-snug',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}

export type TechnicalLabelProps = TypographyBaseProps & {
	dot?: boolean
	pulsing?: boolean
	variant?: 'default' | 'signal' | 'live'
}

/**
 * TechnicalLabel
 * Small uppercase monospace label representing category, status, or system metadata.
 */
export const TechnicalLabel = ({
	children,
	className,
	as: Component = 'span',
	dot = false,
	pulsing = false,
	variant = 'default',
	...props
}: TechnicalLabelProps) => {
	const dotVariantMap = {
		default: 'bg-muted-foreground',
		signal: 'bg-signal shadow-[0_0_8px_rgba(255,51,102,0.6)]',
		live: 'bg-status-live shadow-[0_0_8px_rgba(16,185,129,0.6)]',
	}

	return (
		<Component
			className={classNames(
				'font-mono text-xs uppercase tracking-[0.16em] font-medium inline-flex items-center gap-2',
				variant === 'signal' ? 'text-signal' : 'text-muted-foreground',
				className,
			)}
			{...props}>
			{dot && (
				<span
					className={classNames(
						'inline-block h-1.5 w-1.5 rounded-full shrink-0',
						dotVariantMap[variant],
						pulsing && 'animate-pulse',
					)}
					aria-hidden='true'
				/>
			)}
			{children}
		</Component>
	)
}

/**
 * MonoMeta
 * Monospace metadata for dates, counters, tech stacks, and specifications.
 */
export const MonoMeta = ({
	children,
	className,
	as: Component = 'span',
	...props
}: TypographyBaseProps) => {
	return (
		<Component
			className={classNames(
				'font-mono text-xs sm:text-sm text-muted-foreground tracking-tight',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}

/**
 * BodyText
 * Editorial body copy tuned for readability and high contrast.
 */
export const BodyText = ({
	children,
	className,
	as: Component = 'p',
	...props
}: TypographyBaseProps) => {
	return (
		<Component
			className={classNames(
				'font-sans text-base sm:text-lg text-muted-foreground leading-relaxed',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}
