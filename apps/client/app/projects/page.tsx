import type { Metadata } from 'next'
import { ProjectsView } from 'components/projects/projects-view'
import { getProjectsData } from 'lib/projects-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { JsonLd } from 'components/json-ld'
import { buildPageGraph, buildPerson, buildProjectList } from 'lib/structured-data'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/projects')
}

const ProjectsPage = async () => {
	const [projects, socials] = await Promise.all([getProjectsData(), getSocialsData()])

	return (
		<>
			<JsonLd
				data={buildPageGraph({
					path: '/projects',
					type: 'CollectionPage',
					name: 'Projects',
					person: buildPerson({ socials }),
					mainEntity: buildProjectList(projects),
				})}
			/>
			<ProjectsView projects={projects} socials={socials} />
		</>
	)
}

export default ProjectsPage
