import { Suspense } from 'react'
import Link from 'next/link'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import { AnimatedBeam } from 'ui/brand'
import { SectionFrame } from './section-frame'
import { SectionHeader } from './section-header'
import { ExperienceCard } from './experience-card'
import { SectionPlaceholder } from './section-placeholder'
import { getPublishedExperiences, type PortfolioExperience } from '../../lib/experience-data'

export type ExperienceSectionProps = {
	experiences?: PortfolioExperience[]
	className?: string
}

async function ExperienceTimeline({ experiences }: { experiences?: PortfolioExperience[] }) {
	const items = experiences || (await getPublishedExperiences())

	return (
		<div className='relative ml-2 sm:ml-8 pl-6 sm:pl-12 border-l border-border/80 space-y-8 sm:space-y-14 max-w-4xl'>
			<AnimatedBeam orientation='vertical' className='-left-[1px]' />
			{items.map((exp, idx) => (
				<ScrollReveal key={exp.id} delay={0.05 + idx * 0.08}>
					<ExperienceCard experience={exp} />
				</ScrollReveal>
			))}
		</div>
	)
}

/**
 * ExperienceSection
 * Recreates the Lovable Experience Timeline Section:
 * - SectionHeader with technical index "02 // EXPERIENCE"
 * - Left vertical continuous rail line
 * - Interactive timeline nodes with pulsing live indicator for current role
 * - Milestone cards detailing company, employment type, dates, responsibilities, and stack
 * - Suspense boundary backed by structural SectionPlaceholder fallback
 * - Fully responsive layout across desktop, tablet, and mobile
 */
export const ExperienceSection = ({ experiences, className }: ExperienceSectionProps) => {
	return (
		<SectionFrame id='experience' background='clean' className={className}>
			<SectionHeader
				index='02'
				tag='EXPERIENCE'
				title='Career Trajectory & Engineering Roles'
				description='Professional milestones across high-growth startups and enterprise platforms, driving architectural decisions, performance optimization, and distributed systems.'
				action={
					<Link
						href='/experience'
						className='group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'>
						<span>FULL TIMELINE</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</Link>
				}
			/>

			{/* Vertical Timeline Rail with Streaming Suspense Boundary */}
			<Suspense fallback={<SectionPlaceholder variant='experience' />}>
				<ExperienceTimeline experiences={experiences} />
			</Suspense>
		</SectionFrame>
	)
}
