import * as React from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant =
	| 'default'
	| 'signal'
	| 'destructive'
	| 'outline'
	| 'secondary'
	| 'ghost'
	| 'link'

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'

const variantClasses: Record<ButtonVariant, string> = {
	default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
	signal: 'bg-signal text-signal-foreground hover:brightness-110 shadow-sm font-medium',
	destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
	outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
	secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
	ghost: 'hover:bg-accent hover:text-accent-foreground',
	link: 'text-signal-ink underline-offset-4 hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
	default: 'h-9 px-4 py-2 text-sm',
	sm: 'h-8 rounded-md px-3 text-xs',
	lg: 'h-10 rounded-lg px-6 text-base',
	icon: 'h-9 w-9 p-0',
	'icon-sm': 'h-8 w-8 rounded-md p-0',
}

export function buttonVariants({
	variant = 'default',
	size = 'default',
	className,
}: {
	variant?: ButtonVariant
	size?: ButtonSize
	className?: string
} = {}) {
	return cn(
		'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variantClasses[variant],
		sizeClasses[size],
		className,
	)
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant
	size?: ButtonSize
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant = 'default', size = 'default', asChild = false, children, ...props },
		ref,
	) => {
		const classes = buttonVariants({ variant, size, className })

		if (asChild && React.isValidElement(children)) {
			const child = children as React.ReactElement<{ className?: string }>
			return React.cloneElement(child, {
				className: cn(classes, child.props.className),
				...props,
			})
		}

		return (
			<button className={classes} ref={ref} {...props}>
				{children}
			</button>
		)
	},
)
Button.displayName = 'Button'

export { Button }
