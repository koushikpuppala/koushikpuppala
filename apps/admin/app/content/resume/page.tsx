import type { Metadata } from 'next'
import { ResumeView } from 'components/resume/resume-view'

export const metadata: Metadata = {
	title: 'Resume Content',
	description: 'Manage downloadable resume documents, summary sections, and version history.',
}

const ResumeContentPage = () => {
	return <ResumeView />
}

export default ResumeContentPage
