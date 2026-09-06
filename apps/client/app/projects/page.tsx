import type { Metadata } from 'next'
import { ProjectsView } from '@/components/portfolio/projects-view'
import { getProjects, getSocials } from '@/lib/portfolio-data'

export const metadata: Metadata = {
	title: 'Projects',
	description:
		'Selected engineering work by Koushik Puppala: payment instrument integrations, travel booking platforms and long-running personal projects.',
	openGraph: {
		title: 'Projects — Koushik Puppala',
		description: 'Payments infrastructure, travel integrations and personal engineering projects.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default async function ProjectsPage() {
	const [projects, socials] = await Promise.all([getProjects(), getSocials()])

	return <ProjectsView projects={projects} socials={socials} />
}
