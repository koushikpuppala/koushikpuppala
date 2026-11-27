import { adminFetch } from 'lib/api-client'

export const dashboardActions = {
	projects: <T>(signal?: AbortSignal) => adminFetch<T>('/api/v1/projects?limit=1', { signal }),
	publishedProjects: <T>(signal?: AbortSignal) =>
		adminFetch<T>('/api/v1/projects?limit=1&isPublished=true', { signal }),
	recentContacts: <T>(signal?: AbortSignal) => adminFetch<T>('/api/v1/contacts?limit=5', { signal }),
	media: <T>(signal?: AbortSignal) => adminFetch<T>('/api/v1/media?limit=1', { signal }),
	recentAudits: <T>(signal?: AbortSignal) =>
		adminFetch<T>('/api/v1/audit-logs?limit=5', { signal }),
}
