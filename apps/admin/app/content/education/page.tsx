import type { Metadata } from 'next'
import { EducationView } from 'components/education/education-view'

export const metadata: Metadata = {
	title: 'Education & Honors',
	description: 'Manage academic background, degrees, certifications, and academic honors.',
}

const EducationContentPage = () => {
	return <EducationView />
}

export default EducationContentPage
