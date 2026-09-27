import type { Metadata } from 'next'
import { ExperienceContentClientView } from '@/components/views/experience-content-client-view'

export const metadata: Metadata = {
	title: 'Experience Timeline',
	description: 'Manage professional career roles, responsibilities, dates, and achievements.',
}

export const ExperienceContentPage = () => {
	return <ExperienceContentClientView />
}

export default ExperienceContentPage
