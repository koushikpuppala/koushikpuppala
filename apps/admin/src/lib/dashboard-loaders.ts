import type { ContactListResult, FetchResult, HealthStatusData, ListResult } from 'types/api'
import type {
	AuditSummary,
	ContactSummary,
	HealthSnapshot,
	ProjectTotals,
	RecentAudit,
	RecentContact,
} from 'types/components/admin'
import { toItems } from 'actions/collection'
import { apiMetricsActions } from 'actions/api-metrics'
import { dashboardActions } from 'actions/dashboard'

const UNEXPECTED = 'Unexpected response from the API.'

const fail = <T>(res: FetchResult<unknown>): FetchResult<T> => ({
	data: null,
	error: res.error ?? UNEXPECTED,
	statusCode: res.statusCode,
	aborted: res.aborted,
})

const pageTotal = (data: ListResult<unknown>): number | null =>
	Array.isArray(data) ? null : (data.pagination?.total ?? null)

export const loadProjects = async (signal: AbortSignal): Promise<FetchResult<ProjectTotals>> => {
	const [all, published] = await Promise.all([
		dashboardActions.projects<ListResult<unknown>>(signal),
		dashboardActions.publishedProjects<ListResult<unknown>>(signal),
	])

	if (!all.data || !published.data) return fail(all.data ? published : all)

	const total = pageTotal(all.data)
	const publishedTotal = pageTotal(published.data)

	if (total === null || publishedTotal === null) return fail(all)

	return { data: { total, published: publishedTotal }, error: null }
}

export const loadContacts = async (signal: AbortSignal): Promise<FetchResult<ContactSummary>> => {
	const res = await dashboardActions.recentContacts<ContactListResult<RecentContact>>(signal)

	if (!res.data) return fail(res)

	const total = pageTotal(res.data)
	const unread = Array.isArray(res.data) ? undefined : res.data.unreadCount

	if (total === null || unread === undefined) return fail(res)

	return { data: { total, unread, recent: toItems(res.data).slice(0, 5) }, error: null }
}

export const loadMedia = async (signal: AbortSignal): Promise<FetchResult<number>> => {
	const res = await dashboardActions.media<ListResult<unknown>>(signal)

	if (!res.data) return fail(res)

	const total = pageTotal(res.data)

	return total === null ? fail(res) : { data: total, error: null }
}

export const loadAudits = async (signal: AbortSignal): Promise<FetchResult<AuditSummary>> => {
	const res = await dashboardActions.recentAudits<ListResult<RecentAudit>>(signal)

	if (!res.data || res.count === undefined) return fail(res)

	return { data: { total: res.count, recent: toItems(res.data).slice(0, 5) }, error: null }
}

export const loadHealth = async (signal: AbortSignal): Promise<FetchResult<HealthSnapshot>> => {
	const res = await apiMetricsActions.health<HealthStatusData>(signal)

	if (!res.data) return fail(res)

	return { data: { health: res.data, checkedAt: new Date() }, error: null }
}
