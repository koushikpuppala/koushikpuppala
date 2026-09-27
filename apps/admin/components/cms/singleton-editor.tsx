'use client'

import type { ReactNode } from 'react'
import { RefreshCw, Save, ShieldCheck } from '@/components/icons'
import { Button } from '@/components/ui/button'

type SingletonEditorProps = {
	title: string
	description?: string
	isDirty?: boolean
	loading?: boolean
	saving?: boolean
	error?: string | null
	onRetry?: () => void
	onSave: () => void | Promise<void>
	onDiscard?: () => void
	children: ReactNode
}

export function SingletonEditor({
	title,
	description,
	isDirty = false,
	loading = false,
	saving = false,
	error = null,
	onRetry,
	onSave,
	onDiscard,
	children,
}: SingletonEditorProps) {
	return (
		<div className='w-full space-y-6'>
			{/* Header bar */}
			<div className='border-border relative flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='font-display text-foreground text-2xl font-bold tracking-tight'>
						{title}
					</h1>
					{description && <p className='text-muted-foreground mt-1 text-sm'>{description}</p>}
				</div>

				<div className='flex items-center gap-2.5'>
					{onDiscard && (
						<Button
							type='button'
							variant='outline'
							onClick={onDiscard}
							disabled={!isDirty || saving}>
							Discard
						</Button>
					)}
					<Button type='button' variant='signal' onClick={onSave} disabled={saving || loading}>
						{saving ? (
							<>
								<RefreshCw className='size-4 animate-spin' />
								<span>Saving…</span>
							</>
						) : (
							<>
								<Save className='size-4' />
								<span>Save Changes</span>
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Error State Banner */}
			{error && !loading && (
				<div className='flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-mono text-destructive'>
					<div className='flex items-center gap-2'>
						<span className='font-semibold'>API Error:</span>
						<span>{error}</span>
					</div>
					{onRetry && (
						<Button type='button' variant='outline' size='sm' onClick={onRetry} className='h-7 text-xs'>
							<RefreshCw className='size-3 mr-1' />
							<span>Retry</span>
						</Button>
					)}
				</div>
			)}

			{/* Form Container */}
			<div className='border-border bg-surface space-y-6 rounded-2xl border p-6 shadow-2xs sm:p-8'>
				{loading ? (
					<div className='text-muted-foreground py-20 text-center font-mono text-sm'>
						<div className='flex items-center justify-center gap-2'>
							<RefreshCw className='text-signal-ink size-4 animate-spin' />
							<span>Loading published record…</span>
						</div>
					</div>
				) : (
					children
				)}
			</div>

			{/* Security / Audit Notice */}
			<div className='text-muted-foreground flex items-center gap-2 px-1 font-mono text-xs'>
				<ShieldCheck className='text-signal-ink size-3.5 shrink-0' />
				<span>
					All mutations are verified by NestJS API and persisted to PostgreSQL audit trail.
				</span>
			</div>
		</div>
	)
}
