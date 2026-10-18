import type { Metadata } from 'next'
import { ProjectsView } from 'components/projects/projects-view'

export const metadata: Metadata = {
	title: 'Projects & Work',
	description: 'Create and update portfolio case studies, tech stacks, live links, and media.',
}

const ProjectsContentPage = () => {
	return <ProjectsView />
}

export default ProjectsContentPage
