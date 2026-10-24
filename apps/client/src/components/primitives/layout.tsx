import type {
	ChipProps,
	PulseDotProps,
	SectionHeaderProps,
	SectionProps,
} from 'types/components/client'
import { Reveal } from 'components/primitives/motion'
import { classNames } from 'utils/classNames'

export const Section = ({ children, className, id, labelledBy }: SectionProps) => {
	return (
		<section
			id={id}
			aria-labelledby={labelledBy}
			data-section={id}
			className={classNames('relative scroll-mt-24 py-20 md:py-28 lg:py-32', className)}>
			{children}
		</section>
	)
}

export const SectionHeader = ({
	index,
	eyebrow,
	title,
	description,
	action,
	titleId,
	className,
	size = 'lg',
}: SectionHeaderProps) => {
	return (
		<header className={className}>
			<Reveal className='flex items-center gap-4'>
				{index ? <span className='text-mono-xs text-signal-ink'>{index}</span> : null}
				<span className='text-eyebrow whitespace-nowrap'>{eyebrow}</span>
				<span className='bg-border h-px flex-1' />
			</Reveal>
			<div className='mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10'>
				<Reveal delay={70} className='min-w-0'>
					<h2
						id={titleId}
						className={classNames('text-display', {
							'text-3xl sm:text-4xl lg:text-5xl': size === 'md',
							'text-[2.5rem] sm:text-5xl lg:text-[4rem]': size === 'lg',
						})}>
						{title}
					</h2>
					{description ? (
						<p className='text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-[1.0625rem]'>
							{description}
						</p>
					) : null}
				</Reveal>
				{action ? (
					<Reveal delay={140} className='shrink-0'>
						{action}
					</Reveal>
				) : null}
			</div>
		</header>
	)
}

export const Chip = ({ children, className, tone = 'default' }: ChipProps) => {
	return (
		<span
			className={classNames(
				'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-tight whitespace-nowrap',
				{
					'bg-surface-strong text-muted-foreground': tone === 'default',
					'border-border text-muted-foreground border': tone === 'outline',
					'bg-signal-soft text-signal-ink': tone === 'signal',
				},
				className,
			)}>
			{children}
		</span>
	)
}

export const PulseDot = ({ className, tone = 'signal' }: PulseDotProps) => {
	const color = tone === 'signal' ? 'bg-signal' : 'bg-success'
	return (
		<span className={classNames('relative grid size-2 place-items-center', className)} aria-hidden>
			<span
				className={classNames(
					'absolute size-2 rounded-full opacity-60',
					color,
					'animate-pulse-ring',
				)}
			/>
			<span className={classNames('size-2 rounded-full', color)} />
		</span>
	)
}
