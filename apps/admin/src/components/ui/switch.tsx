import type { SwitchProps } from 'types/components/admin'
import { classNames } from 'utils/classNames'

export const Switch = ({ checked, onChange, label }: SwitchProps) => (
	<button
		type='button'
		role='switch'
		aria-checked={checked}
		aria-label={label}
		onClick={() => onChange(!checked)}
		className={classNames(
			'focus-ring:outline-signal-ink focus-ring:outline-2 focus-ring:outline-offset-2 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
			checked ? 'bg-signal-ink' : 'bg-border',
		)}>
		<span
			className={classNames(
				'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
				checked ? 'translate-x-5' : 'translate-x-0',
			)}
		/>
	</button>
)
