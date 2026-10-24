import type { FieldProps } from 'types/components/admin'
import { Label } from 'ui/label'
import { classNames } from 'utils/classNames'

const LABEL = {
	form: 'text-xs',
	editor: 'text-muted-foreground font-mono text-xs uppercase',
}

export const Field = ({
	id,
	label,
	required,
	error,
	variant = 'form',
	className,
	children,
}: FieldProps) => (
	<div className={classNames(variant === 'editor' ? 'space-y-1.5' : 'space-y-1', className)}>
		<div className='flex items-baseline gap-0.5'>
			<Label htmlFor={id} className={LABEL[variant]}>
				{label}
			</Label>
			{/* Kept outside the label so its accessible name stays the plain label text. */}
			{required && (
				<span aria-hidden='true' className='text-destructive text-xs'>
					*
				</span>
			)}
		</div>
		{children}
		{error && <p className='text-destructive text-xs'>{error}</p>}
	</div>
)
