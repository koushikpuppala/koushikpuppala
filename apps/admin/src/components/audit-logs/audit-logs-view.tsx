'use client'

import type { AuditLogItem } from 'types/api'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { DataTableColumnDef, DataTableFilters } from 'types/components'
import { DataTable } from 'ui/designs/data-table'
import { Button } from 'ui/button'
import { User, Shield, Eye } from 'components/icons'
import { auditLogsActions } from 'actions/audit-logs'
import { useLatestRequest } from 'lib/use-server-list'
import { CountCard } from 'components/cms/count-card'
import { PageHeader } from 'components/cms/page-header'
import { ErrorBanner } from 'components/ui/error-banner'
import { RefreshButton } from 'components/cms/refresh-button'
import { ActionBadge, AuditLogDialog } from 'components/audit-logs/audit-log-dialog'

const PAGE_SIZE = 25

export const AuditLogsView = () => {
	const searchParams = useSearchParams()
	const nextSignal = useLatestRequest()
	const [logs, setLogs] = useState<AuditLogItem[]>([])
	const [loading, setLoading] = useState(true)
	const [loadedOnce, setLoadedOnce] = useState(false)
	const [totalCount, setTotalCount] = useState(0)

	const [error, setError] = useState<string | null>(null)
	const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null)

	const auditFilters: DataTableFilters[] = [
		{
			id: 'action',
			label: 'Action',
			type: 'select',
			options: [
				{ label: 'All Actions', value: '' },
				{ label: 'Create', value: 'CREATE' },
				{ label: 'Update', value: 'UPDATE' },
				{ label: 'Delete', value: 'DELETE' },
				{ label: 'Publish', value: 'PUBLISH' },
				{ label: 'Unpublish', value: 'UNPUBLISH' },
				{ label: 'Upload', value: 'UPLOAD' },
				{ label: 'Login', value: 'LOGIN' },
				{ label: 'Logout', value: 'LOGOUT' },
			],
		},
		{
			id: 'entity',
			label: 'Entity',
			type: 'select',
			options: [
				{ label: 'All Entities', value: '' },
				{ label: 'Home', value: 'Home' },
				{ label: 'About', value: 'About' },
				{ label: 'Resume', value: 'Resume' },
				{ label: 'Social', value: 'Social' },
				{ label: 'Project', value: 'Project' },
				{ label: 'Experience', value: 'Experience' },
				{ label: 'Education', value: 'Education' },
				{ label: 'Service', value: 'Service' },
				{ label: 'Skill', value: 'Skill' },
				{ label: 'Media', value: 'Media' },
				{ label: 'Contact', value: 'Contact' },
				{ label: 'Metadata', value: 'Metadata' },
				{ label: 'User', value: 'User' },
			],
		},
	]

	const loadLogs = useCallback(async () => {
		const signal = nextSignal()

		setLoading(true)
		setError(null)
		try {
			const search = searchParams.get('search') || ''
			const actionFilter = searchParams.get('action') || ''
			const entityFilter = searchParams.get('entity') || ''
			const from = searchParams.get('from') || ''
			const to = searchParams.get('to') || ''

			const query = new URLSearchParams({
				page: searchParams.get('page') || '1',
				limit: searchParams.get('pageSize') || String(PAGE_SIZE),
			})
			if (search) query.set('search', search)
			if (actionFilter) query.set('action', actionFilter)
			if (entityFilter) query.set('entity', entityFilter)
			if (from) query.set('from', from)
			if (to) query.set('to', to)

			const res = await auditLogsActions.list<AuditLogItem>(query, signal)
			if (res.aborted) return
			if (res.data) {
				setLogs(res.data)
				const total = res.count || res.data.length
				setTotalCount(total)
			} else if (res.error) {
				setError(res.error)
			}
		} catch (err) {
			console.error('Failed to load audit logs:', err)
			setError('Failed to load audit logs from server.')
		} finally {
			if (!signal.aborted) {
				setLoading(false)
				setLoadedOnce(true)
			}
		}
	}, [searchParams, nextSignal])

	useEffect(() => {
		loadLogs()
	}, [loadLogs])

	const columns = useMemo<DataTableColumnDef<AuditLogItem>[]>(
		() => [
			{
				accessorKey: 'createdAt',
				enableSorting: true,
				header: 'Timestamp',
				cell: ({ row }) => (
					<span className='text-muted-foreground font-mono text-xs'>
						{new Date(row.original.createdAt).toLocaleString(undefined, {
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
						})}
					</span>
				),
			},
			{
				accessorKey: 'action',
				enableSorting: true,
				header: 'Action',
				cell: ({ row }) => <ActionBadge action={row.original.action} />,
			},
			{
				accessorKey: 'entity',
				enableSorting: true,
				header: 'Entity',
				cell: ({ row }) => (
					<div>
						<span className='text-foreground font-sans font-medium'>{row.original.entity}</span>
						<span className='text-muted-foreground ml-1.5 block max-w-35 truncate font-mono text-[10px]'>
							{row.original.entityId}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'actor',
				enableSorting: true,
				header: 'Actor',
				cell: ({ row }) => (
					<div className='flex items-center gap-2 font-sans'>
						<User className='text-muted-foreground size-3.5 shrink-0' />
						<div className='min-w-0'>
							<span className='text-foreground block max-w-48 truncate font-medium'>
								{row.original.actor}
							</span>
							{row.original.actorEmail && row.original.actorEmail !== row.original.actor && (
								<span className='text-muted-foreground block max-w-48 truncate text-xs'>
									{row.original.actorEmail}
								</span>
							)}
						</div>
					</div>
				),
			},
			{
				accessorKey: 'ipAddress',
				header: 'Client / IP',
				cell: ({ row }) => (
					<span className='text-muted-foreground block max-w-30 truncate font-mono text-xs'>
						{row.original.ipAddress || 'Internal'}
					</span>
				),
			},
			{
				id: 'actions',
				header: () => <div className='text-right'>Details</div>,
				cell: ({ row }) => (
					<div className='text-right'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setSelectedLog(row.original)}
							className='text-signal-ink hover:bg-foreground/5 h-auto rounded-lg px-2 py-1 text-sm font-medium'>
							<Eye className='mr-1 size-3.5' />
							Payload
						</Button>
					</div>
				),
			},
		],
		[],
	)

	return (
		<div className='space-y-6'>
			<PageHeader
				title='Audit Logs & Governance'
				description='Immutable trail of administrative changes, content updates, and authentication events.'>
				<RefreshButton loading={loading} onClick={loadLogs} />
			</PageHeader>

			{error && <ErrorBanner message={error} onRetry={loadLogs} />}

			<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
				<CountCard label='Total Events Recorded' value={totalCount} loaded={loadedOnce} />
				<CountCard
					label='Loaded Records'
					value={logs.length}
					loaded={loadedOnce}
					valueClassName='text-signal-ink'
				/>
				<CountCard
					label='Retention Standard'
					value='PostgreSQL 17 JSONB'
					loaded
					valueClassName='text-foreground font-sans text-sm font-medium'
				/>
				<CountCard
					label='Actor Authorization'
					value={
						<span className='flex items-center gap-1.5'>
							<Shield className='size-4' /> Firebase Token Verified
						</span>
					}
					loaded
					valueClassName='text-success font-sans text-sm font-medium'
				/>
			</div>

			<DataTable
				columns={columns}
				data={logs}
				loading={loading}
				totalCount={totalCount}
				pageSize={PAGE_SIZE}
				manualSorting={false}
				filters={auditFilters}
			/>

			<AuditLogDialog log={selectedLog} onClose={() => setSelectedLog(null)} />
		</div>
	)
}
