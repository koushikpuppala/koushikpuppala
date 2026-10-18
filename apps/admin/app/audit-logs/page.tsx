import type { Metadata } from 'next'
import { AuditLogsView } from 'components/audit-logs/audit-logs-view'

export const metadata: Metadata = {
	title: 'Audit Logs',
	description: 'Track administrative actions, authentication events, and content change logs.',
}

const AuditLogsPage = () => {
	return <AuditLogsView />
}

export default AuditLogsPage
