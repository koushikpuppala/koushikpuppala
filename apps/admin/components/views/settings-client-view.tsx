'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from 'ui/designs/data-table'
import { adminFetch } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import {
	Globe,
	Image as ImageIcon,
	Save,
	RefreshCw,
	CheckCircle2,
	Eye,
	Share2,
	Shield,
	Plus,
	X,
	Pencil,
} from '@/components/icons'

export type MetadataRecord = {
	id?: string
	type: 'PAGE' | 'LAYOUT'
	key: string
	value: Record<string, unknown>
	title?: string | null
	description?: string | null
	ogImage?: string | null
	canonicalUrl?: string | null
	robots?: string | null
	keywords: string[]
	isPublished: boolean
	createdAt?: string
	updatedAt?: string
}

export const SettingsClientView = () => {
	const [recordId, setRecordId] = useState<string | null>(null)
	const [allRecords, setAllRecords] = useState<MetadataRecord[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [saveSuccess, setSaveSuccess] = useState(false)
	const [saveError, setSaveError] = useState('')

	// Form state
	const [key, setKey] = useState('global-seo')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [canonicalUrl, setCanonicalUrl] = useState('')
	const [ogImage, setOgImage] = useState('')
	const [robots, setRobots] = useState('index,follow')
	const [keywords, setKeywords] = useState<string[]>([])
	const [newKeyword, setNewKeyword] = useState('')
	const [isPublished, setIsPublished] = useState(true)

	// S3 Media Picker
	const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

	const populateForm = useCallback((record: MetadataRecord) => {
		if (record.id) setRecordId(record.id)
		setKey(record.key)
		setTitle(record.title || '')
		setDescription(record.description || '')
		setCanonicalUrl(record.canonicalUrl || 'https://koushikpuppala.com')
		setOgImage(record.ogImage || '')
		setRobots(record.robots || 'index,follow')
		setKeywords(record.keywords || [])
		setIsPublished(record.isPublished)
	}, [])

	const loadSettings = useCallback(async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items: MetadataRecord[] } | MetadataRecord[]>(
				'/api/v1/metadata',
			)
			const list = Array.isArray(res.data) ? res.data : (res.data?.items || [])
			setAllRecords(list)

			const existing = list.find(m => m.key === 'global-seo') || list[0]

			if (existing) {
				populateForm(existing)
			}
		} catch (err) {
			console.error('Failed to load settings metadata:', err)
		} finally {
			setLoading(false)
		}
	}, [populateForm])

	useEffect(() => {
		loadSettings()
	}, [loadSettings])

	const handleAddKeyword = () => {
		const trimmed = newKeyword.trim()
		if (trimmed && !keywords.includes(trimmed)) {
			setKeywords([...keywords, trimmed])
			setNewKeyword('')
		}
	}

	const handleRemoveKeyword = (kwToRemove: string) => {
		setKeywords(keywords.filter(kw => kw !== kwToRemove))
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setSaveError('')
		setSaveSuccess(false)

		const payload = {
			key,
			type: 'LAYOUT',
			title,
			description,
			canonicalUrl,
			ogImage: ogImage || null,
			robots,
			keywords,
			isPublished,
			value: {
				siteName: 'Koushik Puppala',
				author: 'Koushik Puppala',
				primaryDomain: 'https://koushikpuppala.com',
				adminDomain: 'https://admin.koushikpuppala.com',
				twitterHandle: '@koushikpuppala',
			},
		}

		try {
			if (recordId) {
				const res = await adminFetch<MetadataRecord>(`/api/v1/metadata/${recordId}`, {
					method: 'PATCH',
					body: JSON.stringify(payload),
				})
				if (res.data) {
					setSaveSuccess(true)
					loadSettings()
					setTimeout(() => setSaveSuccess(false), 3500)
				} else if (res.error) {
					setSaveError(res.error)
				}
			} else {
				const res = await adminFetch<MetadataRecord>('/api/v1/metadata', {
					method: 'POST',
					body: JSON.stringify(payload),
				})
				if (res.data?.id) {
					setRecordId(res.data.id)
					setSaveSuccess(true)
					loadSettings()
					setTimeout(() => setSaveSuccess(false), 3500)
				} else if (res.error) {
					setSaveError(res.error)
				}
			}
		} catch (err: unknown) {
			setSaveError(err instanceof Error ? err.message : 'Failed to save settings.')
		} finally {
			setSaving(false)
		}
	}

	const columns = useMemo<ColumnDef<MetadataRecord>[]>(
		() => [
			{
				accessorKey: 'key',
				header: 'Key / Identifier',
				cell: ({ row }) => (
					<span className='font-mono font-semibold text-xs text-signal-ink'>
						{row.original.key}
					</span>
				),
			},
			{
				accessorKey: 'type',
				header: 'Type',
				cell: ({ row }) => (
					<Badge variant={row.original.type === 'LAYOUT' ? 'signal' : 'secondary'}>
						{row.original.type}
					</Badge>
				),
			},
			{
				accessorKey: 'title',
				header: 'SEO Title',
				cell: ({ row }) => (
					<span className='font-medium text-xs text-foreground truncate block max-w-xs'>
						{row.original.title || 'Untitled'}
					</span>
				),
			},
			{
				accessorKey: 'robots',
				header: 'Robots Directives',
				cell: ({ row }) => (
					<span className='font-mono text-xs text-muted-foreground'>
						{row.original.robots || 'index,follow'}
					</span>
				),
			},
			{
				accessorKey: 'isPublished',
				header: 'Status',
				cell: ({ row }) => (
					<Badge variant={row.original.isPublished ? 'success' : 'outline'}>
						{row.original.isPublished ? 'Published' : 'Draft'}
					</Badge>
				),
			},
			{
				id: 'actions',
				header: () => <div className='text-right'>Actions</div>,
				cell: ({ row }) => (
					<div className='text-right'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => populateForm(row.original)}
							className='text-xs text-signal-ink hover:bg-signal-ink/10'>
							<Pencil className='size-3.5 mr-1' />
							Load in Form
						</Button>
					</div>
				),
			},
		],
		[populateForm],
	)

	return (
		<div className='space-y-8'>
			<form onSubmit={handleSave} className='space-y-8'>
				{/* Header */}
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h1 className='font-display text-2xl font-bold tracking-tight text-foreground'>
							Site Settings & SEO Engine
						</h1>
						<p className='text-sm text-muted-foreground'>
							Configure global search engine metadata, OpenGraph social cards, canonical routing,
							and web indexation.
						</p>
					</div>
					<div className='flex items-center gap-3'>
						{saveSuccess && (
							<span className='flex items-center gap-1.5 text-xs font-medium text-emerald-500'>
								<CheckCircle2 className='size-4' />
								Settings updated successfully
							</span>
						)}
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={loadSettings}
							disabled={loading || saving}>
							<RefreshCw className={`size-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
							Refresh
						</Button>
						<Button type='submit' variant='signal' size='sm' disabled={saving}>
							<Save className='size-4 mr-1.5' />
							{saving ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</div>

				{saveError && (
					<div className='rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive'>
						{saveError}
					</div>
				)}

				<div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
					{/* Left 2 Columns: Core Form */}
					<div className='space-y-6 lg:col-span-2'>
						{/* Meta Tags Card */}
						<div className='rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5'>
							<h2 className='text-base font-semibold tracking-tight text-foreground flex items-center gap-2'>
								<Globe className='size-4 text-signal-ink' />
								Search Engine Metadata
							</h2>

							<div className='space-y-1.5'>
								<label htmlFor='settings-title' className='text-xs font-medium text-foreground'>
									Global Title Template
								</label>
								<Input
									id='settings-title'
									required
									placeholder='Page Title'
									value={title}
									onChange={e => setTitle(e.target.value)}
								/>
								<p className='text-[11px] text-muted-foreground'>
									Optimal length: 50–60 characters. Current length: {title.length} chars.
								</p>
							</div>

							<div className='space-y-1.5'>
								<label htmlFor='settings-description' className='text-xs font-medium text-foreground'>
									Global Meta Description
								</label>
								<Textarea
									id='settings-description'
									required
									rows={3}
									placeholder='Summary for search engines...'
									value={description}
									onChange={e => setDescription(e.target.value)}
								/>
								<p className='text-[11px] text-muted-foreground'>
									Optimal length: 140–160 characters. Current length: {description.length} chars.
								</p>
							</div>

							<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
								<div className='space-y-1.5'>
									<label htmlFor='settings-canonical' className='text-xs font-medium text-foreground'>
										Canonical Base URL
									</label>
									<Input
										id='settings-canonical'
										required
										placeholder='https://koushikpuppala.com'
										value={canonicalUrl}
										onChange={e => setCanonicalUrl(e.target.value)}
									/>
								</div>

								<div className='space-y-1.5'>
									<label htmlFor='settings-robots' className='text-xs font-medium text-foreground'>
										Robots Directives
									</label>
									<select
										id='settings-robots'
										aria-label='Robots directives'
										value={robots}
										onChange={e => setRobots(e.target.value)}
										className='w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink'>
										<option value='index,follow'>index, follow (Standard Public)</option>
										<option value='noindex,follow'>noindex, follow (Staging / Pre-launch)</option>
										<option value='noindex,nofollow'>noindex, nofollow (Private)</option>
									</select>
								</div>
							</div>
						</div>

						{/* Keywords Card */}
						<div className='rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4'>
							<h2 className='text-base font-semibold tracking-tight text-foreground'>
								Meta Keywords & Discoverability
							</h2>
							<div className='flex gap-2'>
								<Input
									placeholder='Add keyword tag (e.g. Distributed Systems)...'
									value={newKeyword}
									onChange={e => setNewKeyword(e.target.value)}
									onKeyDown={e => {
										if (e.key === 'Enter') {
											e.preventDefault()
											handleAddKeyword()
										}
									}}
								/>
								<Button type='button' variant='secondary' onClick={handleAddKeyword}>
									<Plus className='size-4 mr-1' />
									Add
								</Button>
							</div>

							<div className='flex flex-wrap gap-2 pt-1'>
								{keywords.map(kw => (
									<span
										key={kw}
										className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground'>
										{kw}
										<button
											type='button'
											onClick={() => handleRemoveKeyword(kw)}
											className='text-muted-foreground hover:text-destructive'>
											<X className='size-3' />
										</button>
									</span>
								))}
							</div>
						</div>

						{/* OpenGraph & Social Sharing Image */}
						<div className='rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4'>
							<h2 className='text-base font-semibold tracking-tight text-foreground flex items-center gap-2'>
								<ImageIcon className='size-4 text-signal-ink' />
								OpenGraph & Social Share Banner
							</h2>
							<p className='text-xs text-muted-foreground'>
								Default preview image displayed on Twitter, LinkedIn, Slack, and Facebook feeds
								(1200x630 recommended).
							</p>

							<div className='flex items-center gap-3'>
								<Input
									placeholder='https://s3.../og-banner.webp'
									value={ogImage}
									onChange={e => setOgImage(e.target.value)}
								/>
								<Button type='button' variant='outline' onClick={() => setIsMediaPickerOpen(true)}>
									Choose from S3
								</Button>
							</div>

							{ogImage && (
								<div className='overflow-hidden rounded-lg border border-border bg-background max-w-md aspect-[1200/630] relative'>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={ogImage} alt='OG Preview' className='h-full w-full object-cover' />
								</div>
							)}
						</div>

						{/* Publication State */}
						<div className='rounded-2xl border border-border bg-surface p-6 shadow-xs flex items-center justify-between'>
							<div>
								<h2 className='text-sm font-semibold text-foreground'>Publish Status</h2>
								<p className='text-xs text-muted-foreground mt-0.5'>
									When active, these SEO tags are propagated to client SSR/SSG layout outputs.
								</p>
							</div>
							<button
								type='button'
								onClick={() => setIsPublished(!isPublished)}
								className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
									isPublished ? 'bg-signal-ink' : 'bg-border'
								}`}>
								<span
									className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
										isPublished ? 'translate-x-5' : 'translate-x-0'
									}`}
								/>
							</button>
						</div>
					</div>

					{/* Right Column: Live SERP & Social Previews */}
					<div className='space-y-6'>
						{/* Google SERP Card */}
						<div className='rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3'>
							<h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono'>
								<Eye className='size-3.5' />
								Google Search SERP Preview
							</h3>
							<div className='rounded-xl border border-border bg-background p-4 space-y-1.5 text-left'>
								<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
									<div className='size-3.5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[9px] font-bold'>
										K
									</div>
									<span className='truncate max-w-[200px]'>{canonicalUrl}</span>
								</div>
								<h4 className='text-sm font-medium text-blue-500 hover:underline cursor-pointer line-clamp-1'>
									{title || 'Page Title'}
								</h4>
								<p className='text-xs text-muted-foreground line-clamp-2 leading-relaxed'>
									{description || 'Page meta description will appear in Google index results...'}
								</p>
							</div>
						</div>

						{/* Twitter / Social Card Preview */}
						<div className='rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3'>
							<h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono'>
								<Share2 className='size-3.5' />
								Social OpenGraph Card
							</h3>
							<div className='overflow-hidden rounded-xl border border-border bg-background text-left'>
								<div className='aspect-[1200/630] bg-surface/70 flex items-center justify-center overflow-hidden border-b border-border'>
									{ogImage ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={ogImage} alt='OG Preview' className='h-full w-full object-cover' />
									) : (
										<div className='flex flex-col items-center justify-center p-4 text-center text-muted-foreground'>
											<ImageIcon className='size-8 mb-2 opacity-50' />
											<span className='text-xs'>No OG Image specified</span>
										</div>
									)}
								</div>
								<div className='p-3 space-y-1'>
									<p className='text-[10px] uppercase font-semibold text-muted-foreground font-mono'>
										koushikpuppala.com
									</p>
									<p className='text-xs font-semibold text-foreground line-clamp-1'>{title}</p>
									<p className='text-[11px] text-muted-foreground line-clamp-2'>{description}</p>
								</div>
							</div>
						</div>

						{/* System Metadata Verification */}
						<div className='rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3'>
							<h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono'>
								<Shield className='size-3.5 text-signal-ink' />
								Architecture Boundaries
							</h3>
							<ul className='text-xs text-muted-foreground space-y-2'>
								<li className='flex items-center justify-between'>
									<span>Backend Verification:</span>
									<span className='font-mono font-medium text-foreground'>NestJS 11</span>
								</li>
								<li className='flex items-center justify-between'>
									<span>Prisma Model:</span>
									<span className='font-mono font-medium text-foreground'>Metadata (db.Uuid)</span>
								</li>
								<li className='flex items-center justify-between'>
									<span>Media Storage:</span>
									<span className='font-mono font-medium text-foreground'>AWS S3 Presigned</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Media Picker Modal */}
				<MediaPickerModal
					open={isMediaPickerOpen}
					onOpenChange={setIsMediaPickerOpen}
					onSelect={media => {
						setOgImage(media.url)
						setIsMediaPickerOpen(false)
					}}
					title='Select OpenGraph Social Banner'
				/>
			</form>

			{/* Table Section */}
			<div className='space-y-4'>
				<div>
					<h2 className='font-display text-lg font-bold tracking-tight text-foreground'>
						Metadata Audit & Configuration Records
					</h2>
					<p className='text-xs text-muted-foreground'>
						Inspect and manage stored layout and page SEO configuration records.
					</p>
				</div>

				<DataTable
					columns={columns}
					data={allRecords}
					loading={loading}
					totalCount={allRecords.length}
					pageSize={10}
					disableDateRange
					disableSearch
				/>
			</div>
		</div>
	)
}
