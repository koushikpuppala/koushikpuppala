import type { ReactNode } from 'react'
import { SectionTitle, TechnicalLabel, BodyText } from 'ui/typography'
import { SignalRule } from 'ui/brand'
import { ScrollReveal } from 'ui/motion'
import { classNames } from '../../lib/utils'

export type SectionHeaderProps = {
	index: string
	tag: string
	title: string
	description?: string
	action?: ReactNode
	ruleVariant?: 'left' | 'centered' | 'full'
	className?: string
}

/**
 * SectionHeader
 * Reusable Lovable Signal section header featuring:
 * - Technical index and category tag (e.g., "01 // SELECTED WORK")
 * - High-contrast editorial display title
 * - Narrative description
 * - Optional right-aligned action link
 * - Subtle hairline Signal rule divider
 */
export const SectionHeader = ({
	index,
	tag,
	title,
	description,
	action,
	ruleVariant = 'left',
	className,
}: SectionHeaderProps) => {
	return (
		<ScrollReveal className={classNames('w-full mb-12 sm:mb-16', className)}>
			{/* Technical Index & Category Tag */}
			<div className='flex items-center gap-2 mb-3 sm:mb-4'>
				<TechnicalLabel dot variant='signal'>
					{index} {'//'} {tag}
				</TechnicalLabel>
			</div>

			{/* Title Row with Optional Action */}
			<div className='flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6'>
				<div className='space-y-3 max-w-3xl'>
					<SectionTitle className='text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight'>
						{title}
					</SectionTitle>

					{description && (
						<BodyText className='text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed'>
							{description}
						</BodyText>
					)}
				</div>

				{action && <div className='shrink-0 pt-2 md:pt-0'>{action}</div>}
			</div>

			{/* Divider Rule */}
			<div className='pt-6 sm:pt-8'>
				<SignalRule variant={ruleVariant} dot={ruleVariant === 'left'} />
			</div>
		</ScrollReveal>
	)
}
