import { classNames } from '../../lib/utils'

export interface HeroMetaItem {
	label: string
	value: string
	subtext?: string
}

export interface HeroMetaStripProps {
	className?: string
	items?: HeroMetaItem[]
}

const DEFAULT_META: HeroMetaItem[] = [
	{
		label: 'BASED IN',
		value: 'Bengaluru, India',
		subtext: 'UTC+5:30 // Global Remote',
	},
	{
		label: 'CURRENT ROLE',
		value: 'Senior Full-Stack Engineer',
		subtext: 'Distributed Platforms & Systems',
	},
	{
		label: 'CORE FOCUS',
		value: 'Next.js 16 + NestJS + AI',
		subtext: 'Resilient Web Architecture',
	},
]

/**
 * HeroMetaStrip
 * Technical metadata bar presenting key location, professional role, and architectural focus.
 */
export const HeroMetaStrip = ({ className, items = DEFAULT_META }: HeroMetaStripProps) => {
	return (
		<div
			className={classNames(
				'w-full rounded-xl border border-border/70 bg-surface/50 backdrop-blur-md',
				'grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50 shadow-sm',
				className,
			)}>
			{items.map(item => (
				<div key={item.label} className='flex flex-col gap-1 p-4 sm:p-5'>
					<span className='font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-medium'>
						{item.label}
					</span>
					<span className='font-sans text-sm sm:text-base font-semibold text-foreground tracking-tight'>
						{item.value}
					</span>
					{item.subtext && (
						<span className='font-mono text-xs text-muted-foreground/80 tracking-tight'>
							{item.subtext}
						</span>
					)}
				</div>
			))}
		</div>
	)
}
