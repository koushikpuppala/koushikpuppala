import type { Metadata } from 'next'
import { ResumeContentClientView } from '@/components/views/resume-content-client-view'

export const metadata: Metadata = {
	title: 'Resume Content',
	description: 'Manage downloadable resume documents, summary sections, and version history.',
}

export const ResumeContentPage = () => {
	return <ResumeContentClientView />
}

export default ResumeContentPage
