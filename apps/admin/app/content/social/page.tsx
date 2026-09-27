import type { Metadata } from 'next'
import { SocialContentClientView } from '@/components/views/social-content-client-view'

export const metadata: Metadata = {
	title: 'Social Links',
	description: 'Configure social media profiles, developer handles, and public contact links.',
}

export const SocialContentPage = () => {
	return <SocialContentClientView />
}

export default SocialContentPage
