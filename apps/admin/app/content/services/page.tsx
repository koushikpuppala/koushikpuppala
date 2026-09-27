import type { Metadata } from 'next'
import { ServicesContentClientView } from '@/components/views/services-content-client-view'

export const metadata: Metadata = {
	title: 'Services Content',
	description: 'Define service offerings, technical capabilities, deliverables, and descriptions.',
}

export const ServicesContentPage = () => {
	return <ServicesContentClientView />
}

export default ServicesContentPage
