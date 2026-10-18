import type { SurfaceProps } from 'types/components'
import { classNames } from 'utils/classNames'

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
					'hover:border-border-strong hover:bg-surface/90 focus-ring:ring-signal focus-ring:ring-offset-background focus-ring:ring-2 focus-ring:ring-offset-2 cursor-pointer outline-none',
				glow && 'hover:border-signal/50 hover:shadow-[0_0_20px_rgba(255,51,102,0.12)]',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}
