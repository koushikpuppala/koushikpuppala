'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from 'ui/designs/data-table'
import { adminFetch } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	RefreshCw,
	User,
	Shield,
	Eye,
	Search,
} from '@/components/icons'

export type AuditLogItem = {
	id: string
	action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'UPLOAD' | 'LOGIN' | 'LOGOUT'
	entity: string
	entityId: string
	oldData?: unknown
	newData?: unknown
	actor: string
	actorId?: string | null
	ipAddress?: string | null
	userAgent?: string | null
	requestId?: string | null
	createdAt: string
}

export const AuditLogsClientView = () => {
	const [logs, setLogs] = useState<AuditLogItem[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [actionFilter, setActionFilter] = useState<string>('ALL')
	const [entityFilter, setEntityFilter] = useState<string>('ALL')
	const [totalCount, setTotalCount] = useState(0)

	// Detail payload modal
	const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null)

	const loadLogs = useCallback(async () => {
		setLoading(true)
		try {
			const query = new URLSearchParams({
				limit: '100',
			})
			if (search) query.set('search', search)
			if (actionFilter !== 'ALL') query.set('action', actionFilter)
			if (entityFilter !== 'ALL') query.set('entity', entityFilter)

			const res = await adminFetch<AuditLogItem[]>(`/api/v1/audit-logs?${query.toString()}`)
			if (res.data) {
				setLogs(res.data)
				const total = res.count || res.data.length
				setTotalCount(total)
			}
		} catch (err) {
			console.error('Failed to load audit logs:', err)
		} finally {
			setLoading(false)
		}
	}, [search, actionFilter, entityFilter])

	useEffect(() => {
		loadLogs()
	}, [loadLogs])

	const getActionBadge = (action: string) => {
		switch (action) {
			case 'CREATE':
				return <Badge variant='success'>CREATE</Badge>
			case 'UPDATE':
				return <Badge variant='signal'>UPDATE</Badge>
			case 'DELETE':
				return <Badge variant='destructive'>DELETE</Badge>
			case 'PUBLISH':
				return <Badge variant='warning'>PUBLISH</Badge>
			case 'UNPUBLISH':
				return <Badge variant='outline'>UNPUBLISH</Badge>
			case 'UPLOAD':
				return <Badge variant='secondary'>UPLOAD</Badge>
			case 'LOGIN':
				return <Badge variant='signal'>LOGIN</Badge>
			case 'LOGOUT':
				return <Badge variant='outline'>LOGOUT</Badge>
			default:
				return <Badge variant='outline'>{action}</Badge>
		}
	}

	const columns = useMemo<ColumnDef<AuditLogItem>[]>(
		() => [
			{
				accessorKey: 'createdAt',
				header: 'Timestamp',
				cell: ({ row }) => (
					<span className='font-mono text-xs text-muted-foreground'>
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
				header: 'Action',
				cell: ({ row }) => getActionBadge(row.original.action),
			},
			{
				accessorKey: 'entity',
				header: 'Entity',
				cell: ({ row }) => (
					<div>
						<span className='font-sans font-medium text-foreground'>{row.original.entity}</span>
						<span className='text-muted-foreground ml-1.5 text-[10px] block truncate max-w-[140px] font-mono'>
							{row.original.entityId}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'actor',
				header: 'Actor',
				cell: ({ row }) => (
					<div className='flex items-center gap-1.5 font-sans'>
						<User className='size-3.5 text-muted-foreground shrink-0' />
						<span className='text-foreground font-medium truncate max-w-[160px]'>
							{row.original.actor}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'ipAddress',
				header: 'Client / IP',
				cell: ({ row }) => (
					<span className='font-mono text-xs text-muted-foreground truncate block max-w-[120px]'>
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
							className='text-xs text-signal-ink hover:bg-signal-ink/10'>
							<Eye className='size-3.5 mr-1' />
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
			{/* Header */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='font-display text-2xl font-bold tracking-tight text-foreground'>
						Audit Logs & Governance
					</h1>
					<p className='text-sm text-muted-foreground'>
						Immutable trail of administrative changes, content updates, and authentication events.
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' onClick={loadLogs} disabled={loading}>
						<RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
				</div>
			</div>

			{/* Summary Metrics */}
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Total Events Recorded
					</p>
					<p className='font-display text-3xl font-bold text-foreground'>{totalCount}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Loaded Records
					</p>
					<p className='font-display text-3xl font-bold text-signal-ink'>{logs.length}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Retention Standard
					</p>
					<p className='text-sm font-medium text-foreground'>PostgreSQL 17 JSONB</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Actor Authorization
					</p>
					<p className='text-sm font-medium text-emerald-500 flex items-center gap-1.5'>
						<Shield className='size-4' /> Firebase Token Verified
					</p>
				</div>
			</div>

			{/* Filter Toolbar */}
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-surface/60 p-3'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='size-4 text-muted-foreground absolute left-3 top-2.5' />
					<Input
						placeholder='Search audit logs by actor, entity name, or entity ID…'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='pl-9 h-9'
					/>
				</div>
				<div className='flex flex-wrap items-center gap-2 font-mono text-xs'>
					<select
						aria-label='Filter audit logs by action'
						value={actionFilter}
						onChange={e => setActionFilter(e.target.value)}
						className='rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink cursor-pointer'>
						<option value='ALL'>All Actions</option>
						<option value='CREATE'>Create</option>
						<option value='UPDATE'>Update</option>
						<option value='DELETE'>Delete</option>
						<option value='PUBLISH'>Publish</option>
						<option value='UNPUBLISH'>Unpublish</option>
						<option value='UPLOAD'>Upload</option>
						<option value='LOGIN'>Login</option>
						<option value='LOGOUT'>Logout</option>
					</select>

					<select
						aria-label='Filter audit logs by entity type'
						value={entityFilter}
						onChange={e => setEntityFilter(e.target.value)}
						className='rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink cursor-pointer'>
						<option value='ALL'>All Entities</option>
						<option value='Project'>Project</option>
						<option value='Experience'>Experience</option>
						<option value='Education'>Education</option>
						<option value='Service'>Service</option>
						<option value='Skill'>Skill</option>
						<option value='Media'>Media</option>
						<option value='Contact'>Contact</option>
						<option value='Metadata'>Metadata</option>
						<option value='User'>User</option>
					</select>
				</div>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={logs}
				loading={loading}
				totalCount={totalCount}
				pageSize={25}
				disableSearch
			/>

			{/* Payload Diff Modal */}
			<Dialog open={!!selectedLog} onOpenChange={open => !open && setSelectedLog(null)}>
				<DialogContent
					className='max-w-3xl flex flex-col p-6'
					onClose={() => setSelectedLog(null)}>
					<DialogHeader>
						<DialogTitle>{`Audit Payload: ${selectedLog?.action} ${selectedLog?.entity}`}</DialogTitle>
						<DialogDescription>{`Entity ID: ${selectedLog?.entityId} • Actor: ${selectedLog?.actor}`}</DialogDescription>
					</DialogHeader>

					{selectedLog && (
						<div className='space-y-4 pt-2'>
							<div className='grid grid-cols-2 gap-2 rounded-lg border border-border bg-background p-3 text-xs sm:grid-cols-4'>
								<div>
									<span className='text-muted-foreground block'>Timestamp</span>
									<span className='font-mono text-foreground'>
										{new Date(selectedLog.createdAt).toLocaleString()}
									</span>
								</div>
								<div>
									<span className='text-muted-foreground block'>Request ID</span>
									<span className='font-mono text-foreground truncate block'>
										{selectedLog.requestId || 'N/A'}
									</span>
								</div>
								<div>
									<span className='text-muted-foreground block'>IP Address</span>
									<span className='font-mono text-foreground'>
										{selectedLog.ipAddress || 'Internal'}
									</span>
								</div>
								<div>
									<span className='text-muted-foreground block'>Action</span>
									<div>{getActionBadge(selectedLog.action)}</div>
								</div>
							</div>

							<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
								<div className='space-y-1.5'>
									<div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between'>
										<span>Previous State (Old)</span>
										{!selectedLog.oldData && (
											<span className='text-[10px] text-muted-foreground'>Empty (New record)</span>
										)}
									</div>
									<pre className='h-64 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-[11px] text-foreground'>
										{selectedLog.oldData ? JSON.stringify(selectedLog.oldData, null, 2) : 'null'}
									</pre>
								</div>

								<div className='space-y-1.5'>
									<div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between'>
										<span>New State</span>
										{!selectedLog.newData && (
											<span className='text-[10px] text-destructive'>Record deleted</span>
										)}
									</div>
									<pre className='h-64 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-[11px] text-foreground'>
										{selectedLog.newData ? JSON.stringify(selectedLog.newData, null, 2) : 'null'}
									</pre>
								</div>
							</div>

							<div className='flex justify-end pt-2'>
								<Button variant='outline' size='sm' onClick={() => setSelectedLog(null)}>
									Close
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
