import type { Metadata } from 'next'

import { DashboardClientView } from '@/components/views/dashboard-client-view'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Overview of portfolio content, recent activity, system health, and CMS metrics.',
}

export const AdminDashboardPage = () => {
	return <DashboardClientView />
}

export default AdminDashboardPage
