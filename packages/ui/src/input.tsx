import { forwardRef, type ComponentProps } from 'react'
import { classNames } from 'utils/classNames'

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={classNames(
					'border-input hover:border-foreground/40 focus-ring:border-signal-ink file:text-foreground placeholder:text-muted-foreground focus-ring:outline-signal-ink focus-ring:outline-2 focus-ring:outline-offset-3 h-control-md flex w-full rounded-md border bg-[color:var(--field-bg)] px-3 py-1 text-base shadow-sm transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					className,
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)

Input.displayName = 'Input'

export { Input }
