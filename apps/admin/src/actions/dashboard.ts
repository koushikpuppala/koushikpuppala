import { adminFetch } from 'lib/api-client'

export const dashboardActions = {
	projects: <T>() => adminFetch<T>('/api/v1/projects?limit=1'),
	publishedProjects: <T>() => adminFetch<T>('/api/v1/projects?limit=1&isPublished=true'),
	recentContacts: <T>() => adminFetch<T>('/api/v1/contacts?limit=5'),
	media: <T>() => adminFetch<T>('/api/v1/media?limit=1'),
	recentAudits: <T>() => adminFetch<T>('/api/v1/audit-logs?limit=5'),
}
