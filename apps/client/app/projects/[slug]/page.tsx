import type { Metadata } from 'next'
import type { SlugPageProps } from 'types/components/client'
import { notFound } from 'next/navigation'
import { SiteShell } from 'components/site-shell'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { Section } from 'components/primitives/layout'
import { Reveal } from 'components/primitives/motion'
import { ProjectVisual } from 'components/projects/project-visual'
import { getProjectBySlug, getProjectsData } from 'lib/projects-data'
import { NextProject } from 'components/projects/detail/next-project'
import { ProjectHero } from 'components/projects/detail/project-hero'
import { ProjectDetails } from 'components/projects/detail/project-details'
import { ProjectCaseStudy } from 'components/projects/detail/project-case-study'

const UPDATED = { month: 'short', year: 'numeric' } as const

export const generateStaticParams = async () => {
	const projects = await getProjectsData()
	if (projects.length === 0) return [{ slug: '__no-projects__' }]
	return projects.map(p => ({ slug: p.slug }))
}

export const generateMetadata = async ({ params }: SlugPageProps): Promise<Metadata> => {
	'use cache'
	const { slug } = await params
	const project = await getProjectBySlug(slug)

	if (!project) {
		return {
			title: 'Project not found',
			robots: { index: false },
		}
	}

	return resolveMetadataByPath(`/projects/${slug}`, {
		title: project.title,
		description: project.shortDescription,
		ogImage: project.heroImageUrl || project.imageUrl || undefined,
	})
}

const ProjectDetailPage = async ({ params }: SlugPageProps) => {
	const { slug } = await params
	const [project, projects, socials] = await Promise.all([
		getProjectBySlug(slug),
		getProjectsData(),
		getSocialsData(),
	])

	if (!project) notFound()

	const index = projects.findIndex(item => item.slug === project.slug)
	const next = projects[(index + 1 + projects.length) % projects.length]
	const updated = project.updatedAt
		? new Date(project.updatedAt).toLocaleDateString('en-US', UPDATED)
		: null

	return (
		<SiteShell socials={socials}>
			<ProjectHero project={project} updated={updated} />

			<div className='container-page -mt-px'>
				<Reveal from='scale' className='relative'>
					<div className='group border-border relative overflow-hidden rounded-b-2xl border-x border-b'>
						<ProjectVisual
							slug={project.slug}
							title={project.title}
							coverImageUrl={project.heroImageUrl || project.imageUrl}
							eager
							frame='wide'
							className='aspect-4/3 w-full sm:aspect-video lg:aspect-21/9'
						/>
						<div className='ring-foreground/5 pointer-events-none absolute inset-0 ring-1 ring-inset' />
					</div>
				</Reveal>
			</div>

			<Section className='pt-16 lg:pt-24'>
				<div className='container-page grid gap-14 lg:grid-cols-12 lg:gap-16'>
					<ProjectCaseStudy project={project} />
					<ProjectDetails
						stack={project.technologies}
						tags={project.tags || []}
						updated={updated}
					/>
				</div>
			</Section>

			{next && next.slug !== project.slug ? <NextProject project={next} /> : null}
		</SiteShell>
	)
}

export default ProjectDetailPage
