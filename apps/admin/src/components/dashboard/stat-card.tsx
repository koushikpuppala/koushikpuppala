import type { StatCardProps } from 'types/components/admin'
import Link from 'next/link'
import { ArrowUpRight } from 'components/icons'

export const StatCard = ({ label, icon, value, badge, href, linkLabel }: StatCardProps) => (
	<div className='border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs'>
		<div className='text-muted-foreground flex items-center justify-between'>
			<span className='font-mono text-xs tracking-wider uppercase'>{label}</span>
			{icon}
		</div>
		<div className='flex items-baseline justify-between'>
			<span className='font-display text-foreground text-3xl font-bold tracking-tight'>
				{value}
			</span>
			{badge}
		</div>
		<Link
			href={href}
			className='text-signal-ink inline-flex items-center gap-1 font-mono text-[0.6875rem] hover:underline'>
			<span>{linkLabel}</span>
			<ArrowUpRight className='size-3' />
		</Link>
	</div>
)
