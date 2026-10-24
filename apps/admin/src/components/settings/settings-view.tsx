'use client'

import type { MetadataRecord } from 'types/models'
import { useState } from 'react'
import { Switch } from 'components/ui/switch'
import { metadataActions } from 'actions/metadata'
import { useServerList } from 'lib/use-server-list'
import { SettingsSkeleton } from 'components/skeletons'
import { MediaPickerModal } from 'components/cms/media-picker-modal'
import { KeywordsCard } from './keywords-card'
import { MetadataTable } from './metadata-table'
import { ErrorBanner } from 'components/ui/error-banner'
import { OpenGraphCard } from './open-graph-card'
import { SettingsHeader } from './settings-header'
import { PathnamePicker } from './pathname-picker'
import { useMetadataForm } from './use-metadata-form'
import { MetadataPreviews } from './metadata-previews'
import { SearchMetadataCard } from './search-metadata-card'

const listMetadata = (query: URLSearchParams, signal: AbortSignal) =>
	metadataActions.list<MetadataRecord>(query, signal)

export const SettingsView = () => {
	const table = useServerList(listMetadata)
	const metadata = useMetadataForm(table.reload)
	const [pickingImage, setPickingImage] = useState(false)
	const { form, setField } = metadata

	if (metadata.loading && !metadata.loadedOnce) return <SettingsSkeleton />

	const loadError = metadata.fetchError ?? table.error

	return (
		<div className='space-y-8'>
			<form onSubmit={metadata.save} className='space-y-8'>
				<SettingsHeader
					saved={metadata.saved}
					saving={metadata.saving}
					refreshing={metadata.loading || table.loading}
					onRefresh={metadata.reload}
				/>

				{loadError && <ErrorBanner message={loadError} onRetry={metadata.reload} />}
				{metadata.saveError && <ErrorBanner message={metadata.saveError} />}

				<div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
					<div className='space-y-6 lg:col-span-2'>
						<PathnamePicker
							form={form}
							setField={setField}
							routeRecords={metadata.routeRecords}
							onSelect={metadata.selectPath}
						/>
						<SearchMetadataCard form={form} setField={setField} />
						<KeywordsCard form={form} setField={setField} />
						<OpenGraphCard form={form} setField={setField} onPick={() => setPickingImage(true)} />

						<div className='border-border bg-surface flex items-center justify-between rounded-2xl border p-6 shadow-xs'>
							<div>
								<h2 className='text-foreground text-sm font-semibold'>Publish Status</h2>
								<p className='text-muted-foreground mt-0.5 text-xs'>
									When active, these SEO tags are propagated to client SSR/SSG layout outputs.
								</p>
							</div>
							<Switch
								checked={form.isPublished}
								onChange={checked => setField('isPublished', checked)}
								label='Publish these SEO tags'
							/>
						</div>
					</div>

					<MetadataPreviews form={form} />
				</div>

				<MediaPickerModal
					open={pickingImage}
					onOpenChange={setPickingImage}
					onSelect={media => {
						setField('ogImage', media.url)
						setPickingImage(false)
					}}
					title='Select OpenGraph Social Banner'
				/>
			</form>

			<MetadataTable
				items={table.items}
				loading={table.loading}
				total={table.total}
				onLoad={metadata.populate}
			/>
		</div>
	)
}
