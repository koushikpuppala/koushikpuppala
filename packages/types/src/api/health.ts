export type HealthStatusData = {
	uptime: number
	timestamp: string
	responseTime: string
	status: 'ok' | 'degraded'
	services: { database: string; redis: string }
}

export type StatusBreakdown = {
	'2xx': number
	'3xx': number
	'4xx': number
	'5xx': number
}

export type EndpointUsage = {
	endpoint: string
	method: string
	count: number
	avgDuration: number
}

export type MetricsStats = {
	totalRequests: number
	avgDurationMs: number
	minDurationMs: number
	maxDurationMs: number
	statusBreakdown: StatusBreakdown
	topEndpoints: EndpointUsage[]
}

export type ApiMetricItem = {
	id: string
	ip: string
	method: string
	status: number
	duration: number
	endpoint: string
	requestId: string
	userAgent: string
	createdAt: string
}
