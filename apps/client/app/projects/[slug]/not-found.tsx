import { NotFoundView } from 'components/not-found-view'

const ProjectNotFound = () => {
	return (
		<NotFoundView
			eyebrow='404'
			title='Project not found'
			description='This project may have been renamed or taken down. All published work is on the projects page.'
			primary={{ href: '/projects', label: 'All projects' }}
		/>
	)
}

export default ProjectNotFound
