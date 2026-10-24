import type { ContactInputFieldProps } from 'types/components/client'
import { Label } from 'ui/label'

export const ContactInputField = ({
	id,
	label,
	error,
	required,
	aside,
	children,
}: ContactInputFieldProps) => (
	<div className='space-y-2'>
		<div className='flex items-center justify-between'>
			<Label htmlFor={id} className='text-foreground text-sm font-medium'>
				{label} {required && <span className='text-destructive'>*</span>}
			</Label>
			{aside}
		</div>
		{children}
		{error ? (
			<p id={`${id}-error`} className='text-destructive text-[0.8125rem]'>
				{error}
			</p>
		) : null}
	</div>
)
