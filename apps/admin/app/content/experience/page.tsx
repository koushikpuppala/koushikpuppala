import type { Metadata } from 'next'
import { ExperienceView } from 'components/experience/experience-view'

export const metadata: Metadata = {
	title: 'Experience Timeline',
	description: 'Manage professional career roles, responsibilities, dates, and achievements.',
}

const ExperienceContentPage = () => {
	return <ExperienceView />
}

export default ExperienceContentPage
