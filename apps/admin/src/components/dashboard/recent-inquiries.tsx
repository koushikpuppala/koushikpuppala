import type { RecentInquiriesProps } from 'types/components/admin'
import Link from 'next/link'
import { SkeletonText } from 'ui/skeleton'
import { formatDate } from 'utils/formatDate'
import { Inbox } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { DashboardPanel } from 'components/dashboard/dashboard-panel'

export const RecentInquiries = ({ block }: RecentInquiriesProps) => (
	<DashboardPanel
		title='Recent messages'
		icon={<Inbox aria-hidden className='size-4' />}
		action={
			<Link
				href='/messages'
				className='text-small text-signal-ink h-control-md focus-ring:outline-2 focus-ring:outline-offset-2 focus-ring:outline-signal-ink inline-flex items-center hover:underline'>
				View all
			</Link>
		}
		status={block.status}
		refreshing={block.refreshing}
		errorLabel="Couldn't load messages"
		onRetry={block.reload}
		skeleton={<SkeletonText lines={5} />}>
		{block.data?.recent.length ? (
			<ul className='divide-border -my-2 divide-y'>
				{block.data.recent.map(contact => (
					<li key={contact.id}>
						<Link
							href={`/messages?id=${contact.id}`}
							className='min-h-row hover:bg-accent focus-ring:outline-2 focus-ring:outline-offset-2 focus-ring:outline-signal-ink flex items-center justify-between gap-3 rounded-md px-2 py-2'>
							<div className='min-w-0'>
								<div className='flex items-center gap-2'>
									<span className='text-body text-foreground truncate font-medium'>
										{contact.name}
									</span>
									{contact.status === 'UNREAD' && <Badge variant='signal'>New</Badge>}
								</div>
								<p className='text-small text-muted-foreground truncate'>{contact.subject}</p>
							</div>
							<span className='text-caption text-muted-foreground shrink-0'>
								{formatDate(contact.createdAt)}
							</span>
						</Link>
					</li>
				))}
			</ul>
		) : (
			<p className='text-small text-muted-foreground py-6 text-center'>No messages yet</p>
		)}
	</DashboardPanel>
)
