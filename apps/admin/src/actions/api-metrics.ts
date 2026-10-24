import { adminFetch } from 'lib/api-client'

export const apiMetricsActions = {
	health: <T>(signal?: AbortSignal) => adminFetch<T>('/api/health', { signal }),

	stats: <T>(signal?: AbortSignal) => adminFetch<T>('/api/v1/api-metrics/stats', { signal }),

	list: <T>(query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<T[]>(`/api/v1/api-metrics?${query.toString()}`, { signal }),
}
