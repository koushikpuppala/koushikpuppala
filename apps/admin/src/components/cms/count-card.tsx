import type { CountCardProps } from 'types/components/admin'
import { classNames } from 'utils/classNames'
import { StatValueSkeleton } from 'components/skeletons'

export const CountCard = ({ label, value, loaded, valueClassName, indicator }: CountCardProps) => (
	<div className='border-border bg-surface space-y-1.5 rounded-2xl border p-5 shadow-xs'>
		<div className='flex items-center justify-between'>
			<p className='text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase'>
				{label}
			</p>
			{indicator && <span className='bg-signal-ink h-2 w-2 animate-pulse rounded-full' />}
		</div>
		<p
			className={classNames(
				'font-display text-3xl font-bold',
				valueClassName ?? 'text-foreground',
			)}>
			{loaded ? value : <StatValueSkeleton />}
		</p>
	</div>
)
