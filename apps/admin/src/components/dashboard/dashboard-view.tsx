'use client'

import type { HealthStatusData, ListPage, ListResult, ContactListResult } from 'types/api'
import type {
	DashboardMetrics,
	HealthState,
	RecentAudit,
	RecentContact,
} from 'types/components/admin'
import { useEffect, useState } from 'react'
import { Badge } from 'components/ui/badge'
import { StatCard } from './stat-card'
import { HealthPanel } from './health-panel'
import { DashboardHero } from './dashboard-hero'
import { ErrorBanner } from 'components/ui/error-banner'
import { RecentInquiries } from './recent-inquiries'
import { RecentMutations } from './recent-mutations'
import { dashboardActions } from 'actions/dashboard'
import { apiMetricsActions } from 'actions/api-metrics'
import { DashboardSkeleton } from 'components/skeletons'
import { Activity, FolderKanban, Image as ImageIcon, Inbox } from 'components/icons'
import { buildDashboardMetrics, EMPTY_METRICS, firstError } from 'lib/dashboard-metrics'

const ICON = 'text-signal-ink size-4'

export const DashboardView = () => {
	const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_METRICS)
	const [loading, setLoading] = useState(true)
	const [health, setHealth] = useState<HealthState>(null)
	const [error, setError] = useState<string | null>(null)

	const loadDashboard = async () => {
		setLoading(true)
		setError(null)

		try {
			const [projects, published, contacts, media, audits] = await Promise.all([
				dashboardActions.projects<ListPage<unknown>>(),
				dashboardActions.publishedProjects<ListPage<unknown>>(),
				dashboardActions.recentContacts<ContactListResult<RecentContact>>(),
				dashboardActions.media<ListResult<unknown>>(),
				dashboardActions.recentAudits<ListResult<RecentAudit>>(),
			])
			const responses = { projects, published, contacts, media, audits }

			setError(firstError(responses))
			setMetrics(buildDashboardMetrics(responses))
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to connect to backend API.')
		} finally {
			setLoading(false)
		}
	}

	const loadHealth = async () => {
		const res = await apiMetricsActions.health<HealthStatusData>()
		setHealth(res.data ?? false)
	}

	useEffect(() => {
		loadDashboard()
		loadHealth()
	}, [])

	if (loading) return <DashboardSkeleton />

	return (
		<div className='space-y-8'>
			{error && <ErrorBanner message={error} onRetry={loadDashboard} />}

			<DashboardHero />

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					label='Projects'
					icon={<FolderKanban className={ICON} />}
					value={metrics.projectsCount}
					badge={<Badge variant='success'>{metrics.publishedProjects} Published</Badge>}
					href='/content/projects'
					linkLabel='Manage projects'
				/>
				<StatCard
					label='Contact Inbox'
					icon={<Inbox className={ICON} />}
					value={metrics.inboxCount}
					badge={
						metrics.unreadInquiries > 0 ? (
							<Badge variant='signal'>{metrics.unreadInquiries} Unread</Badge>
						) : (
							<Badge variant='secondary'>All Read</Badge>
						)
					}
					href='/messages'
					linkLabel='Open inbox'
				/>
				<StatCard
					label='Media Assets'
					icon={<ImageIcon className={ICON} />}
					value={metrics.mediaCount}
					badge={<Badge variant='outline'>AWS S3</Badge>}
					href='/media'
					linkLabel='Media library'
				/>
				<StatCard
					label='Audit Trail'
					icon={<Activity className={ICON} />}
					value={metrics.auditEventsCount}
					badge={<Badge variant='secondary'>Audited</Badge>}
					href='/audit-logs'
					linkLabel='View activity logs'
				/>
			</div>

			<div className='grid gap-6 lg:grid-cols-12'>
				<RecentInquiries contacts={metrics.recentContacts} />

				<div className='space-y-6 lg:col-span-5'>
					<HealthPanel health={health} />
					<RecentMutations audits={metrics.recentAudits} />
				</div>
			</div>
		</div>
	)
}
