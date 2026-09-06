import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export type SurfaceProps = HTMLAttributes<HTMLElement> & {
	children: ReactNode
	className?: string
	as?: ElementType
	variant?: 'flat' | 'bordered' | 'strong' | 'transparent' | 'card'
	interactive?: boolean
	glow?: boolean
}

/**
 * Surface
 * Technical panel system prioritizing crisp hairline borders over heavy drop shadows.
 */
export const Surface = ({
	children,
	className,
	as: Component = 'div',
	variant = 'bordered',
	interactive = false,
	glow = false,
	...props
}: SurfaceProps) => {
	const variantMap = {
		flat: 'bg-surface border border-border',
		bordered: 'bg-surface/70 backdrop-blur-md border border-border',
		strong: 'bg-surface-strong border border-border-strong',
		transparent: 'bg-transparent border border-border/60',
		card: 'bg-surface-card border border-border',
	}

	return (
		<Component
			className={classNames(
				'relative rounded-lg transition-colors duration-200',
				variantMap[variant],
				interactive &&
					'hover:border-border-strong hover:bg-surface/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer',
				glow && 'hover:border-signal/50 hover:shadow-[0_0_20px_rgba(255,51,102,0.12)]',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}
