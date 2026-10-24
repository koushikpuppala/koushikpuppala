import { adminFetch } from 'lib/api-client'

export const auditLogsActions = {
	list: <T>(query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<T[]>(`/api/v1/audit-logs?${query.toString()}`, { signal }),
}
