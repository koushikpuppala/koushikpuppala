import type { Metadata } from 'next'
import { SocialsView } from 'components/socials/socials-view'

export const metadata: Metadata = {
	title: 'Social Links',
	description: 'Configure social media profiles, developer handles, and public contact links.',
}

const SocialContentPage = () => {
	return <SocialsView />
}

export default SocialContentPage
