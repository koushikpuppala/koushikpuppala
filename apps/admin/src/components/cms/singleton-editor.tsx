'use client'

import type {
	EditorErrorProps,
	PublishButtonProps,
	SaveButtonProps,
	SingletonEditorProps,
} from 'types/components/admin'
import { EyeOff, Globe, RefreshCw, Save, ShieldCheck } from 'components/icons'
import { Button } from 'ui/button'
import { Badge } from 'components/ui/badge'
import { LoadingRegion } from 'ui/skeleton'
import { FormFieldsSkeleton } from 'components/skeletons'

const PublishButton = ({
	isPublished,
	publishing,
	isDirty,
	disabled,
	onClick,
}: PublishButtonProps) => {
	const Icon = publishing ? RefreshCw : isPublished ? EyeOff : Globe

	return (
		<Button
			type='button'
			variant='outline'
			onClick={onClick}
			disabled={disabled}
			title={isDirty ? 'Save your changes before publishing' : undefined}>
			<Icon className={publishing ? 'size-4 animate-spin' : 'size-4'} />
			<span>{isPublished ? 'Unpublish' : 'Publish'}</span>
		</Button>
	)
}

const SaveButton = ({ saving, disabled, onClick }: SaveButtonProps) => (
	<Button type='button' variant='signal' onClick={onClick} disabled={disabled}>
		{saving ? <RefreshCw className='size-4 animate-spin' /> : <Save className='size-4' />}
		<span>{saving ? 'Saving…' : 'Save Changes'}</span>
	</Button>
)

const EditorError = ({ error, onRetry }: EditorErrorProps) => (
	<div className='border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border p-4 font-mono text-xs'>
		<div className='flex items-center gap-2'>
			<span className='font-semibold'>API Error:</span>
			<span>{error}</span>
		</div>
		{onRetry && (
			<Button type='button' variant='outline' size='sm' onClick={onRetry} className='h-7 text-xs'>
				<RefreshCw className='mr-1 size-3' />
				<span>Retry</span>
			</Button>
		)}
	</div>
)

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
						<PublishButton
							isPublished={isPublished}
							publishing={publishing}
							isDirty={isDirty}
							disabled={!canPublish || isDirty || loading || saving || publishing}
							onClick={onTogglePublish}
						/>
					)}
					<SaveButton saving={saving} disabled={!isDirty || saving || loading} onClick={onSave} />
				</div>
			</div>

			{error && !loading && <EditorError error={error} onRetry={onRetry} />}

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
