import type { Metadata } from 'next'
import { ServicesView } from 'components/services/services-view'

export const metadata: Metadata = {
	title: 'Services Content',
	description: 'Define service offerings, technical capabilities, deliverables, and descriptions.',
}

const ServicesContentPage = () => {
	return <ServicesView />
}

export default ServicesContentPage
