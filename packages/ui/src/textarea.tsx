import { forwardRef, type ComponentProps } from 'react'
import { classNames } from 'utils/classNames'

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={classNames(
					'border-input placeholder:text-muted-foreground focus-ring:ring-ring focus-ring:ring-1 flex min-h-15 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
