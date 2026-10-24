import type { Metadata } from 'next'
import { NotFoundView } from 'components/not-found-view'

export const metadata: Metadata = {
	title: 'Page not found',
	robots: { index: false },
}

const RootNotFound = () => {
	return (
		<NotFoundView
			eyebrow='404'
			title='Page not found'
			description='This page does not exist. The link may be old, or the page may have moved. Try one of the pages below.'
			primary={{ href: '/projects', label: 'See projects' }}
		/>
	)
}

export default RootNotFound
