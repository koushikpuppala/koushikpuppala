'use client'

import type { MediaAsset } from 'types/models'
import type { MediaPickerModalProps } from 'types/components/admin'
import { useState, type ChangeEvent } from 'react'
import { Check, Image as ImageIcon, RefreshCw, Search, Upload } from 'components/icons'
import { Button } from 'ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from 'components/ui/dialog'
import { Input } from 'ui/input'
import { uploadMediaToS3 } from 'lib/api-client'
import { useMediaLibrary } from 'lib/use-media-library'
import { classNames } from 'utils/classNames'

export const MediaPickerModal = ({
	open,
	onOpenChange,
	onSelect,
	title = 'Select Media Asset',
}: MediaPickerModalProps) => {
	const {
		items: mediaList,
		search,
		setSearch,
		loading,
		loadingMore,
		error,
		setError,
		hasMore,
		loadMore,
		prepend,
	} = useMediaLibrary<MediaAsset>({ enabled: open, type: 'IMAGE' })
	const [uploading, setUploading] = useState(false)
	const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)

	const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setUploading(true)
		setError(null)
		try {
			const uploaded = await uploadMediaToS3(file)
			const newItem: MediaAsset = {
				id: uploaded.id,
				url: uploaded.url,
				fileName: uploaded.fileName,
				originalName: file.name,
			}
			prepend(newItem)
			setSelectedMedia(newItem)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed.')
		} finally {
			setUploading(false)
		}
	}

	const handleConfirm = () => {
		if (selectedMedia) {
			onSelect({
				id: selectedMedia.id,
				url: selectedMedia.url,
				fileName: selectedMedia.fileName,
				altText: selectedMedia.altText ?? undefined,
			})
			onOpenChange(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className='flex max-h-[85vh] max-w-3xl flex-col p-6'
				onClose={() => onOpenChange(false)}>
				<DialogHeader>
					<div className='flex items-center justify-between'>
						<div>
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription>
								Pick an existing asset from the S3 media library or upload directly.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className='my-2 flex items-center gap-3'>
					<div className='relative flex-1'>
						<Search className='text-muted-foreground absolute top-2.5 left-3 size-4' />
						<Input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder='Search media assets by filename…'
							className='pl-9'
						/>
					</div>
					<label className='cursor-pointer'>
						<input
							type='file'
							accept='image/*,application/pdf'
							className='hidden'
							onChange={handleFileUpload}
							disabled={uploading}
						/>
						<Button type='button' variant='signal' disabled={uploading} asChild>
							<span>
								{uploading ? (
									<>
										<RefreshCw className='size-4 animate-spin' />
										<span>Uploading…</span>
									</>
								) : (
									<>
										<Upload className='size-4' />
										<span>Upload Asset</span>
									</>
								)}
							</span>
						</Button>
					</label>
				</div>

				{error && (
					<p className='text-destructive bg-destructive/10 my-1 rounded-lg p-2.5 text-xs'>
						{error}
					</p>
				)}

				<div className='border-border my-2 max-h-100 min-h-65 flex-1 overflow-y-auto rounded-xl border p-3'>
					{loading ? (
						<div className='text-muted-foreground grid size-full place-items-center py-12 font-mono text-sm'>
							<div className='flex items-center gap-2'>
								<RefreshCw className='text-signal-ink size-4 animate-spin' />
								<span>Loading S3 media catalog…</span>
							</div>
						</div>
					) : mediaList.length === 0 ? (
						<div className='text-muted-foreground grid size-full place-items-center py-12 text-center text-sm'>
							<div className='space-y-2'>
								<ImageIcon className='mx-auto size-8 opacity-40' />
								<p>No media files found matching your search.</p>
							</div>
						</div>
					) : (
						<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
							{mediaList.map(media => {
								const isSelected = media.id === selectedMedia?.id
								return (
									<button
										key={media.id}
										type='button'
										onClick={() => setSelectedMedia(media)}
										className={classNames(
											'group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border p-2 text-left transition-all',
											isSelected
												? 'border-signal bg-signal/10 ring-signal ring-2'
												: 'border-border bg-surface hover:border-border-strong hover:bg-accent',
										)}>
										<div className='bg-surface-strong relative grid aspect-video w-full place-items-center overflow-hidden rounded-lg'>
											<ImageIcon className='text-muted-foreground/30 absolute size-5' />
											<img
												src={media.url}
												alt={media.altText || media.originalName || media.fileName}
												className='relative size-full object-cover'
												onError={e => {
													;(e.target as HTMLElement).style.display = 'none'
												}}
											/>
											{isSelected && (
												<div className='bg-signal absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full text-white shadow-sm'>
													<Check className='size-3 stroke-3' />
												</div>
											)}
										</div>
										<p className='text-foreground mt-2 w-full truncate font-mono text-[0.6875rem]'>
											{media.originalName || media.fileName}
										</p>
									</button>
								)
							})}
						</div>
					)}

					{hasMore && !loading && (
						<div className='mt-3 flex justify-center'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={loadMore}
								disabled={loadingMore}>
								{loadingMore && <RefreshCw className='size-4 animate-spin' />}
								<span>{loadingMore ? 'Loading…' : 'Load more'}</span>
							</Button>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button type='button' variant='signal' disabled={!selectedMedia} onClick={handleConfirm}>
						Select Asset
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
