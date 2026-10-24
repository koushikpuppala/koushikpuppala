import type { Metadata } from 'next'
import { AboutView } from 'components/about/about-view'

export const metadata: Metadata = {
	title: 'About Content',
	description: 'Edit personal bio, story, philosophy, core competencies, and profile details.',
}

const AboutContentPage = () => {
	return <AboutView />
}

export default AboutContentPage
