import type { ListResult } from 'types/api'
import type { DashboardMetrics, DashboardResponses } from 'types/components/admin'
import { toItems } from 'actions/collection'

export const EMPTY_METRICS: DashboardMetrics = {
	projectsCount: 0,
	publishedProjects: 0,
	inboxCount: 0,
	unreadInquiries: 0,
	mediaCount: 0,
	auditEventsCount: 0,
	recentContacts: [],
	recentAudits: [],
}

export const listTotal = (data: ListResult<unknown> | null): number => {
	if (!data) return 0

	if (Array.isArray(data)) return data.length

	return data.pagination?.total ?? data.items?.length ?? 0
}

export const firstError = ({
	projects,
	contacts,
	media,
	audits,
}: DashboardResponses): string | null =>
	projects.error || contacts.error || media.error || audits.error || null

export const buildDashboardMetrics = ({
	projects,
	published,
	contacts,
	media,
	audits,
}: DashboardResponses): DashboardMetrics => {
	const contactItems = contacts.data ? toItems(contacts.data) : []
	const auditItems = audits.data ? toItems(audits.data) : []
	const unread =
		contacts.data && !Array.isArray(contacts.data) ? contacts.data.unreadCount : undefined

	return {
		projectsCount: projects.data?.pagination?.total ?? 0,
		publishedProjects: published.data?.pagination?.total ?? 0,
		inboxCount: listTotal(contacts.data),
		unreadInquiries: unread ?? contactItems.filter(contact => contact.status === 'UNREAD').length,
		mediaCount: media.count ?? listTotal(media.data),
		auditEventsCount: audits.count ?? auditItems.length,
		recentContacts: contactItems.slice(0, 5),
		recentAudits: auditItems.slice(0, 5),
	}
}
