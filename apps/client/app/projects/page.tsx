import type { Metadata } from 'next'
import { ProjectsView } from 'components/projects/projects-view'
import { getProjectsData } from 'lib/projects-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/projects')
}

const ProjectsPage = async () => {
	const [projects, socials] = await Promise.all([getProjectsData(), getSocialsData()])

	return <ProjectsView projects={projects} socials={socials} />
}

export default ProjectsPage
