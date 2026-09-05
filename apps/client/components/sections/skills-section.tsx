import { Suspense } from 'react'
import Link from 'next/link'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import { SectionFrame } from './section-frame'
import { SectionHeader } from './section-header'
import { SkillClusterCard } from './skill-cluster-card'
import { SectionPlaceholder } from './section-placeholder'
import { getSkillClusters, type SkillCluster } from '../../lib/skills-data'

export interface SkillsSectionProps {
	clusters?: SkillCluster[]
	className?: string
}

async function SkillsClusterGrid({ clusters }: { clusters?: SkillCluster[] }) {
	const items = clusters || (await getSkillClusters())

	return (
		<ScrollReveal delay={0.1}>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7'>
				{items.map(cluster => (
					<SkillClusterCard key={cluster.id} cluster={cluster} />
				))}
			</div>
		</ScrollReveal>
	)
}

/**
 * SkillsSection
 * Recreates the Lovable Skills / Stack Clusters Section:
 * - Editorial SectionHeader with technical index "03 // TECHNICAL STACK"
 * - Grouped stack clusters: Frontend, Backend, Database, Cloud & DevOps, Languages
 * - Interactive cluster cards with proficiency badges and CORE flags
 * - Streaming Suspense boundary with structural SectionPlaceholder fallback
 * - Microgrid background texture transition
 * - Fully responsive for desktop, tablet, and mobile
 */
export const SkillsSection = ({ clusters, className }: SkillsSectionProps) => {
	return (
		<SectionFrame id='skills' background='microgrid' className={className}>
			<SectionHeader
				index='03'
				tag='TECHNICAL STACK'
				title='Core Competencies & Technology Matrix'
				description='Toolchains, distributed database paradigms, modern client frameworks, and cloud primitives utilized in demanding production environments.'
				action={
					<Link
						href='/skills'
						className='group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'>
						<span>EXPLORE STACK</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</Link>
				}
			/>

			{/* Stack Clusters Grid with Streaming Suspense Boundary */}
			<Suspense fallback={<SectionPlaceholder variant='skills' />}>
				<SkillsClusterGrid clusters={clusters} />
			</Suspense>
		</SectionFrame>
	)
}
