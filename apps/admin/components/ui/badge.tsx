import type * as React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant =
	| 'default'
	| 'secondary'
	| 'outline'
	| 'success'
	| 'warning'
	| 'destructive'
	| 'signal'

export function Badge({
	className,
	variant = 'default',
	...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }) {
	const variantClasses: Record<BadgeVariant, string> = {
		default: 'border-transparent bg-primary text-primary-foreground font-medium',
		secondary: 'border-transparent bg-secondary text-secondary-foreground font-medium',
		outline: 'border-border bg-surface text-foreground font-medium',
		success: 'border-success/30 bg-success/15 text-success font-mono font-semibold',
		warning: 'border-warning/30 bg-warning/15 text-warning font-mono font-semibold',
		destructive: 'border-destructive/30 bg-destructive/15 text-destructive font-mono font-semibold',
		signal: 'border-signal/30 bg-signal/15 text-signal-ink font-mono font-semibold',
	}

	return (
		<div
			className={cn(
				'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
				variantClasses[variant],
				className,
			)}
			{...props}
		/>
	)
}
