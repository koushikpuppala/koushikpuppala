import type { Metadata } from 'next'
import { EducationContentClientView } from '@/components/views/education-content-client-view'

export const metadata: Metadata = {
	title: 'Education & Honors',
	description: 'Manage academic background, degrees, certifications, and academic honors.',
}

export const EducationContentPage = () => {
	return <EducationContentClientView />
}

export default EducationContentPage
