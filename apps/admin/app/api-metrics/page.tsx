import type { Metadata } from 'next'
import { ApiMetricsView } from 'components/api-metrics/api-metrics-view'

export const metadata: Metadata = {
	title: 'API Metrics',
	description: 'Monitor backend endpoint response times, request throughput, and error rates.',
}

const ApiMetricsPage = () => {
	return <ApiMetricsView />
}

export default ApiMetricsPage
