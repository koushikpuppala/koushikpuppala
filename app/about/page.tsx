import { AboutComponent } from '@import/components'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'About',
	openGraph: {
		title: 'About',
	},
	twitter: {
		title: 'About',
	},
}

const AboutPage = () => {
	return <AboutComponent />
}

export default AboutPage
