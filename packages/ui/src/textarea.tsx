import { forwardRef, type ComponentProps } from 'react'
import { classNames } from 'utils/classNames'

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={classNames(
					'border-input hover:border-foreground/40 focus-ring:border-signal-ink placeholder:text-muted-foreground focus-ring:outline-signal-ink focus-ring:outline-2 focus-ring:outline-offset-3 flex min-h-15 w-full rounded-md border bg-[color:var(--field-bg)] px-3 py-2 text-base shadow-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					className,
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)

Textarea.displayName = 'Textarea'

export { Textarea }
