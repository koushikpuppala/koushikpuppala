import type { HealthPanelProps, HealthRowProps } from 'types/components/admin'
import Link from 'next/link'
import { classNames } from 'utils/classNames'
import { Activity, ArrowUpRight, Database, Gauge, Server } from 'components/icons'

const HealthRow = ({ icon, label, state, detail, last = false }: HealthRowProps) => (
	<div
		className={classNames(
			'flex items-center justify-between py-1.5',
			!last && 'border-border/50 border-b',
		)}>
		<span className='text-muted-foreground flex items-center gap-2'>
			{icon}
			<span>{label}</span>
		</span>
		<span
			className={classNames(
				'font-semibold',
				state === null ? 'text-muted-foreground' : state ? 'text-success' : 'text-destructive',
			)}>
			{state === null ? 'Checking…' : state ? `Up${detail ? ` · ${detail}` : ''}` : 'Down'}
		</span>
	</div>
)

export const HealthPanel = ({ health }: HealthPanelProps) => {
	const check = (up: (data: Exclude<typeof health, false | null>) => boolean) =>
		health === null ? null : health ? up(health) : false

	return (
		<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs'>
			<div className='border-border flex items-center justify-between border-b pb-3'>
				<div className='flex items-center gap-2'>
					<Gauge className='text-signal-ink size-4' />
					<h2 className='font-display text-foreground text-base font-semibold'>
						System Infrastructure
					</h2>
				</div>
				<span
					className={classNames(
						'size-2 rounded-full',
						health === null
							? 'bg-muted-foreground'
							: health && health.status === 'ok'
								? 'bg-success animate-pulse'
								: 'bg-destructive',
					)}
					aria-hidden
				/>
			</div>

			<div className='space-y-3 font-mono text-xs'>
				<HealthRow
					icon={<Server className='size-3.5' />}
					label='API'
					state={check(data => data.status === 'ok')}
					detail={health ? health.responseTime : undefined}
				/>
				<HealthRow
					icon={<Database className='size-3.5' />}
					label='PostgreSQL'
					state={check(data => data.services.database === 'up')}
				/>
				<HealthRow
					icon={<Activity className='size-3.5' />}
					label='Redis cache'
					state={check(data => data.services.redis === 'up')}
					last
				/>
			</div>
			<Link
				href='/api-metrics'
				className='text-signal-ink inline-flex items-center gap-1 font-mono text-[0.6875rem] hover:underline'>
				API telemetry <ArrowUpRight className='size-3' />
			</Link>
		</div>
	)
}
