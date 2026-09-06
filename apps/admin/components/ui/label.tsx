import * as React from 'react'
import { cn } from '@/lib/utils'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: polymorphic accessible form label primitive
		<label
			ref={ref}
			className={cn(
				'text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none',
				className,
			)}
			{...props}
		/>
	)
})
Label.displayName = 'Label'

export { Label }
