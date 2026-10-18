import type {
	ClassNameProps,
	IconButtonProps,
	IconButtonSize,
	IconButtonVariant,
	IconButtonVariantOptions,
} from 'types/components'
import { cloneElement, forwardRef, isValidElement, type ReactElement } from 'react'
import { classNames } from 'utils/classNames'

const variantClasses: Record<IconButtonVariant, string> = {
	neutral:
		'text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-ring:ring-signal/40',
	primary: 'text-signal-ink hover:bg-signal/10 focus-ring:ring-signal/40',
	danger: 'text-destructive hover:bg-destructive/10 focus-ring:ring-destructive/40',
}

const sizeClasses: Record<IconButtonSize, string> = {
	sm: 'p-1.5',
	md: 'p-2',
}

const iconButtonVariants = ({
	variant = 'neutral',
	size = 'md',
	className,
}: IconButtonVariantOptions = {}) => {
	return classNames(
		'inline-flex cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 focus-ring:ring-2 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
		variantClasses[variant],
		sizeClasses[size],
		className,
	)
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{ className, variant = 'neutral', size = 'md', asChild = false, children, type, ...props },
		ref,
	) => {
		const classes = iconButtonVariants({ variant, size, className })

		if (asChild && isValidElement(children)) {
			const child = children as ReactElement<ClassNameProps>

			return cloneElement(child, {
				className: classNames(classes, child.props.className),
				...props,
			})
		}

		return (
			<button type={type ?? 'button'} className={classes} ref={ref} {...props}>
				{children}
			</button>
		)
	},
)

IconButton.displayName = 'IconButton'

export { IconButton }
