import type { Metadata } from 'next'
import { HomeContentClientView } from '@/components/views/home-content-client-view'

export const metadata: Metadata = {
	title: 'Home Page Content',
	description: 'Manage hero sections, intro copy, featured highlights, and call-to-action content.',
}

export const HomeContentPage = () => {
	return <HomeContentClientView />
}

export default HomeContentPage
