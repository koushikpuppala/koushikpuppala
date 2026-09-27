import type { Metadata } from 'next'
import { ApiMetricsClientView } from '@/components/views/api-metrics-client-view'

export const metadata: Metadata = {
	title: 'API Metrics',
	description: 'Monitor backend endpoint response times, request throughput, and error rates.',
}

export const ApiMetricsPage = () => {
	return <ApiMetricsClientView />
}

export default ApiMetricsPage
