import type { StatCardProps } from 'types/components/admin'
import Link from 'next/link'
import { ArrowUpRight } from 'components/icons'
import { StatValueSkeleton } from 'components/skeletons'

export const StatCard = ({ label, icon, status, value, badge, href, linkLabel }: StatCardProps) => (
	<div className='border-border bg-surface space-y-3 rounded-lg border p-5'>
		<div className='text-muted-foreground flex items-center justify-between'>
			<span className='text-caption font-semibold tracking-wider uppercase'>{label}</span>
			{icon}
		</div>
		<div className='flex min-h-9 items-baseline justify-between gap-2'>
			<span className='text-headline text-foreground font-bold tabular-nums'>
				{status === 'loading' ? (
					<StatValueSkeleton />
				) : status === 'ready' && value !== null ? (
					value
				) : (
					<span className='text-small text-muted-foreground font-normal'>Unavailable</span>
				)}
			</span>
			{status === 'ready' && badge}
		</div>
		<Link
			href={href}
			className='text-signal-ink text-small h-control-md focus-ring:outline-2 focus-ring:outline-offset-2 focus-ring:outline-signal-ink inline-flex items-center gap-1 hover:underline'>
			<span>{linkLabel}</span>
			<ArrowUpRight aria-hidden className='size-3' />
		</Link>
	</div>
)
