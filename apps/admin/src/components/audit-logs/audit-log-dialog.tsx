'use client'

import type { ChildrenProps } from 'types/components'
import type {
	ActionBadgeProps,
	ActionStyle,
	AuditLogDialogProps,
	ChangeListProps,
	DetailProps,
	FieldListProps,
	RecordBodyProps,
	SectionProps,
	SideProps,
	ValueProps,
} from 'types/components/admin'
import type { AuditAction } from 'types/enums'
import { Button } from 'ui/button'
import { Badge } from 'components/ui/badge'
import { classNames } from 'utils/classNames'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from 'components/ui/dialog'
import { changedFields, displayValue, recordFields } from 'components/audit-logs/audit-log-fields'

const ACTIONS: Record<AuditAction, ActionStyle> = {
	CREATE: { variant: 'success', verb: 'Created' },
	UPDATE: { variant: 'signal', verb: 'Updated' },
	DELETE: { variant: 'destructive', verb: 'Deleted' },
	PUBLISH: { variant: 'warning', verb: 'Published' },
	UNPUBLISH: { variant: 'outline', verb: 'Unpublished' },
	UPLOAD: { variant: 'secondary', verb: 'Uploaded' },
	LOGIN: { variant: 'signal', verb: 'Signed in' },
	LOGOUT: { variant: 'outline', verb: 'Signed out' },
}

export const ActionBadge = ({ action, className }: ActionBadgeProps) => (
	<Badge variant={ACTIONS[action as AuditAction]?.variant ?? 'outline'} className={className}>
		{action}
	</Badge>
)

const isSession = (action: AuditAction) => action === 'LOGIN' || action === 'LOGOUT'

const Value = ({ value }: ValueProps) => {
	const shown = displayValue(value)

	if (shown.kind === 'empty') return <span className='text-muted-foreground italic'>empty</span>
	if (shown.kind === 'json')
		return (
			<pre className='font-mono text-xs leading-relaxed break-all whitespace-pre-wrap'>
				{shown.text}
			</pre>
		)

	return (
		<span
			className={classNames('break-words whitespace-pre-wrap', shown.mono && 'font-mono text-xs')}>
			{shown.text}
		</span>
	)
}

const Side = ({ tone, value }: SideProps) => (
	<div
		className={classNames(
			'min-w-0 rounded-lg border px-3 py-2 text-sm',
			tone === 'before'
				? 'border-destructive/20 bg-destructive/5'
				: 'border-success/25 bg-success/5',
		)}>
		<span className='text-muted-foreground mb-1 block font-mono text-[10px] font-semibold tracking-wider uppercase'>
			{tone === 'before' ? 'Before' : 'After'}
		</span>
		<Value value={value} />
	</div>
)

const ChangeList = ({ rows }: ChangeListProps) => (
	<ul className='divide-border divide-y'>
		{rows.map(row => (
			<li key={row.key} className='grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[8.5rem_1fr]'>
				<span className='text-foreground pt-2 text-sm font-medium' title={row.key}>
					{row.label}
				</span>
				<div className='grid min-w-0 gap-2 sm:grid-cols-2'>
					<Side tone='before' value={row.before} />
					<Side tone='after' value={row.after} />
				</div>
			</li>
		))}
	</ul>
)

const FieldList = ({ rows, side }: FieldListProps) => (
	<dl className='divide-border divide-y'>
		{rows.map(row => (
			<div
				key={row.key}
				className='grid gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[8.5rem_1fr] sm:gap-3'>
				<dt className='text-muted-foreground text-sm' title={row.key}>
					{row.label}
				</dt>
				<dd className='text-foreground min-w-0 text-sm'>
					<Value value={row[side]} />
				</dd>
			</div>
		))}
	</dl>
)

const Section = ({ title, meta, children }: SectionProps) => (
	<section className='space-y-3'>
		<div className='flex items-baseline justify-between gap-3'>
			<h3 className='font-display text-foreground text-sm font-semibold'>{title}</h3>
			{meta && <span className='text-muted-foreground font-mono text-xs'>{meta}</span>}
		</div>
		{children}
	</section>
)

const Detail = ({ label, children }: DetailProps) => (
	<div className='min-w-0 space-y-1'>
		<dt className='text-muted-foreground font-mono text-[10px] font-semibold tracking-wider uppercase'>
			{label}
		</dt>
		<dd className='text-foreground text-sm'>{children}</dd>
	</div>
)

const Note = ({ children }: ChildrenProps) => (
	<p className='border-border text-muted-foreground rounded-xl border border-dashed px-4 py-5 text-center text-sm'>
		{children}
	</p>
)

const RecordBody = ({ log }: RecordBodyProps) => {
	const hasOld = log.oldData != null
	const hasNew = log.newData != null

	if (hasOld && hasNew) {
		const rows = changedFields(log.oldData, log.newData)

		return (
			<Section
				title='What changed'
				meta={rows.length ? `${rows.length} field${rows.length === 1 ? '' : 's'}` : undefined}>
				{rows.length ? <ChangeList rows={rows} /> : <Note>Saved with no field changes.</Note>}
			</Section>
		)
	}
	if (hasNew)
		return (
			<Section title='Created with'>
				<FieldList rows={recordFields(log.newData, 'after')} side='after' />
			</Section>
		)
	if (hasOld)
		return (
			<Section title='Record before it was removed'>
				<FieldList rows={recordFields(log.oldData, 'before')} side='before' />
			</Section>
		)

	return (
		<Note>
			{isSession(log.action)
				? 'Sign in events record who, when and from where. They carry no record data.'
				: 'This event saved no record data.'}
		</Note>
	)
}

export const AuditLogDialog = ({ log, onClose }: AuditLogDialogProps) => {
	const action = log ? ACTIONS[log.action] : undefined
	const when = log
		? new Date(log.createdAt).toLocaleString(undefined, {
				dateStyle: 'medium',
				timeStyle: 'medium',
			})
		: ''

	return (
		<Dialog open={!!log} onOpenChange={open => !open && onClose()}>
			<DialogContent className='flex max-h-[88vh] max-w-2xl flex-col p-0' onClose={onClose}>
				{log && (
					<>
						<DialogHeader className='border-border mb-0 border-b px-6 pt-6 pr-14 pb-5 text-left sm:text-left'>
							<ActionBadge action={log.action} className='self-start' />
							<DialogTitle className='pt-1'>
								{isSession(log.action)
									? action?.verb
									: `${action?.verb ?? log.action} ${log.entity}`}
							</DialogTitle>
							<DialogDescription>{`${log.actor} · ${when}`}</DialogDescription>
						</DialogHeader>

						<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
							<dl className='border-border bg-background/50 grid gap-x-6 gap-y-4 rounded-xl border p-4 sm:grid-cols-2'>
								<Detail label='Actor'>
									<span className='block font-medium'>{log.actor}</span>
									{log.actorEmail && log.actorEmail !== log.actor && (
										<span className='text-muted-foreground block truncate text-xs'>
											{log.actorEmail}
										</span>
									)}
								</Detail>
								<Detail label='Record'>
									<span className='block font-medium'>{log.entity}</span>
									<span className='text-muted-foreground block font-mono text-xs break-all'>
										{log.entityId}
									</span>
								</Detail>
								<Detail label='IP address'>
									<span className='font-mono text-xs'>{log.ipAddress || 'Internal'}</span>
								</Detail>
								<Detail label='Request ID'>
									<span className='font-mono text-xs break-all'>{log.requestId || 'None'}</span>
								</Detail>
								{log.userAgent && (
									<Detail label='Device'>
										<span className='line-clamp-2 text-xs' title={log.userAgent}>
											{log.userAgent}
										</span>
									</Detail>
								)}
							</dl>

							<RecordBody log={log} />

							{(log.oldData != null || log.newData != null) && (
								<details className='group border-border rounded-xl border'>
									<summary className='text-muted-foreground hover:text-foreground cursor-pointer rounded-xl px-4 py-3 text-sm font-medium select-none'>
										Raw record JSON
									</summary>
									<div className='border-border grid gap-4 border-t p-4'>
										{(['oldData', 'newData'] as const).map(key =>
											log[key] != null ? (
												<div key={key} className='min-w-0 space-y-1.5'>
													<span className='text-muted-foreground font-mono text-[10px] font-semibold tracking-wider uppercase'>
														{key === 'oldData' ? 'Before' : 'After'}
													</span>
													<pre className='bg-background text-foreground rounded-lg p-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap'>
														{JSON.stringify(log[key], null, 2)}
													</pre>
												</div>
											) : null,
										)}
									</div>
								</details>
							)}
						</div>

						<div className='border-border flex justify-end border-t px-6 py-4'>
							<Button variant='outline' size='sm' onClick={onClose}>
								Close
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
