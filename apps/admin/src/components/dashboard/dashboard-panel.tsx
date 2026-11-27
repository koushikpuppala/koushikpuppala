import type { DashboardPanelProps } from 'types/components/admin'
import { useId } from 'react'
import { Button } from 'ui/button'

export const DashboardPanel = ({
	title,
	icon,
	action,
	footer,
	status,
	refreshing,
	errorLabel,
	onRetry,
	skeleton,
	children,
}: DashboardPanelProps) => {
	const titleId = useId()

	return (
		<section
			aria-labelledby={titleId}
			aria-busy={refreshing}
			className='border-border bg-surface rounded-lg border p-6'>
			<header className='border-border flex items-center justify-between gap-3 border-b pb-4'>
				<div className='text-signal-ink flex items-center gap-2'>
					{icon}
					<h2 id={titleId} className='text-subheading text-foreground'>
						{title}
					</h2>
				</div>
				{action}
			</header>

			<div className='pt-4'>
				{status === 'loading' ? (
					skeleton
				) : status === 'error' ? (
					<div role='status' className='flex items-center justify-between gap-3'>
						<p className='text-small text-destructive-ink'>{errorLabel}</p>
						<Button type='button' variant='outline' disabled={refreshing} onClick={onRetry}>
							Retry
						</Button>
					</div>
				) : (
					children
				)}
			</div>

			{footer && <div className='mt-4'>{footer}</div>}
		</section>
	)
}
