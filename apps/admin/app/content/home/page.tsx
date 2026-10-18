import type { Metadata } from 'next'
import { HomeView } from 'components/home/home-view'

export const metadata: Metadata = {
	title: 'Home Page Content',
	description: 'Manage hero sections, intro copy, featured highlights, and call-to-action content.',
}

const HomeContentPage = () => {
	return <HomeView />
}

export default HomeContentPage
