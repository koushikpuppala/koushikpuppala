'use client'
import Image from 'next/image'

import { PageHeader } from 'components/cms/page-header'
import { ErrorBanner } from 'components/ui/error-banner'
import { UploadButton } from 'components/cms/upload-button'
import type { MediaAsset } from 'types/models'
import Link from 'next/link'
import { useState, type ChangeEvent } from 'react'
import {
	Check,
	Copy,
	ExternalLink,
	Image as ImageIcon,
	FileText,
	RefreshCw,
	Search,
	Trash2,
} from 'components/icons'
import { Badge } from 'components/ui/badge'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { ConfirmDialog } from 'components/cms/confirm-dialog'
import { uploadMediaToS3 } from 'lib/api-client'
import { classNames } from 'utils/classNames'
import { useMediaLibrary } from 'lib/use-media-library'
import { mediaActions } from 'actions/media'
import { LoadingRegion } from 'ui/skeleton'
import { MediaGridSkeleton } from 'components/skeletons'

const ACCEPTED_UPLOADS =
	'image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf,video/mp4,video/webm,audio/mpeg,audio/ogg'

const MEDIA_TYPE = { ALL: undefined, IMAGE: 'IMAGE', PDF: 'DOCUMENT' } as const

export const MediaView = () => {
	const [uploading, setUploading] = useState(false)
	const [filterType, setFilterType] = useState<'ALL' | 'IMAGE' | 'PDF'>('ALL')
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
		reload: loadMedia,
		prepend,
	} = useMediaLibrary<MediaAsset>({ type: MEDIA_TYPE[filterType] })
	const [deleteItem, setDeleteItem] = useState<MediaAsset | null>(null)
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)

	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setUploading(true)
		setError(null)
		try {
			const uploaded = await uploadMediaToS3(file)
			const newRecord: MediaAsset = {
				id: uploaded.id,
				fileName: uploaded.fileName,
				originalName: file.name,
				url: uploaded.url,
				storageKey: uploaded.storageKey,
				mimeType: file.type,
				size: file.size,
				createdAt: new Date().toISOString(),
			}
			prepend(newRecord)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed.')
		} finally {
			setUploading(false)
		}
	}

	const handleDeleteConfirm = async () => {
		if (!deleteItem) return
		const res = await mediaActions.remove(deleteItem.id)
		if (res.error) throw new Error(res.error)
		await loadMedia()
		if (selectedMedia?.id === deleteItem.id) setSelectedMedia(null)
		setDeleteItem(null)
	}

	const handleCopyUrl = async (media: MediaAsset) => {
		try {
			await navigator.clipboard.writeText(media.url)
			setCopiedId(media.id)
			setTimeout(() => setCopiedId(null), 2000)
		} catch {}
	}

	const formatBytes = (bytes?: number) => {
		if (!bytes) return '—'
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
		return `${(bytes / 1048576).toFixed(1)} MB`
	}

	return (
		<div className='space-y-6'>
			<PageHeader
				title='AWS S3 Media Library'
				description='Secure object storage with presigned PUT URLs, image optimization, and metadata indexing.'>
				<UploadButton
					accept={ACCEPTED_UPLOADS}
					uploading={uploading}
					onChange={handleUpload}
					label='Upload Asset'
				/>
			</PageHeader>

			{error && !loading && <ErrorBanner message={error} onRetry={loadMedia} />}

			<div className='border-border bg-surface flex flex-col justify-between gap-3 rounded-2xl border p-3 shadow-xs sm:flex-row sm:items-center'>
				<div className='relative max-w-sm flex-1'>
					<Search className='text-muted-foreground absolute top-2.5 left-3 size-4' />
					<Input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Search assets by filename or alt text…'
						className='pl-9'
					/>
				</div>

				<div className='flex items-center gap-1 font-mono text-xs'>
					{(['ALL', 'IMAGE', 'PDF'] as const).map(type => (
						<button
							key={type}
							type='button'
							onClick={() => setFilterType(type)}
							className={classNames(
								'cursor-pointer rounded-lg px-3 py-1.5 transition-colors',
								filterType === type
									? 'bg-primary text-primary-foreground font-semibold shadow-xs'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground',
							)}>
							{type === 'ALL' ? 'All Files' : type === 'IMAGE' ? 'Images' : 'PDF Documents'}
						</button>
					))}
				</div>
			</div>

			{loading ? (
				<LoadingRegion label='media library'>
					<MediaGridSkeleton />
				</LoadingRegion>
			) : mediaList.length === 0 ? (
				<div className='border-border bg-surface text-muted-foreground rounded-2xl border py-20 text-center'>
					<ImageIcon className='mx-auto mb-2 size-10 opacity-30' />
					<p className='font-sans text-sm'>No media files found matching your query.</p>
				</div>
			) : (
				<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
					{mediaList.map(media => {
						const isCopied = copiedId === media.id
						return (
							<div
								key={media.id}
								className='group border-border bg-surface hover:border-signal/50 relative flex flex-col overflow-hidden rounded-2xl border shadow-xs transition-all'>
								<div className='bg-surface-strong relative grid aspect-video w-full place-items-center overflow-hidden'>
									{media.mimeType?.startsWith('image/') ? (
										<>
											<ImageIcon className='text-muted-foreground/30 absolute size-6' />
											<Image
												src={media.url}
												alt={media.altText || media.originalName || media.fileName}
												fill
												sizes='(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw'
												className='object-cover transition-transform duration-300 group-hover:scale-105'
												onError={e => {
													e.currentTarget.style.display = 'none'
												}}
											/>
										</>
									) : (
										<FileText className='text-muted-foreground size-8' aria-hidden />
									)}

									<div className='bg-background/80 absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100'>
										<button
											type='button'
											onClick={() => handleCopyUrl(media)}
											title='Copy URL'
											className='bg-surface border-border text-foreground hover:bg-accent cursor-pointer rounded-lg border p-2 transition-colors'>
											{isCopied ? (
												<Check className='text-success size-3.5' />
											) : (
												<Copy className='size-3.5' />
											)}
										</button>
										<Link
											href={media.url}
											target='_blank'
											rel='noopener noreferrer'
											title='Open original file'
											className='bg-surface border-border text-foreground hover:bg-accent rounded-lg border p-2 transition-colors'>
											<ExternalLink className='size-3.5' />
										</Link>
										<button
											type='button'
											onClick={() => setDeleteItem(media)}
											title='Delete asset'
											className='bg-surface border-border text-destructive hover:bg-destructive/15 cursor-pointer rounded-lg border p-2 transition-colors'>
											<Trash2 className='size-3.5' />
										</button>
									</div>
								</div>

								<div className='space-y-1 p-3'>
									<p className='text-foreground w-full truncate font-mono text-xs font-medium'>
										{media.originalName || media.fileName}
									</p>
									<div className='text-muted-foreground flex items-center justify-between font-mono text-[0.625rem]'>
										<span>{formatBytes(media.size)}</span>
										<Badge variant='outline' className='px-1 py-0 text-[0.5625rem]'>
											{media.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
										</Badge>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{hasMore && !loading && (
				<div className='flex justify-center'>
					<Button type='button' variant='outline' onClick={loadMore} disabled={loadingMore}>
						{loadingMore && <RefreshCw className='size-4 animate-spin' />}
						<span>{loadingMore ? 'Loading…' : 'Load more'}</span>
					</Button>
				</div>
			)}

			<ConfirmDialog
				open={Boolean(deleteItem)}
				onOpenChange={open => !open && setDeleteItem(null)}
				title='Delete S3 Media Asset'
				description={`Are you sure you want to delete "${deleteItem?.originalName || deleteItem?.fileName}"? This will unlink the media record from the PostgreSQL catalog.`}
				confirmLabel='Delete Asset'
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	)
}
