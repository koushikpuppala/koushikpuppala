import type { CheckboxFieldProps } from 'types/components/admin'
import { classNames } from 'utils/classNames'

export const CheckboxField = ({ label, checked, onChange, className }: CheckboxFieldProps) => (
	<label className={classNames('flex cursor-pointer items-center gap-2 text-xs', className)}>
		<input
			type='checkbox'
			checked={Boolean(checked)}
			onChange={event => onChange(event.target.checked)}
		/>
		<span>{label}</span>
	</label>
)
