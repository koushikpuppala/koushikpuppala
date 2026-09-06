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
		default: 'border-transparent bg-primary text-primary-foreground',
		secondary: 'border-transparent bg-secondary text-secondary-foreground',
		outline: 'border-border text-foreground',
		success: 'border-transparent bg-success/20 text-success font-medium',
		warning: 'border-transparent bg-warning/20 text-warning font-medium',
		destructive: 'border-transparent bg-destructive/20 text-destructive font-medium',
		signal: 'border-transparent bg-signal/20 text-signal-ink font-medium',
	}

	return (
		<div
			className={cn(
				'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
				variantClasses[variant],
				className,
			)}
			{...props}
		/>
	)
}
