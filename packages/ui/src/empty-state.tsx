import type { EmptyStateProps } from 'types/components'
import { LuInbox } from 'react-icons/lu'
import { classNames } from 'utils/classNames'

export const EmptyState = ({ title, description, icon, action, className }: EmptyStateProps) => {
	return (
		<div
			className={classNames(
				'flex flex-col items-center gap-3 px-6 py-14 text-center whitespace-normal',
				className,
			)}>
			<div
				className='bg-signal/10 text-signal-ink ring-signal/5 grid size-14 place-items-center rounded-full text-2xl ring-8'
				aria-hidden>
				{icon ?? <LuInbox />}
			</div>
			<p className='text-foreground text-sm font-semibold'>{title}</p>
			{description ? <p className='text-muted-foreground max-w-sm text-sm'>{description}</p> : null}
			{action ? <div className='mt-1'>{action}</div> : null}
		</div>
	)
}
