import type { BadgeProps, BadgeVariant } from 'types/components/admin'
import { classNames } from 'utils/classNames'

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
	const variantClasses: Record<BadgeVariant, string> = {
		default: 'border-transparent bg-primary text-primary-foreground font-medium',
		secondary: 'border-transparent bg-secondary text-secondary-foreground font-medium',
		outline: 'border-border bg-surface text-foreground font-medium',
		success: 'border-success/30 bg-success/15 text-success-ink font-mono font-semibold',
		warning: 'border-warning/30 bg-warning/15 text-warning-ink font-mono font-semibold',
		destructive:
			'border-destructive/30 bg-destructive/15 text-destructive-ink font-mono font-semibold',
		signal: 'border-signal/30 bg-signal/15 text-signal-ink font-mono font-semibold',
	}

	return (
		<div
			className={classNames(
				'focus-ring:ring-ring focus-ring:ring-2 focus-ring:ring-offset-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] transition-colors outline-none',
				variantClasses[variant],
				className,
			)}
			{...props}
		/>
	)
}
