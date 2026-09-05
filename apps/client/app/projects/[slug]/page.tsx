import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Noise, FineGrid } from 'ui/background'
import { AmbientBloom } from 'ui/brand'
import { PageContainer } from 'ui/container'
import { PageEntrance } from 'ui/motion'
import { DEFAULT_OG_IMAGE, SITE_DOMAIN, TWITTER_HANDLE } from '../../../lib/metadata-data'
import { getAllProjects, getAdjacentProjects, getProjectBySlug } from '../../../lib/projects-data'
import { getVisibleSocials } from '../../../lib/social-data'
import {
	ProjectHero,
	ProjectVisual,
	CaseStudyBody,
	ProjectNav,
} from '../../../components/project-detail'
import { PublicFooter } from '../../../components/footer'

export interface PageProps {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const projects = await getAllProjects()
	return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params
	const project = await getProjectBySlug(slug)

	if (!project) {
		return {
			title: 'Specification Not Found',
			description: 'The requested project specification could not be located.',
			robots: { index: false, follow: false },
		}
	}

	const title = `${project.title} | Case Study & Architecture`
	const description =
		project.shortDescription ||
		project.subtitle ||
		`Comprehensive systems architecture and case study of ${project.title} engineered by Koushik Puppala.`
	const canonicalUrl = `${SITE_DOMAIN}/projects/${project.slug}`
	const ogImage = project.imageUrl
		? project.imageUrl.startsWith('http')
			? project.imageUrl
			: `${SITE_DOMAIN}${project.imageUrl}`
		: DEFAULT_OG_IMAGE
	const keywords = [
		project.title,
		...(project.technologies || []),
		...(project.tags || []),
		'Systems Architecture',
		'Software Engineering',
		'Full Stack Case Study',
	]

	return {
		title,
		description,
		keywords,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title,
			description,
			url: canonicalUrl,
			siteName: 'Koushik Puppala',
			type: 'article',
			locale: 'en_US',
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${project.title} Architecture Preview`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			site: TWITTER_HANDLE,
			creator: TWITTER_HANDLE,
			images: [ogImage],
		},
	}
}

export default async function ProjectDetailPage({ params }: PageProps) {
	const { slug } = await params
	const [project, socials] = await Promise.all([getProjectBySlug(slug), getVisibleSocials()])

	if (!project) {
		notFound()
	}

	const { prev, next } = await getAdjacentProjects(slug)

	const projectJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		name: project.title,
		description: project.shortDescription || project.subtitle,
		url: `${SITE_DOMAIN}/projects/${project.slug}`,
		author: {
			'@type': 'Person',
			name: 'Koushik Puppala',
			url: SITE_DOMAIN,
		},
		programmingLanguage: project.technologies,
		...(project.github ? { codeRepository: project.github } : {}),
		...(project.imageUrl
			? {
					image: project.imageUrl.startsWith('http')
						? project.imageUrl
						: `${SITE_DOMAIN}${project.imageUrl}`,
				}
			: {}),
	}

	return (
		<main className='relative min-h-screen w-full overflow-hidden bg-background text-foreground pt-24 sm:pt-28 pb-16'>
			{/* Schema.org SoftwareSourceCode Structured Data */}
			<script type='application/ld+json'>
				{JSON.stringify(projectJsonLd).replace(/</g, '\\u003c')}
			</script>
			{/* Film Grain Noise Overlay */}
			<Noise />

			{/* Atmospheric Ambient Bloom */}
			<AmbientBloom size='xl' position='top-center' intensity='normal' />

			{/* Background Fine Grid */}
			<FineGrid mask='radial' opacity={0.25} />

			<PageEntrance delay={0.05}>
				<PageContainer className='space-y-12 sm:space-y-16'>
					{/* Editorial Project Hero */}
					<ProjectHero project={project} />

					{/* High-Definition Project Visual */}
					<ProjectVisual project={project} />

					{/* Case Study Content Sections */}
					<CaseStudyBody project={project} />

					{/* Adjacent Project Navigation */}
					<ProjectNav prev={prev} next={next} />
				</PageContainer>
			</PageEntrance>

			{/* Site Footer */}
			<PublicFooter className='mt-16 sm:mt-24' socials={socials} />
		</main>
	)
}
