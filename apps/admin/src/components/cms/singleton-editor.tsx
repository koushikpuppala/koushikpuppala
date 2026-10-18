'use client'

import type { SingletonEditorProps } from 'types/components/admin'
import { EyeOff, Globe, RefreshCw, Save, ShieldCheck } from 'components/icons'
import { Button } from 'ui/button'
import { Badge } from 'components/ui/badge'
import { LoadingRegion } from 'ui/skeleton'
import { FormFieldsSkeleton } from 'components/skeletons'

export const SingletonEditor = ({
	title,
	description,
	isDirty = false,
	loading = false,
	skeleton,
	saving = false,
	error = null,
	onRetry,
	onSave,
	onDiscard,
	isPublished = false,
	onTogglePublish,
	publishing = false,
	canPublish = true,
	children,
}: SingletonEditorProps) => {
	return (
		<div className='w-full space-y-6'>
			<div className='border-border relative flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<div className='flex items-center gap-3'>
						<h1 className='font-display text-foreground text-2xl font-bold tracking-tight'>
							{title}
						</h1>
						{onTogglePublish && !loading && canPublish && (
							<Badge variant={isPublished ? 'success' : 'outline'}>
								{isPublished ? 'Published' : 'Draft'}
							</Badge>
						)}
					</div>
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
					{onTogglePublish && (
						<Button
							type='button'
							variant='outline'
							onClick={onTogglePublish}
							disabled={!canPublish || isDirty || loading || saving || publishing}
							title={isDirty ? 'Save your changes before publishing' : undefined}>
							{publishing ? (
								<RefreshCw className='size-4 animate-spin' />
							) : isPublished ? (
								<EyeOff className='size-4' />
							) : (
								<Globe className='size-4' />
							)}
							<span>{isPublished ? 'Unpublish' : 'Publish'}</span>
						</Button>
					)}
					<Button
						type='button'
						variant='signal'
						onClick={onSave}
						disabled={!isDirty || saving || loading}>
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

			{error && !loading && (
				<div className='border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border p-4 font-mono text-xs'>
					<div className='flex items-center gap-2'>
						<span className='font-semibold'>API Error:</span>
						<span>{error}</span>
					</div>
					{onRetry && (
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={onRetry}
							className='h-7 text-xs'>
							<RefreshCw className='mr-1 size-3' />
							<span>Retry</span>
						</Button>
					)}
				</div>
			)}

			<div className='border-border bg-surface space-y-6 rounded-2xl border p-6 shadow-2xs sm:p-8'>
				{loading ? (
					<LoadingRegion label={title}>
						{skeleton ?? <FormFieldsSkeleton rows={[2, 'tall', 2]} />}
					</LoadingRegion>
				) : (
					children
				)}
			</div>

			<div className='text-muted-foreground flex items-center gap-2 px-1 font-mono text-xs'>
				<ShieldCheck className='text-signal-ink size-3.5 shrink-0' />
				<span>
					All mutations are verified by NestJS API and persisted to PostgreSQL audit trail.
				</span>
			</div>
		</div>
	)
}
