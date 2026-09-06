import type { ReactNode } from 'react'
import { DisplayLines, PulseDot } from '@/components/primitives'
import { toDisplayLines } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Shared masthead for inner public routes. Mirrors the home hero's language
 * (grid, ambient glow, sweep, masked word entrance) at a smaller scale so
 * every page opens with the same editorial rhythm.
 */
export function PageHero({
	eyebrow,
	title,
	lines,
	lead,
	meta = [],
	actions,
	accentWord,
	separator = '//',
	className,
}: {
	eyebrow: string
	title: string
	/** explicit line breaks; derived from the title when omitted */
	lines?: string[]
	lead?: string | null
	meta?: string[]
	actions?: ReactNode
	accentWord?: string
	separator?: string
	className?: string
}) {
	const titleLines = lines ?? toDisplayLines(title, 2)

	return (
		<section className='relative overflow-hidden border-b border-border'>
			<div
				className='grid-fine mask-fade-b pointer-events-none absolute inset-0 opacity-60'
				aria-hidden
			/>
			<div
				className='pointer-events-none absolute -top-48 -right-24 size-[32rem] rounded-full opacity-70 blur-3xl'
				style={{ background: 'var(--glow-signal)' }}
				aria-hidden
			/>
			<div className='beam-sweep pointer-events-none absolute inset-x-0 top-28 h-px' aria-hidden />

			<div
				className={cn('container-page relative pt-28 pb-14 sm:pt-32 lg:pt-36 lg:pb-20', className)}>
				<div className='enter-item flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase'>
					<span className='flex items-center gap-2 text-foreground'>
						<PulseDot />
						{eyebrow}
					</span>
					{meta.map(item => (
						<span key={item} className='flex items-center gap-4'>
							<span aria-hidden className='text-signal-ink'>
								{separator}
							</span>
							{item}
						</span>
					))}
				</div>

				<h1 className='text-display text-section mt-7 max-w-4xl'>
					<DisplayLines lines={titleLines} {...(accentWord ? { accentWord } : {})} />
				</h1>

				{lead ? <p className='enter-item enter-delay-4 text-lead mt-7 max-w-2xl'>{lead}</p> : null}

				{actions ? (
					<div className='enter-item enter-delay-5 mt-9 flex flex-wrap items-center gap-3'>
						{actions}
					</div>
				) : null}
			</div>
		</section>
	)
}
