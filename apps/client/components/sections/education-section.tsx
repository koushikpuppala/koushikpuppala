import { Suspense } from 'react'
import Link from 'next/link'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import { SectionFrame } from './section-frame'
import { SectionHeader } from './section-header'
import { EducationCard } from './education-card'
import { SectionPlaceholder } from './section-placeholder'
import { getPublishedEducation, type PortfolioEducation } from '../../lib/education-data'

export type EducationSectionProps = {
	educations?: PortfolioEducation[]
	className?: string
}

async function EducationGrid({ educations }: { educations?: PortfolioEducation[] }) {
	const items = educations || (await getPublishedEducation())

	return (
		<ScrollReveal delay={0.1}>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
				{items.map(edu => (
					<EducationCard key={edu.id} education={edu} />
				))}
			</div>
		</ScrollReveal>
	)
}

/**
 * EducationSection
 * Recreates the Lovable Education Section:
 * - Editorial SectionHeader with technical index "05 // EDUCATION"
 * - Grouped academic credentials: IIIT Raichur (B.Tech CS), Intermediate, Secondary School
 * - Coursework focus areas, academic leadership highlights, and verified links
 * - Streaming Suspense boundary with structural SectionPlaceholder fallback
 * - Fully responsive across desktop, tablet, and mobile
 */
export const EducationSection = ({ educations, className }: EducationSectionProps) => {
	return (
		<SectionFrame id='education' background='clean' className={className}>
			<SectionHeader
				index='05'
				tag='EDUCATION'
				title='Academic Background & Continuous Study'
				description='Foundations in computer science, algorithmic theory, distributed databases, and rigorous mathematical problem solving.'
				action={
					<Link
						href='/education'
						className='group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'>
						<span>VIEW CREDENTIALS</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</Link>
				}
			/>

			{/* Academic Credentials Grid with Streaming Suspense Boundary */}
			<Suspense fallback={<SectionPlaceholder variant='education' />}>
				<EducationGrid educations={educations} />
			</Suspense>
		</SectionFrame>
	)
}
