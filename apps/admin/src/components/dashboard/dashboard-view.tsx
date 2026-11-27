'use client'

import { useAuth } from 'lib/auth'
import { buildAttention } from 'lib/dashboard-attention'
import { useDashboardBlocks } from 'lib/use-dashboard-block'
import { ErrorBanner } from 'components/ui/error-banner'
import { AttentionStrip } from 'components/dashboard/attention-strip'
import { DashboardCards } from 'components/dashboard/dashboard-cards'
import { DashboardHeader } from 'components/dashboard/dashboard-header'
import { HealthPanel } from 'components/dashboard/health-panel'
import { RecentInquiries } from 'components/dashboard/recent-inquiries'
import { RecentMutations } from 'components/dashboard/recent-mutations'

export const DashboardView = () => {
	const { user } = useAuth()
	const blocks = useDashboardBlocks()
	const all = Object.values(blocks)

	const refreshAll = () => {
		for (const block of all) block.reload()
	}
	const everythingFailed = all.every(block => block.status === 'error' && block.data === null)

	return (
		<div className='space-y-6'>
			<DashboardHeader
				displayName={user?.displayName ?? ''}
				email={user?.email ?? ''}
				refreshing={all.some(block => block.refreshing)}
				onRefresh={refreshAll}>
				<AttentionStrip state={buildAttention(blocks)} />
			</DashboardHeader>

			{everythingFailed && (
				<ErrorBanner
					message="Couldn't reach the API. It may be down, or your session may have expired."
					onRetry={refreshAll}
				/>
			)}

			<DashboardCards blocks={blocks} />

			<div className='grid gap-6 lg:grid-cols-12'>
				<div className='lg:col-span-7'>
					<RecentInquiries block={blocks.contacts} />
				</div>
				<div className='space-y-6 lg:col-span-5'>
					<HealthPanel block={blocks.health} />
					<RecentMutations block={blocks.audits} />
				</div>
			</div>
		</div>
	)
}
