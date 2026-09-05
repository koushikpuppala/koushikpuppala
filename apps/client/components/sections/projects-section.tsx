import { Suspense } from 'react'
import Link from 'next/link'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import { SectionFrame } from './section-frame'
import { SectionHeader } from './section-header'
import { ProjectCard } from './project-card'
import { SectionPlaceholder } from './section-placeholder'
import { getFeaturedProjects, type PortfolioProject } from '../../lib/projects-data'

export interface ProjectsSectionProps {
	projects?: PortfolioProject[]
	className?: string
}

async function ProjectsGrid({ projects }: { projects?: PortfolioProject[] }) {
	const items = projects || (await getFeaturedProjects())

	return (
		<ScrollReveal delay={0.1}>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
				{items.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</ScrollReveal>
	)
}

/**
 * ProjectsSection
 * Recreates the Lovable "Selected Work" / Projects Section:
 * - Editorial SectionHeader with technical index "01 // SELECTED WORK"
 * - Dynamic showcase grid of featured engineering systems
 * - Preserves real project data (ExpenseWise, Travel & Flight Booking Platform, SafeRideX, and Portfolio)
 * - Suspense boundary with structural SectionPlaceholder fallback
 * - Fine grid background texture transition
 * - Responsive 2-column layout on desktop/tablet, stacked on mobile
 */
export const ProjectsSection = ({ projects, className }: ProjectsSectionProps) => {
	return (
		<SectionFrame id='projects' background='finegrid' className={className}>
			<SectionHeader
				index='01'
				tag='SELECTED WORK'
				title='Selected Projects & Systems Architecture'
				description='Production platforms, distributed web infrastructure, and AI-enabled software engineered for high throughput, security, and exceptional user experience.'
				action={
					<Link
						href='/projects'
						className='group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'>
						<span>VIEW ALL ARCHIVES</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</Link>
				}
			/>

			{/* Featured Projects Grid with Streaming Suspense Boundary */}
			<Suspense fallback={<SectionPlaceholder variant='projects' />}>
				<ProjectsGrid projects={projects} />
			</Suspense>
		</SectionFrame>
	)
}
