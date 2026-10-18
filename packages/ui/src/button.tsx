import type {
	ButtonProps,
	ButtonSize,
	ButtonVariant,
	ButtonVariantOptions,
	ClassNameProps,
} from 'types/components'
import { forwardRef, isValidElement, cloneElement, type ReactElement } from 'react'
import { classNames } from 'utils/classNames'

const variantClasses: Record<ButtonVariant, string> = {
	default: 'bg-primary text-primary-foreground hover:bg-primary/88 active:scale-[0.985]',
	signal:
		'bg-signal-solid text-signal-foreground shadow-[var(--shadow-signal)] hover:brightness-108 active:scale-[0.985]',
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

export const buttonVariants = ({
	variant = 'default',
	size = 'default',
	className,
}: ButtonVariantOptions = {}) => {
	return classNames(
		'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer transition-[background-color,border-color,color,box-shadow,transform] duration-250 ease-[var(--ease-out-expo)] focus-ring:outline-2 focus-ring:outline-offset-3 focus-ring:outline-signal-ink disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variantClasses[variant],
		sizeClasses[size],
		className,
	)
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant = 'default', size = 'default', asChild = false, children, ...props },
		ref,
	) => {
		const classes = buttonVariants({ variant, size, className })

		if (asChild && isValidElement(children)) {
			const child = children as ReactElement<ClassNameProps>

			return cloneElement(child, {
				className: classNames(classes, child.props.className),
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
