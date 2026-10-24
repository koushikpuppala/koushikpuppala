import type { SettingsHeaderProps } from 'types/components/admin'
import { Button } from 'ui/button'
import { classNames } from 'utils/classNames'
import { CheckCircle2, RefreshCw, Save } from 'components/icons'

export const SettingsHeader = ({ saved, saving, refreshing, onRefresh }: SettingsHeaderProps) => (
	<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
		<div>
			<h1 className='font-display text-foreground text-2xl font-bold tracking-tight'>
				Site Settings & SEO Engine
			</h1>
			<p className='text-muted-foreground text-sm'>
				Configure global search engine metadata, OpenGraph social cards, canonical routing, and web
				indexation.
			</p>
		</div>
		<div className='flex items-center gap-3'>
			{saved && (
				<span className='flex items-center gap-1.5 text-xs font-medium text-emerald-500'>
					<CheckCircle2 className='size-4' />
					Settings updated successfully
				</span>
			)}
			<Button
				type='button'
				variant='outline'
				size='sm'
				onClick={onRefresh}
				disabled={refreshing || saving}>
				<RefreshCw className={classNames('mr-1.5 size-4', refreshing && 'animate-spin')} />
				Refresh
			</Button>
			<Button type='submit' variant='signal' size='sm' disabled={saving}>
				<Save className='mr-1.5 size-4' />
				{saving ? 'Saving...' : 'Save Changes'}
			</Button>
		</div>
	</div>
)
