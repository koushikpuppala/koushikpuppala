import type { HealthPanelProps, HealthRowProps, HealthRowsProps } from 'types/components/admin'
import Link from 'next/link'
import { classNames } from 'utils/classNames'
import { Activity, ArrowUpRight, Database, Gauge, Server } from 'components/icons'
import { DashboardPanel } from 'components/dashboard/dashboard-panel'

const HealthRow = ({ icon, label, state, detail }: HealthRowProps) => (
	<div className='min-h-row flex items-center justify-between'>
		<span className='text-body text-muted-foreground flex items-center gap-2'>
			{icon}
			{label}
		</span>
		<span
			className={classNames(
				'text-body font-medium',
				state === null
					? 'text-muted-foreground'
					: state
						? 'text-success-ink'
						: 'text-destructive-ink',
			)}>
			{state === null ? 'Checking…' : state ? `Up${detail ? ` · ${detail}` : ''}` : 'Down'}
		</span>
	</div>
)

const HealthRows = ({ api, database, redis, apiDetail }: HealthRowsProps) => (
	<div className='divide-border divide-y'>
		<HealthRow
			icon={<Server aria-hidden className='size-4' />}
			label='API'
			state={api}
			detail={apiDetail}
		/>
		<HealthRow
			icon={<Database aria-hidden className='size-4' />}
			label='PostgreSQL'
			state={database}
		/>
		<HealthRow
			icon={<Activity aria-hidden className='size-4' />}
			label='Redis cache'
			state={redis}
		/>
	</div>
)

export const HealthPanel = ({ block }: HealthPanelProps) => {
	const snapshot = block.data
	const healthy = snapshot?.health.status === 'ok'

	return (
		<DashboardPanel
			title='System infrastructure'
			icon={<Gauge aria-hidden className='size-4' />}
			action={
				<span
					role='img'
					aria-label={snapshot ? (healthy ? 'All systems up' : 'Degraded') : 'Checking'}
					className={classNames(
						'size-2 rounded-full',
						!snapshot ? 'bg-muted-foreground' : healthy ? 'bg-success' : 'bg-destructive',
					)}
				/>
			}
			footer={
				<div className='flex items-center justify-between gap-3'>
					<Link
						href='/api-metrics'
						className='text-signal-ink text-small h-control-md focus-ring:outline-2 focus-ring:outline-offset-2 focus-ring:outline-signal-ink inline-flex items-center gap-1 hover:underline'>
						API telemetry <ArrowUpRight aria-hidden className='size-3' />
					</Link>
					{snapshot && (
						<span className='text-caption text-muted-foreground'>
							Checked at{' '}
							{snapshot.checkedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
						</span>
					)}
				</div>
			}
			status={block.status}
			refreshing={block.refreshing}
			errorLabel='Health check unreachable'
			onRetry={block.reload}
			skeleton={<HealthRows api={null} database={null} redis={null} />}>
			{snapshot && (
				<HealthRows
					api
					apiDetail={snapshot.health.responseTime}
					database={snapshot.health.services.database === 'up'}
					redis={snapshot.health.services.redis === 'up'}
				/>
			)}
		</DashboardPanel>
	)
}
