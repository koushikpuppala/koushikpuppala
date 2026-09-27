import type { Metadata } from 'next'
import { MediaClientView } from '@/components/views/media-client-view'

export const metadata: Metadata = {
	title: 'Media Library',
	description: 'Upload, manage, inspect, and organize image and document assets in AWS S3.',
}

export const MediaPage = () => {
	return <MediaClientView />
}

export default MediaPage
