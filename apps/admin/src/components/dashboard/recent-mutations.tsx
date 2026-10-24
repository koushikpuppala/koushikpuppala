import type { RecentMutationsProps } from 'types/components/admin'
import Link from 'next/link'
import { Activity } from 'components/icons'
import { Badge } from 'components/ui/badge'

const TIME = { hour: '2-digit', minute: '2-digit' } as const

export const RecentMutations = ({ audits }: RecentMutationsProps) => (
	<div className='border-border bg-surface space-y-3 rounded-2xl border p-6 shadow-xs'>
		<div className='border-border flex items-center justify-between border-b pb-3'>
			<div className='flex items-center gap-2'>
				<Activity className='text-signal-ink size-4' />
				<h2 className='font-display text-foreground text-sm font-semibold'>Recent Mutations</h2>
			</div>
			<Link
				href='/audit-logs'
				className='text-signal-ink font-mono text-[0.6875rem] hover:underline'>
				View all
			</Link>
		</div>

		{audits.length === 0 ? (
			<div className='text-muted-foreground py-6 text-center font-sans text-xs'>
				No recorded mutations yet.
			</div>
		) : (
			<div className='space-y-2.5 font-mono text-xs'>
				{audits.map(audit => (
					<div key={audit.id} className='flex items-center justify-between py-1'>
						<div className='flex min-w-0 items-center gap-2'>
							<Badge variant={audit.action === 'DELETE' ? 'destructive' : 'secondary'}>
								{audit.action}
							</Badge>
							<span className='text-foreground truncate font-sans text-xs'>{audit.entity}</span>
						</div>
						<span className='text-muted-foreground shrink-0 text-[0.625rem]'>
							{new Date(audit.createdAt).toLocaleTimeString([], TIME)}
						</span>
					</div>
				))}
			</div>
		)}
	</div>
)
