import type { Metadata } from 'next'
import { AuditLogsClientView } from '@/components/views/audit-logs-client-view'

export const metadata: Metadata = {
	title: 'Audit Logs',
	description: 'Track administrative actions, authentication events, and content change logs.',
}

export const AuditLogsPage = () => {
	return <AuditLogsClientView />
}

export default AuditLogsPage
