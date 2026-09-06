'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from 'ui/designs/data-table'
import { adminFetch } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Server,
	Database,
	Radio,
	RefreshCw,
	Clock,
	Search,
} from '@/components/icons'

export type HealthData = {
	uptime: number
	services: { database: string; redis: string }
	timestamp: string
	responseTime: string
	status: 'ok' | 'degraded'
}

export type MetricsStats = {
	totalRequests: number
	avgDurationMs: number
	minDurationMs: number
	maxDurationMs: number
	statusBreakdown: {
		'2xx': number
		'3xx': number
		'4xx': number
		'5xx': number
	}
	topEndpoints: Array<{
		endpoint: string
		method: string
		count: number
		avgDuration: number
	}>
}

export type ApiMetricItem = {
	id: string
	ip: string
	method: string
	status: number
	duration: number
	endpoint: string
	requestId: string
	userAgent: string
	createdAt: string
}

export const ApiMetricsClientView = () => {
	const [health, setHealth] = useState<HealthData | null>(null)
	const [stats, setStats] = useState<MetricsStats | null>(null)
	const [metrics, setMetrics] = useState<ApiMetricItem[]>([])
	const [loading, setLoading] = useState(true)
	const [autoRefresh, setAutoRefresh] = useState(false)

	// Filter state
	const [search, setSearch] = useState('')
	const [methodFilter, setMethodFilter] = useState('ALL')
	const [totalMetrics, setTotalMetrics] = useState(0)

	const loadData = useCallback(async () => {
		setLoading(true)
		try {
			const healthRes = await adminFetch<HealthData>('/api/v1/health')
			if (healthRes.data) setHealth(healthRes.data)

			const statsRes = await adminFetch<MetricsStats>('/api/v1/api-metrics/stats')
			if (statsRes.data) setStats(statsRes.data)

			const query = new URLSearchParams({
				limit: '100',
			})
			if (search) query.set('search', search)
			if (methodFilter !== 'ALL') query.set('method', methodFilter)

			const metricsRes = await adminFetch<ApiMetricItem[]>(
				`/api/v1/api-metrics?${query.toString()}`,
			)
			if (metricsRes.data) {
				setMetrics(metricsRes.data)
				setTotalMetrics(metricsRes.count || metricsRes.data.length)
			}
		} catch (err) {
			console.error('Failed to load telemetry data:', err)
		} finally {
			setLoading(false)
		}
	}, [search, methodFilter])

	useEffect(() => {
		loadData()
	}, [loadData])

	useEffect(() => {
		if (!autoRefresh) return
		const interval = setInterval(() => {
			loadData()
		}, 10000)
		return () => clearInterval(interval)
	}, [autoRefresh, loadData])

	const formatUptime = (seconds: number) => {
		const days = Math.floor(seconds / 86400)
		const hrs = Math.floor((seconds % 86400) / 3600)
		const mins = Math.floor((seconds % 3600) / 60)
		if (days > 0) return `${days}d ${hrs}h ${mins}m`
		if (hrs > 0) return `${hrs}h ${mins}m`
		return `${mins}m ${Math.floor(seconds % 60)}s`
	}

	const getMethodBadge = (method: string) => {
		switch (method.toUpperCase()) {
			case 'GET':
				return <Badge variant='success'>GET</Badge>
			case 'POST':
				return <Badge variant='signal'>POST</Badge>
			case 'PATCH':
			case 'PUT':
				return <Badge variant='warning'>{method.toUpperCase()}</Badge>
			case 'DELETE':
				return <Badge variant='destructive'>DELETE</Badge>
			default:
				return <Badge variant='outline'>{method}</Badge>
		}
	}

	const getStatusBadge = (status: number) => {
		if (status >= 200 && status < 300) {
			return (
				<span className='inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500'>
					{status}
				</span>
			)
		}
		if (status >= 300 && status < 400) {
			return (
				<span className='inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-500'>
					{status}
				</span>
			)
		}
		if (status >= 400 && status < 500) {
			return (
				<span className='inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500'>
					{status}
				</span>
			)
		}
		return (
			<span className='inline-flex items-center rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-500'>
				{status}
			</span>
		)
	}

	const getDurationBadge = (ms: number) => {
		if (ms < 100) return <span className='font-mono text-emerald-500'>{ms}ms</span>
		if (ms < 500) return <span className='font-mono text-amber-500'>{ms}ms</span>
		return <span className='font-mono text-red-500 font-bold'>{ms}ms</span>
	}

	const columns = useMemo<ColumnDef<ApiMetricItem>[]>(
		() => [
			{
				accessorKey: 'method',
				header: 'Method',
				cell: ({ row }) => getMethodBadge(row.original.method),
			},
			{
				accessorKey: 'endpoint',
				header: 'Endpoint',
				cell: ({ row }) => (
					<span className='font-mono text-xs font-medium text-foreground max-w-sm truncate block'>
						{row.original.endpoint}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => getStatusBadge(row.original.status),
			},
			{
				accessorKey: 'duration',
				header: 'Duration',
				cell: ({ row }) => getDurationBadge(row.original.duration),
			},
			{
				accessorKey: 'ip',
				header: 'Client IP',
				cell: ({ row }) => (
					<span className='font-mono text-xs text-muted-foreground'>{row.original.ip}</span>
				),
			},
			{
				accessorKey: 'requestId',
				header: 'Request ID',
				cell: ({ row }) => (
					<span className='font-mono text-xs text-muted-foreground truncate block max-w-[120px]'>
						{row.original.requestId}
					</span>
				),
			},
			{
				accessorKey: 'createdAt',
				header: () => <div className='text-right'>Timestamp</div>,
				cell: ({ row }) => (
					<div className='text-right font-mono text-xs text-muted-foreground'>
						{new Date(row.original.createdAt).toLocaleTimeString()}
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
						API Telemetry & Health
					</h1>
					<p className='text-sm text-muted-foreground'>
						Inspect live HTTP telemetry, subsystem connectivity, request volumes, and latency profiles.
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => setAutoRefresh(!autoRefresh)}
						className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
							autoRefresh
								? 'border-signal-ink bg-signal-ink/10 text-signal-ink'
								: 'border-border bg-surface text-muted-foreground hover:text-foreground'
						}`}>
						<span
							className={`h-2 w-2 rounded-full ${
								autoRefresh ? 'bg-signal-ink animate-ping' : 'bg-muted-foreground'
							}`}
						/>
						{autoRefresh ? 'Live Polling (10s)' : 'Auto-refresh Off'}
					</button>
					<Button variant='outline' size='sm' onClick={loadData} disabled={loading}>
						<RefreshCw className={`size-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
				</div>
			</div>

			{/* Health Ribbon */}
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<div className='flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-xs'>
					<div
						className={`flex size-11 items-center justify-center rounded-xl ${
							health?.status === 'ok'
								? 'bg-emerald-500/10 text-emerald-500'
								: 'bg-amber-500/10 text-amber-500'
						}`}>
						<Server className='size-5' />
					</div>
					<div>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							NestJS Server
						</p>
						<p className='mt-0.5 text-lg font-bold text-foreground capitalize'>
							{health?.status === 'ok' ? 'Operational' : 'Degraded'}
						</p>
						<p className='text-[11px] text-muted-foreground'>
							Latency: {health?.responseTime || '...'}
						</p>
					</div>
				</div>

				<div className='flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-xs'>
					<div
						className={`flex size-11 items-center justify-center rounded-xl ${
							health?.services?.database === 'up'
								? 'bg-emerald-500/10 text-emerald-500'
								: 'bg-red-500/10 text-red-500'
						}`}>
						<Database className='size-5' />
					</div>
					<div>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							PostgreSQL 17
						</p>
						<p className='mt-0.5 text-lg font-bold text-foreground uppercase'>
							{health?.services?.database || 'CHECKING'}
						</p>
						<p className='text-[11px] text-muted-foreground'>Prisma 7 Probe</p>
					</div>
				</div>

				<div className='flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-xs'>
					<div
						className={`flex size-11 items-center justify-center rounded-xl ${
							health?.services?.redis === 'up'
								? 'bg-emerald-500/10 text-emerald-500'
								: 'bg-red-500/10 text-red-500'
						}`}>
						<Radio className='size-5' />
					</div>
					<div>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							Redis Cache
						</p>
						<p className='mt-0.5 text-lg font-bold text-foreground uppercase'>
							{health?.services?.redis || 'CHECKING'}
						</p>
						<p className='text-[11px] text-muted-foreground'>PING-PONG Cluster</p>
					</div>
				</div>

				<div className='flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-xs'>
					<div className='flex size-11 items-center justify-center rounded-xl bg-signal-ink/10 text-signal-ink'>
						<Clock className='size-5' />
					</div>
					<div>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							System Uptime
						</p>
						<p className='mt-0.5 text-lg font-bold text-foreground'>
							{health?.uptime ? formatUptime(health.uptime) : 'Online'}
						</p>
						<p className='text-[11px] text-muted-foreground'>Continuous Process</p>
					</div>
				</div>
			</div>

			{/* Telemetry Stats */}
			{stats && (
				<div className='grid grid-cols-2 gap-4 sm:grid-cols-5'>
					<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							Total Invocations
						</p>
						<p className='font-display text-3xl font-bold text-foreground'>{stats.totalRequests}</p>
					</div>
					<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							Average Latency
						</p>
						<p className='font-display text-3xl font-bold text-signal-ink'>
							{stats.avgDurationMs}
							<span className='text-sm font-normal text-muted-foreground ml-1'>ms</span>
						</p>
					</div>
					<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							2xx Successes
						</p>
						<p className='font-display text-3xl font-bold text-emerald-500'>
							{stats.statusBreakdown['2xx']}
						</p>
					</div>
					<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							4xx Client Errors
						</p>
						<p className='font-display text-3xl font-bold text-amber-500'>
							{stats.statusBreakdown['4xx']}
						</p>
					</div>
					<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							5xx Server Errors
						</p>
						<p className='font-display text-3xl font-bold text-destructive'>{stats.statusBreakdown['5xx']}</p>
					</div>
				</div>
			)}

			{/* Filter Toolbar */}
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-surface/60 p-3'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='size-4 text-muted-foreground absolute left-3 top-2.5' />
					<Input
						placeholder='Search telemetry by endpoint path, IP address, or request ID…'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='pl-9 h-9'
					/>
				</div>
				<div className='flex flex-wrap items-center gap-2 font-mono text-xs'>
					<div className='flex items-center gap-1.5 overflow-x-auto'>
						{(['ALL', 'GET', 'POST', 'PATCH', 'DELETE'] as const).map(m => (
							<button
								key={m}
								type='button'
								onClick={() => setMethodFilter(m)}
								className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
									methodFilter === m
										? 'bg-primary text-primary-foreground font-semibold shadow-xs'
										: 'text-muted-foreground hover:bg-accent hover:text-foreground'
								}`}>
								{m}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={metrics}
				loading={loading}
				totalCount={totalMetrics}
				pageSize={25}
				disableDateRange
				disableSearch
			/>
		</div>
	)
}
