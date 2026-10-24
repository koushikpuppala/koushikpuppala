import type { Metadata } from 'next'
import { MediaView } from 'components/media/media-view'

export const metadata: Metadata = {
	title: 'Media Library',
	description: 'Upload, manage, inspect, and organize image and document assets in AWS S3.',
}

const MediaPage = () => {
	return <MediaView />
}

export default MediaPage
