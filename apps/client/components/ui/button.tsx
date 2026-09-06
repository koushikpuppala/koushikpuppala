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

export type ButtonSize = 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm'

const variantClasses: Record<ButtonVariant, string> = {
	default: 'bg-primary text-primary-foreground hover:bg-primary/88 active:scale-[0.985]',
	signal:
		'bg-signal text-signal-foreground shadow-[var(--shadow-signal)] hover:brightness-108 active:scale-[0.985]',
	destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
	outline:
		'border border-border-strong bg-transparent hover:border-foreground/35 hover:bg-accent active:scale-[0.985]',
	secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/75',
	ghost: 'hover:bg-accent hover:text-accent-foreground',
	link: 'text-foreground underline-offset-4 hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
	default: 'h-9 px-4 py-2',
	sm: 'h-8 rounded-md px-3 text-xs',
	lg: 'h-11 px-6 text-[0.9375rem]',
	xl: 'h-13 px-7 text-base',
	icon: 'h-9 w-9',
	'icon-sm': 'h-8 w-8 rounded-md',
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
		'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer transition-[background-color,border-color,color,box-shadow,transform] duration-250 ease-[var(--ease-out-expo)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal-ink disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
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
