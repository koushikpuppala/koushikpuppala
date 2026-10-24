'use client'

import type { ApiMetricItem, HealthStatusData, MetricsStats } from 'types/api'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { DataTableColumnDef, DataTableFilters } from 'types/components'
import { DataTable } from 'ui/designs/data-table'
import { Badge } from 'components/ui/badge'
import { Server, Database, Radio, Clock } from 'components/icons'
import { apiMetricsActions } from 'actions/api-metrics'
import { useLatestRequest } from 'lib/use-server-list'
import { toPageQuery } from 'lib/list-query'
import { ApiMetricsSkeleton } from 'components/skeletons'
import { ServiceTile } from './service-tile'
import { AutoRefreshToggle } from './auto-refresh-toggle'
import { CountCard } from 'components/cms/count-card'
import { PageHeader } from 'components/cms/page-header'
import { ErrorBanner } from 'components/ui/error-banner'
import { RefreshButton } from 'components/cms/refresh-button'

const PAGE_SIZE = 25

const METRIC_FILTERS = ['search', 'method', 'from', 'to'] as const

export const ApiMetricsView = () => {
	const searchParams = useSearchParams()
	const nextSignal = useLatestRequest()
	const [health, setHealth] = useState<HealthStatusData | null>(null)
	const [stats, setStats] = useState<MetricsStats | null>(null)
	const [metrics, setMetrics] = useState<ApiMetricItem[]>([])
	const [loading, setLoading] = useState(true)
	const [autoRefresh, setAutoRefresh] = useState(false)

	const [totalMetrics, setTotalMetrics] = useState(0)
	const [error, setError] = useState<string | null>(null)

	const metricFilters: DataTableFilters[] = [
		{
			id: 'method',
			label: 'Method',
			type: 'select',
			options: [
				{ label: 'All Methods', value: '' },
				{ label: 'GET', value: 'GET' },
				{ label: 'POST', value: 'POST' },
				{ label: 'PUT', value: 'PUT' },
				{ label: 'PATCH', value: 'PATCH' },
				{ label: 'DELETE', value: 'DELETE' },
			],
		},
	]

	const loadData = useCallback(async () => {
		const signal = nextSignal()

		setLoading(true)
		setError(null)
		try {
			const [healthRes, statsRes, metricsRes] = await Promise.all([
				apiMetricsActions.health<HealthStatusData>(signal),
				apiMetricsActions.stats<MetricsStats>(signal),
				apiMetricsActions.list<ApiMetricItem>(
					toPageQuery(searchParams, METRIC_FILTERS, PAGE_SIZE),
					signal,
				),
			])
			if (signal.aborted) return

			if (healthRes.data) setHealth(healthRes.data)
			if (statsRes.data) setStats(statsRes.data)
			if (metricsRes.data) {
				setMetrics(metricsRes.data)
				setTotalMetrics(metricsRes.count || metricsRes.data.length)
			}
		} catch (err) {
			console.error('Failed to load telemetry data:', err)
			setError('Failed to load telemetry metrics from server.')
		} finally {
			if (!signal.aborted) setLoading(false)
		}
	}, [searchParams, nextSignal])

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
		return <span className='font-mono font-bold text-red-500'>{ms}ms</span>
	}

	const columns = useMemo<DataTableColumnDef<ApiMetricItem>[]>(
		() => [
			{
				accessorKey: 'method',
				enableSorting: true,
				header: 'Method',
				cell: ({ row }) => getMethodBadge(row.original.method),
			},
			{
				accessorKey: 'endpoint',
				enableSorting: true,
				header: 'Endpoint',
				cell: ({ row }) => (
					<span className='text-foreground block max-w-sm truncate font-mono text-xs font-medium'>
						{row.original.endpoint}
					</span>
				),
			},
			{
				accessorKey: 'status',
				enableSorting: true,
				header: 'Status',
				cell: ({ row }) => getStatusBadge(row.original.status),
			},
			{
				accessorKey: 'duration',
				enableSorting: true,
				header: 'Duration',
				cell: ({ row }) => getDurationBadge(row.original.duration),
			},
			{
				accessorKey: 'ip',
				header: 'Client IP',
				cell: ({ row }) => (
					<span className='text-muted-foreground font-mono text-xs'>{row.original.ip}</span>
				),
			},
			{
				accessorKey: 'requestId',
				header: 'Request ID',
				cell: ({ row }) => (
					<span className='text-muted-foreground block max-w-30 truncate font-mono text-xs'>
						{row.original.requestId}
					</span>
				),
			},
			{
				accessorKey: 'createdAt',
				enableSorting: true,
				header: 'Timestamp',
				cell: ({ row }) => (
					<div className='text-muted-foreground text-right font-mono text-xs'>
						{new Date(row.original.createdAt).toLocaleTimeString()}
					</div>
				),
			},
		],
		[],
	)

	if (loading && !health && !stats) return <ApiMetricsSkeleton />

	return (
		<div className='space-y-6'>
			<PageHeader
				title='API Telemetry & Health'
				description='Inspect live HTTP telemetry, subsystem connectivity, request volumes, and latency profiles.'>
				<AutoRefreshToggle active={autoRefresh} onToggle={() => setAutoRefresh(!autoRefresh)} />
				<RefreshButton loading={loading} onClick={loadData} />
			</PageHeader>

			{error && <ErrorBanner message={error} onRetry={loadData} />}

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<ServiceTile
					icon={<Server className='size-5' />}
					label='NestJS Server'
					value={health?.status === 'ok' ? 'Operational' : 'Degraded'}
					detail={`Latency: ${health?.responseTime || '...'}`}
					tone={health?.status === 'ok' ? 'ok' : 'warn'}
					valueClassName='capitalize'
				/>
				<ServiceTile
					icon={<Database className='size-5' />}
					label='PostgreSQL 17'
					value={health?.services?.database || 'CHECKING'}
					detail='Prisma 7 Probe'
					tone={health?.services?.database === 'up' ? 'ok' : 'down'}
					valueClassName='uppercase'
				/>
				<ServiceTile
					icon={<Radio className='size-5' />}
					label='Redis Cache'
					value={health?.services?.redis || 'CHECKING'}
					detail='PING-PONG Cluster'
					tone={health?.services?.redis === 'up' ? 'ok' : 'down'}
					valueClassName='uppercase'
				/>
				<ServiceTile
					icon={<Clock className='size-5' />}
					label='System Uptime'
					value={health?.uptime ? formatUptime(health.uptime) : 'Online'}
					detail='Continuous Process'
					tone='info'
				/>
			</div>

			{stats && (
				<div className='grid grid-cols-2 gap-4 sm:grid-cols-5'>
					<CountCard label='Total Invocations' value={stats.totalRequests} loaded />
					<CountCard
						label='Average Latency'
						value={
							<>
								{stats.avgDurationMs}
								<span className='text-muted-foreground ml-1 text-sm font-normal'>ms</span>
							</>
						}
						loaded
						valueClassName='text-signal-ink'
					/>
					<CountCard
						label='2xx Successes'
						value={stats.statusBreakdown['2xx']}
						loaded
						valueClassName='text-emerald-500'
					/>
					<CountCard
						label='4xx Client Errors'
						value={stats.statusBreakdown['4xx']}
						loaded
						valueClassName='text-amber-500'
					/>
					<CountCard
						label='5xx Server Errors'
						value={stats.statusBreakdown['5xx']}
						loaded
						valueClassName='text-destructive'
					/>
				</div>
			)}

			<DataTable
				columns={columns}
				data={metrics}
				loading={loading}
				totalCount={totalMetrics}
				pageSize={PAGE_SIZE}
				manualSorting={false}
				filters={metricFilters}
			/>
		</div>
	)
}
