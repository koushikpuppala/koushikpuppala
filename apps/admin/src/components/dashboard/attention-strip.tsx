import type { AttentionItem, AttentionStripProps } from 'types/components/admin'
import Link from 'next/link'
import { classNames } from 'utils/classNames'
import { Skeleton } from 'ui/skeleton'
import { ShieldCheck } from 'components/icons'

const TONE: Record<AttentionItem['tone'], string> = {
	signal: 'border-signal/30 bg-signal/15 text-signal-ink',
	destructive: 'border-destructive/30 bg-destructive/15 text-destructive-ink',
}

const SOURCE_LABEL = { contacts: 'Messages', projects: 'Projects' } as const

export const AttentionStrip = ({ state }: AttentionStripProps) => (
	<section
		aria-label='Needs your attention'
		className='border-border mt-6 flex flex-wrap items-center gap-2 border-t pt-4'>
		{state.items.map(item => (
			<Link
				key={item.id}
				href={item.href}
				className={classNames(
					'text-small h-control-md inline-flex items-center gap-1.5 rounded-md border px-3 font-medium tabular-nums hover:underline',
					'focus-ring:outline-2 focus-ring:outline-offset-2 focus-ring:outline-signal-ink',
					TONE[item.tone],
				)}>
				{item.count === undefined ? item.label : `${item.count} ${item.label}`}
			</Link>
		))}

		{Array.from({ length: state.loading }, (_, i) => (
			<Skeleton key={`loading-${i}`} className='h-control-md w-36 rounded-md' />
		))}

		{state.unavailable.map(source => (
			<span key={source} className='text-small text-muted-foreground px-1'>
				{SOURCE_LABEL[source]} unavailable
			</span>
		))}

		{state.clear && (
			<div className='flex items-center gap-3 px-1'>
				<span className='bg-success/15 text-success-ink flex size-7 shrink-0 items-center justify-center rounded-full'>
					<ShieldCheck aria-hidden className='size-4' />
				</span>
				<p className='text-body text-foreground font-medium'>
					Nothing needs your attention
					<span className='text-small text-muted-foreground block font-normal sm:ml-2 sm:inline'>
						Messages are read, projects are published and every service is up.
					</span>
				</p>
			</div>
		)}
	</section>
)
