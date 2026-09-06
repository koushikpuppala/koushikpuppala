'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import {
	Check,
	Copy,
	ExternalLink,
	Image as ImageIcon,
	RefreshCw,
	Search,
	Trash2,
	Upload,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/cms/confirm-dialog'
import { adminFetch, uploadMediaToS3 } from '@/lib/api-client'
import { cn } from '@/lib/utils'

export type MediaAsset = {
	id: string
	fileName: string
	url: string
	storageKey?: string
	mimeType?: string
	size?: number
	width?: number | null
	height?: number | null
	altText?: string | null
	caption?: string | null
	createdAt?: string
}

export const MediaClientView = () => {
	const [mediaList, setMediaList] = useState<MediaAsset[]>([])
	const [loading, setLoading] = useState(true)
	const [uploading, setUploading] = useState(false)
	const [search, setSearch] = useState('')
	const [filterType, setFilterType] = useState<'ALL' | 'IMAGE' | 'PDF'>('ALL')
	const [deleteItem, setDeleteItem] = useState<MediaAsset | null>(null)
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)

	const loadMedia = async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items?: MediaAsset[] } | MediaAsset[]>('/api/v1/media')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setMediaList(items)
			}
		} catch (err) {
			console.error('Failed to load media:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadMedia()
	}, [])

	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setUploading(true)
		try {
			const uploaded = await uploadMediaToS3(file)
			const newRecord: MediaAsset = {
				id: uploaded.id,
				fileName: uploaded.fileName,
				url: uploaded.url,
				storageKey: uploaded.storageKey,
				mimeType: file.type,
				size: file.size,
				createdAt: new Date().toISOString(),
			}
			setMediaList(prev => [newRecord, ...prev])
		} finally {
			setUploading(false)
		}
	}

	const handleDeleteConfirm = async () => {
		if (!deleteItem) return
		await adminFetch(`/api/v1/media/${deleteItem.id}`, { method: 'DELETE' })
		setMediaList(prev => prev.filter(m => m.id !== deleteItem.id))
		if (selectedMedia?.id === deleteItem.id) setSelectedMedia(null)
		setDeleteItem(null)
	}

	const handleCopyUrl = async (media: MediaAsset) => {
		try {
			await navigator.clipboard.writeText(media.url)
			setCopiedId(media.id)
			setTimeout(() => setCopiedId(null), 2000)
		} catch {
			/* fallback */
		}
	}

	const filtered = mediaList.filter(m => {
		const matchSearch =
			m.fileName.toLowerCase().includes(search.toLowerCase()) ||
			(m.altText?.toLowerCase().includes(search.toLowerCase()) ?? false)
		const matchType =
			filterType === 'ALL'
				? true
				: filterType === 'IMAGE'
					? (m.mimeType?.startsWith('image') ?? true)
					: m.mimeType === 'application/pdf'
		return matchSearch && matchType
	})

	const formatBytes = (bytes?: number) => {
		if (!bytes) return '—'
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
		return `${(bytes / 1048576).toFixed(1)} MB`
	}

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='font-display text-2xl font-bold tracking-tight text-foreground'>
						AWS S3 Media Library
					</h1>
					<p className='mt-1 text-sm text-muted-foreground'>
						Secure object storage with presigned PUT URLs, image optimization, and metadata
						indexing.
					</p>
				</div>

				<label className='cursor-pointer'>
					<input type='file' className='hidden' onChange={handleUpload} disabled={uploading} />
					<Button type='button' variant='signal' disabled={uploading} asChild>
						<span>
							{uploading ? (
								<>
									<RefreshCw className='size-4 animate-spin' />
									<span>Uploading to S3…</span>
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

			{/* Search & Filter Toolbar */}
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3 shadow-xs'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='size-4 text-muted-foreground absolute left-3 top-2.5' />
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
							className={cn(
								'rounded-lg px-3 py-1.5 transition-colors cursor-pointer',
								filterType === type
									? 'bg-primary text-primary-foreground font-semibold shadow-xs'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground',
							)}>
							{type === 'ALL' ? 'All Files' : type === 'IMAGE' ? 'Images' : 'PDF Documents'}
						</button>
					))}
				</div>
			</div>

			{/* Media Assets Grid */}
			{loading ? (
				<div className='py-20 text-center text-muted-foreground font-mono text-sm'>
					<div className='flex items-center justify-center gap-2'>
						<RefreshCw className='size-4 animate-spin text-signal-ink' />
						<span>Loading S3 media library…</span>
					</div>
				</div>
			) : filtered.length === 0 ? (
				<div className='rounded-2xl border border-border bg-surface py-20 text-center text-muted-foreground'>
					<ImageIcon className='size-10 mx-auto opacity-30 mb-2' />
					<p className='font-sans text-sm'>No media files found matching your query.</p>
				</div>
			) : (
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
					{filtered.map(media => {
						const isCopied = copiedId === media.id
						return (
							<div
								key={media.id}
								className='group relative flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-xs hover:border-signal/50 transition-all'>
								{/* Thumbnail Box */}
								<div className='aspect-video w-full bg-surface-strong relative overflow-hidden grid place-items-center'>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={media.url}
										alt={media.altText || media.fileName}
										className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
										onError={e => {
											;(e.target as HTMLElement).style.display = 'none'
										}}
									/>
									<ImageIcon className='size-6 text-muted-foreground/30 absolute' />

									{/* Quick Action Overlay */}
									<div className='absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-xs'>
										<button
											type='button'
											onClick={() => handleCopyUrl(media)}
											title='Copy URL'
											className='rounded-lg p-2 bg-surface border border-border text-foreground hover:bg-accent transition-colors cursor-pointer'>
											{isCopied ? (
												<Check className='size-3.5 text-success' />
											) : (
												<Copy className='size-3.5' />
											)}
										</button>
										<a
											href={media.url}
											target='_blank'
											rel='noopener noreferrer'
											title='Open original file'
											className='rounded-lg p-2 bg-surface border border-border text-foreground hover:bg-accent transition-colors'>
											<ExternalLink className='size-3.5' />
										</a>
										<button
											type='button'
											onClick={() => setDeleteItem(media)}
											title='Delete asset'
											className='rounded-lg p-2 bg-surface border border-border text-destructive hover:bg-destructive/15 transition-colors cursor-pointer'>
											<Trash2 className='size-3.5' />
										</button>
									</div>
								</div>

								{/* Details Metadata */}
								<div className='p-3 space-y-1'>
									<p className='truncate font-mono text-xs font-medium text-foreground w-full'>
										{media.fileName}
									</p>
									<div className='flex items-center justify-between font-mono text-[0.625rem] text-muted-foreground'>
										<span>{formatBytes(media.size)}</span>
										<Badge variant='outline' className='text-[0.5625rem] px-1 py-0'>
											{media.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
										</Badge>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			<ConfirmDialog
				open={Boolean(deleteItem)}
				onOpenChange={open => !open && setDeleteItem(null)}
				title='Delete S3 Media Asset'
				description={`Are you sure you want to delete "${deleteItem?.fileName}"? This will unlink the media record from the PostgreSQL catalog.`}
				confirmLabel='Delete Asset'
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	)
}
