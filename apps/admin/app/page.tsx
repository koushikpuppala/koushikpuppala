import type { Metadata } from 'next'

import { DashboardView } from 'components/dashboard/dashboard-view'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Overview of portfolio content, recent activity, system health, and CMS metrics.',
}

const AdminDashboardPage = () => {
	return <DashboardView />
}

export default AdminDashboardPage
