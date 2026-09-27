import type { Metadata } from 'next'
import { ProjectsContentClientView } from '@/components/views/projects-content-client-view'

export const metadata: Metadata = {
	title: 'Projects & Work',
	description: 'Create and update portfolio case studies, tech stacks, live links, and media.',
}

export const ProjectsContentPage = () => {
	return <ProjectsContentClientView />
}

export default ProjectsContentPage
