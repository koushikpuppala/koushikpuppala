import type { Metadata } from 'next'
import { ProjectsView } from 'components/projects/projects-view'
import { getProjectsData } from 'lib/projects-data'
import { getSocialsData } from 'lib/social-data'

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
	const [projects, socials] = await Promise.all([getProjectsData(), getSocialsData()])

	return <ProjectsView projects={projects} socials={socials} />
}
