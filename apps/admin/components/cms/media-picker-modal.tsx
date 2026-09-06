'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import { Check, Image as ImageIcon, RefreshCw, Search, Upload } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { adminFetch, uploadMediaToS3 } from '@/lib/api-client'
import { cn } from '@/lib/utils'

type MediaItem = {
	id: string
	url: string
	fileName: string
	mimeType?: string
	size?: number
	altText?: string | null
}

type MediaPickerModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSelect: (media: { id: string; url: string; fileName: string; altText?: string }) => void
	title?: string
}

export function MediaPickerModal({
	open,
	onOpenChange,
	onSelect,
	title = 'Select Media Asset',
}: MediaPickerModalProps) {
	const [mediaList, setMediaList] = useState<MediaItem[]>([])
	const [loading, setLoading] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [search, setSearch] = useState('')
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (open) {
			loadMedia()
		}
	}, [open])

	async function loadMedia() {
		setLoading(true)
		setError(null)
		try {
			const res = await adminFetch<{ items?: MediaItem[] } | MediaItem[]>('/api/v1/media')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setMediaList(items)
			} else {
				setMediaList([])
			}
		} catch {
			setError('Could not load media library. You can upload a new asset below.')
		} finally {
			setLoading(false)
		}
	}

	async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return

		setUploading(true)
		setError(null)
		try {
			const uploaded = await uploadMediaToS3(file)
			const newItem: MediaItem = {
				id: uploaded.id,
				url: uploaded.url,
				fileName: uploaded.fileName,
			}
			setMediaList(prev => [newItem, ...prev])
			setSelectedId(newItem.id)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed.')
		} finally {
			setUploading(false)
		}
	}

	const selectedMedia = mediaList.find(m => m.id === selectedId)

	function handleConfirm() {
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

	const filtered = mediaList.filter(
		m =>
			m.fileName.toLowerCase().includes(search.toLowerCase()) ||
			m.altText?.toLowerCase().includes(search.toLowerCase()),
	)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className='max-w-3xl max-h-[85vh] flex flex-col p-6'
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

				{/* Search & Upload Bar */}
				<div className='flex items-center gap-3 my-2'>
					<div className='relative flex-1'>
						<Search className='size-4 text-muted-foreground absolute left-3 top-2.5' />
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
					<p className='text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg my-1'>
						{error}
					</p>
				)}

				{/* Media Grid */}
				<div className='flex-1 overflow-y-auto min-h-[260px] max-h-[400px] border border-border rounded-xl p-3 my-2'>
					{loading ? (
						<div className='size-full grid place-items-center py-12 text-muted-foreground text-sm font-mono'>
							<div className='flex items-center gap-2'>
								<RefreshCw className='size-4 animate-spin text-signal-ink' />
								<span>Loading S3 media catalog…</span>
							</div>
						</div>
					) : filtered.length === 0 ? (
						<div className='size-full grid place-items-center py-12 text-center text-muted-foreground text-sm'>
							<div className='space-y-2'>
								<ImageIcon className='size-8 mx-auto opacity-40' />
								<p>No media files found matching your search.</p>
							</div>
						</div>
					) : (
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
							{filtered.map(media => {
								const isSelected = media.id === selectedId
								return (
									<button
										key={media.id}
										type='button'
										onClick={() => setSelectedId(media.id)}
										className={cn(
											'group relative flex flex-col rounded-xl border p-2 text-left transition-all overflow-hidden cursor-pointer',
											isSelected
												? 'border-signal bg-signal/10 ring-2 ring-signal'
												: 'border-border bg-surface hover:border-border-strong hover:bg-accent',
										)}>
										<div className='aspect-video w-full rounded-lg bg-surface-strong overflow-hidden relative grid place-items-center'>
											<img
												src={media.url}
												alt={media.altText || media.fileName}
												className='size-full object-cover'
												onError={e => {
													;(e.target as HTMLElement).style.display = 'none'
												}}
											/>
											<ImageIcon className='size-5 text-muted-foreground/30 absolute' />
											{isSelected && (
												<div className='absolute top-1.5 right-1.5 size-5 rounded-full bg-signal grid place-items-center text-white shadow-sm'>
													<Check className='size-3 stroke-[3]' />
												</div>
											)}
										</div>
										<p className='mt-2 truncate font-mono text-[0.6875rem] text-foreground w-full'>
											{media.fileName}
										</p>
									</button>
								)
							})}
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
