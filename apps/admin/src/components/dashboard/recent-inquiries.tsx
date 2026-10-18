import type { RecentInquiriesProps } from 'types/components/admin'
import Link from 'next/link'
import { Button } from 'ui/button'
import { Inbox } from 'components/icons'
import { Badge } from 'components/ui/badge'

const DAY = { month: 'short', day: 'numeric' } as const

export const RecentInquiries = ({ contacts }: RecentInquiriesProps) => (
	<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs lg:col-span-7'>
		<div className='border-border flex items-center justify-between border-b pb-4'>
			<div className='flex items-center gap-2'>
				<Inbox className='text-signal-ink size-4' />
				<h2 className='font-display text-foreground text-base font-semibold'>Recent Inquiries</h2>
			</div>
			<Button asChild variant='ghost' size='sm'>
				<Link href='/messages'>View all</Link>
			</Button>
		</div>

		{contacts.length === 0 ? (
			<div className='text-muted-foreground py-8 text-center text-sm'>
				No visitor inquiries in inbox.
			</div>
		) : (
			<div className='divide-border divide-y'>
				{contacts.map(contact => (
					<div
						key={contact.id}
						className='hover:bg-accent/30 flex flex-col justify-between gap-2 rounded-lg px-2 py-3.5 transition-colors sm:flex-row sm:items-center'>
						<div className='min-w-0 space-y-1'>
							<div className='flex items-center gap-2'>
								<span className='text-foreground truncate font-sans text-sm font-semibold'>
									{contact.name}
								</span>
								{contact.status === 'UNREAD' && <Badge variant='signal'>New</Badge>}
							</div>
							<p className='text-muted-foreground truncate font-mono text-xs'>{contact.subject}</p>
						</div>
						<div className='flex shrink-0 items-center justify-between gap-3 font-mono text-xs sm:justify-end'>
							<span className='text-muted-foreground text-[0.6875rem]'>
								{new Date(contact.createdAt).toLocaleDateString('en-US', DAY)}
							</span>
							<Button asChild size='sm' variant='outline'>
								<Link href={`/messages?id=${contact.id}`}>Review</Link>
							</Button>
						</div>
					</div>
				))}
			</div>
		)}
	</div>
)
