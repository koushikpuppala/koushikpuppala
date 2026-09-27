import type { Metadata } from 'next'
import { AboutContentClientView } from '@/components/views/about-content-client-view'

export const metadata: Metadata = {
	title: 'About Content',
	description: 'Edit personal bio, story, philosophy, core competencies, and profile details.',
}

export const AboutContentPage = () => {
	return <AboutContentClientView />
}

export default AboutContentPage
