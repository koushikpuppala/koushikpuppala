import type { Metadata } from 'next'
import { ProjectsView } from 'components/projects/projects-view'
import { getProjectsData } from 'lib/projects-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'

export const generateMetadata = async (): Promise<Metadata> => {
	return resolveMetadataByPath('/projects')
}

export default async function ProjectsPage() {
	const [projects, socials] = await Promise.all([getProjectsData(), getSocialsData()])

	return <ProjectsView projects={projects} socials={socials} />
}
