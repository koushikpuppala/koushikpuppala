import { Suspense } from 'react'
import Link from 'next/link'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import { SectionFrame } from './section-frame'
import { SectionHeader } from './section-header'
import { AboutContent } from './about-content'
import { SectionPlaceholder } from './section-placeholder'
import { getAboutData, type PortfolioAbout } from '../../lib/about-data'

export type AboutSectionProps = {
	data?: PortfolioAbout
	className?: string
}

async function AboutAsyncContent({ data }: { data?: PortfolioAbout }) {
	const aboutData = data || (await getAboutData())

	return (
		<ScrollReveal delay={0.1}>
			<AboutContent data={aboutData} />
		</ScrollReveal>
	)
}

/**
 * AboutSection
 * Recreates the Lovable Editorial About Section:
 * - SectionHeader with technical index "04 // BIOGRAPHY"
 * - Split 12-column layout with engineering pedestal, brand mark, coordinates, and live status
 * - Large editorial philosophy quote, narrative biography, and telemetry metrics grid
 * - Streaming Suspense boundary with structural SectionPlaceholder fallback
 * - Ambient bloom background texture transition
 * - Fully responsive across desktop, tablet, and mobile
 */
export const AboutSection = ({ data, className }: AboutSectionProps) => {
	return (
		<SectionFrame id='about' background='bloom-top' className={className}>
			<SectionHeader
				index='04'
				tag='BIOGRAPHY'
				title='Engineering Philosophy & System Thinking'
				description='Principles of clarity, deterministic state, performance predictability, and scalable software architecture built over years of full-stack craftsmanship.'
				action={
					<Link
						href='/about'
						className='group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'>
						<span>FULL BIOGRAPHY</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</Link>
				}
			/>

			{/* Editorial About Content with Streaming Suspense Boundary */}
			<Suspense fallback={<SectionPlaceholder variant='about' />}>
				<AboutAsyncContent data={data} />
			</Suspense>
		</SectionFrame>
	)
}
