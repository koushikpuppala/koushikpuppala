import type { EmptyStateProps } from 'types/components/client'
import { Inbox } from 'components/icons'

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => {
	return (
		<div className='panel flex flex-col items-center justify-center gap-3 px-6 py-16 text-center'>
			<div className='bg-muted text-muted-foreground rounded-full p-3'>
				{icon ?? <Inbox className='size-5' />}
			</div>
			<h3 className='text-lg font-semibold'>{title}</h3>
			{description ? <p className='text-muted-foreground max-w-sm text-sm'>{description}</p> : null}
			{action}
		</div>
	)
}
