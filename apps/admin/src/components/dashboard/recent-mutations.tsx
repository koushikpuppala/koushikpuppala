import type { BadgeVariant, RecentMutationsProps } from 'types/components/admin'
import Link from 'next/link'
import { SkeletonText } from 'ui/skeleton'
import { formatRelativeTime } from 'utils/formatRelativeTime'
import { Activity } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { DashboardPanel } from 'components/dashboard/dashboard-panel'

const ACTION_VARIANT: Record<string, BadgeVariant> = {
	DELETE: 'destructive',
	CREATE: 'success',
	PUBLISH: 'success',
}

export const RecentMutations = ({ block }: RecentMutationsProps) => (
	<DashboardPanel
		title='Recent changes'
		icon={<Activity aria-hidden className='size-4' />}
		action={
			<Link
				href='/audit-logs'
				className='text-small text-signal-ink h-control-md focus-ring:outline-2 focus-ring:outline-offset-2 focus-ring:outline-signal-ink inline-flex items-center hover:underline'>
				View all
			</Link>
		}
		status={block.status}
		refreshing={block.refreshing}
		errorLabel="Couldn't load changes"
		onRetry={block.reload}
		skeleton={<SkeletonText lines={5} />}>
		{block.data?.recent.length ? (
			<ul className='divide-border -my-2 divide-y'>
				{block.data.recent.map(audit => (
					<li key={audit.id}>
						<Link
							href='/audit-logs'
							className='min-h-row hover:bg-accent focus-ring:outline-2 focus-ring:outline-offset-2 focus-ring:outline-signal-ink grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md px-2 py-2.5'>
							<Badge
								variant={ACTION_VARIANT[audit.action] ?? 'secondary'}
								className='w-20 justify-center'>
								{audit.action}
							</Badge>
							<div className='min-w-0'>
								<p className='text-body text-foreground truncate font-medium'>{audit.entity}</p>
								<p className='text-caption text-muted-foreground truncate'>by {audit.actor}</p>
							</div>
							<span className='text-caption text-muted-foreground shrink-0 tabular-nums'>
								{formatRelativeTime(audit.createdAt)}
							</span>
						</Link>
					</li>
				))}
			</ul>
		) : (
			<p className='text-small text-muted-foreground py-6 text-center'>No changes yet</p>
		)}
	</DashboardPanel>
)
