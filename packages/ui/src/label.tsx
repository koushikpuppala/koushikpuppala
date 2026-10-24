import type { LabelProps } from 'types/components'
import { forwardRef } from 'react'
import { classNames } from 'utils/classNames'

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: polymorphic accessible form label primitive
		<label
			ref={ref}
			className={classNames(
				'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				className,
			)}
			{...props}
		/>
	)
})

Label.displayName = 'Label'

export { Label }
