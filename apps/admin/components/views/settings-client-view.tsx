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

export const PATHNAME_PRESETS = [
	{ key: '/', label: 'Home Page (/)' },
	{ key: '/about', label: 'About (/about)' },
	{ key: '/projects', label: 'Projects (/projects)' },
	{ key: '/projects/[slug]', label: 'Project Detail (/projects/[slug])' },
	{ key: '/experience', label: 'Experience (/experience)' },
	{ key: '/education', label: 'Education (/education)' },
	{ key: '/services', label: 'Services (/services)' },
	{ key: '/skills', label: 'Skills (/skills)' },
	{ key: '/resume', label: 'Resume (/resume)' },
	{ key: '/contact', label: 'Contact (/contact)' },
]

export const SettingsClientView = () => {
	const [recordId, setRecordId] = useState<string | null>(null)
	const [allRecords, setAllRecords] = useState<MetadataRecord[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [saveSuccess, setSaveSuccess] = useState(false)
	const [saveError, setSaveError] = useState('')
	const [fetchError, setFetchError] = useState<string | null>(null)

	// Form state
	const [key, setKey] = useState('/')
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

	const handleSelectPath = useCallback(
		(targetKey: string) => {
			const existing = allRecords.find(m => m.key === targetKey)

			if (existing) populateForm(existing)
			else {
				setRecordId(null)
				setKey(targetKey)
				setTitle('')
				setDescription('')
				setCanonicalUrl(`https://koushikpuppala.com${targetKey === '/' ? '' : targetKey}`)
				setOgImage('')
				setRobots('index,follow')
				setKeywords([])
				setIsPublished(true)
			}
		},
		[allRecords, populateForm],
	)

	const loadSettings = useCallback(async () => {
		setLoading(true)
		setFetchError(null)
		try {
			const res = await adminFetch<{ items: MetadataRecord[] } | MetadataRecord[]>(
				'/api/v1/metadata',
			)
			if (res.data) {
				const list = Array.isArray(res.data) ? res.data : res.data?.items || []
				setAllRecords(list)

				const existing =
					list.find(m => m.key === '/' || m.key === 'home') ||
					list.find(m => m.key === 'global-seo') ||
					list[0]

				if (existing) {
					populateForm(existing)
				}
			} else if (res.error) {
				setFetchError(res.error)
			}
		} catch (err) {
			console.error('Failed to load settings metadata:', err)
			setFetchError('Failed to load settings from server.')
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
					<span className='text-signal-ink font-mono text-xs font-semibold'>
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
					<span className='text-foreground block max-w-xs truncate text-xs font-medium'>
						{row.original.title || 'Untitled'}
					</span>
				),
			},
			{
				accessorKey: 'robots',
				header: 'Robots Directives',
				cell: ({ row }) => (
					<span className='text-muted-foreground font-mono text-xs'>
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
							className='text-signal-ink hover:bg-signal-ink/10 text-xs'>
							<Pencil className='mr-1 size-3.5' />
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
						<h1 className='font-display text-foreground text-2xl font-bold tracking-tight'>
							Site Settings & SEO Engine
						</h1>
						<p className='text-muted-foreground text-sm'>
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
							<RefreshCw className={`mr-1.5 size-4 ${loading ? 'animate-spin' : ''}`} />
							Refresh
						</Button>
						<Button type='submit' variant='signal' size='sm' disabled={saving}>
							<Save className='mr-1.5 size-4' />
							{saving ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</div>

				{fetchError && (
					<div className='border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-2xl border p-4 text-xs'>
						<span>{fetchError}</span>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={loadSettings}
							className='text-xs'>
							Retry API Fetch
						</Button>
					</div>
				)}

				{saveError && (
					<div className='border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border p-4 text-xs'>
						{saveError}
					</div>
				)}

				<div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
					{/* Left 2 Columns: Core Form */}
					<div className='space-y-6 lg:col-span-2'>
						{/* Pathname / Key Selector */}
						<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs'>
							<div className='flex items-center justify-between'>
								<div>
									<h2 className='text-foreground text-sm font-semibold tracking-tight'>
										Target Page Pathname
									</h2>
									<p className='text-muted-foreground text-xs'>
										Select a page route to configure or type a custom pathname key.
									</p>
								</div>
								<Badge variant='signal' className='font-mono text-xs'>
									{key}
								</Badge>
							</div>

							<div className='flex flex-wrap gap-2'>
								{PATHNAME_PRESETS.map(preset => {
									const isSelected = key === preset.key
									const hasCustomMeta = allRecords.some(r => r.key === preset.key)
									return (
										<button
											key={preset.key}
											type='button'
											onClick={() => handleSelectPath(preset.key)}
											className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors ${
												isSelected
													? 'border-signal bg-signal/15 text-signal-ink font-semibold'
													: 'border-border/80 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground'
											}`}>
											<span>{preset.key}</span>
											{hasCustomMeta && (
												<span
													className='size-1.5 rounded-full bg-emerald-500'
													title='Saved in DB'
												/>
											)}
										</button>
									)
								})}
							</div>

							<div className='space-y-1.5 pt-1'>
								<label htmlFor='settings-key' className='text-foreground text-xs font-medium'>
									Custom Pathname Key
								</label>
								<Input
									id='settings-key'
									required
									placeholder='/custom-path'
									value={key}
									onChange={e => setKey(e.target.value)}
									className='font-mono text-xs'
								/>
							</div>
						</div>

						{/* Meta Tags Card */}
						<div className='border-border bg-surface space-y-5 rounded-2xl border p-6 shadow-xs'>
							<h2 className='text-foreground flex items-center gap-2 text-base font-semibold tracking-tight'>
								<Globe className='text-signal-ink size-4' />
								Search Engine Metadata
							</h2>

							<div className='space-y-1.5'>
								<label htmlFor='settings-title' className='text-foreground text-xs font-medium'>
									Global Title Template
								</label>
								<Input
									id='settings-title'
									required
									placeholder='Page Title'
									value={title}
									onChange={e => setTitle(e.target.value)}
								/>
								<p className='text-muted-foreground text-[11px]'>
									Optimal length: 50–60 characters. Current length: {title.length} chars.
								</p>
							</div>

							<div className='space-y-1.5'>
								<label
									htmlFor='settings-description'
									className='text-foreground text-xs font-medium'>
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
								<p className='text-muted-foreground text-[11px]'>
									Optimal length: 140–160 characters. Current length: {description.length} chars.
								</p>
							</div>

							<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
								<div className='space-y-1.5'>
									<label
										htmlFor='settings-canonical'
										className='text-foreground text-xs font-medium'>
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
									<label htmlFor='settings-robots' className='text-foreground text-xs font-medium'>
										Robots Directives
									</label>
									<select
										id='settings-robots'
										aria-label='Robots directives'
										value={robots}
										onChange={e => setRobots(e.target.value)}
										className='border-border bg-surface text-foreground focus:ring-signal-ink w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none'>
										<option value='index,follow'>index, follow (Standard Public)</option>
										<option value='noindex,follow'>noindex, follow (Staging / Pre-launch)</option>
										<option value='noindex,nofollow'>noindex, nofollow (Private)</option>
									</select>
								</div>
							</div>
						</div>

						{/* Keywords Card */}
						<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs'>
							<h2 className='text-foreground text-base font-semibold tracking-tight'>
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
									<Plus className='mr-1 size-4' />
									Add
								</Button>
							</div>

							<div className='flex flex-wrap gap-2 pt-1'>
								{keywords.map(kw => (
									<span
										key={kw}
										className='border-border bg-background text-foreground inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium'>
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
						<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs'>
							<h2 className='text-foreground flex items-center gap-2 text-base font-semibold tracking-tight'>
								<ImageIcon className='text-signal-ink size-4' />
								OpenGraph & Social Share Banner
							</h2>
							<p className='text-muted-foreground text-xs'>
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
								<div className='border-border bg-background relative aspect-1200/630 max-w-md overflow-hidden rounded-lg border'>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={ogImage} alt='OG Preview' className='h-full w-full object-cover' />
								</div>
							)}
						</div>

						{/* Publication State */}
						<div className='border-border bg-surface flex items-center justify-between rounded-2xl border p-6 shadow-xs'>
							<div>
								<h2 className='text-foreground text-sm font-semibold'>Publish Status</h2>
								<p className='text-muted-foreground mt-0.5 text-xs'>
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
						<div className='border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs'>
							<h3 className='text-muted-foreground flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider uppercase'>
								<Eye className='size-3.5' />
								Google Search SERP Preview
							</h3>
							<div className='border-border bg-background space-y-1.5 rounded-xl border p-4 text-left'>
								<div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
									<div className='flex size-3.5 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-500'>
										K
									</div>
									<span className='max-w-50 truncate'>{canonicalUrl}</span>
								</div>
								<h4 className='line-clamp-1 cursor-pointer text-sm font-medium text-blue-500 hover:underline'>
									{title || 'Page Title'}
								</h4>
								<p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
									{description || 'Page meta description will appear in Google index results...'}
								</p>
							</div>
						</div>

						{/* Twitter / Social Card Preview */}
						<div className='border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs'>
							<h3 className='text-muted-foreground flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider uppercase'>
								<Share2 className='size-3.5' />
								Social OpenGraph Card
							</h3>
							<div className='border-border bg-background overflow-hidden rounded-xl border text-left'>
								<div className='bg-surface/70 border-border flex aspect-1200/630 items-center justify-center overflow-hidden border-b'>
									{ogImage ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={ogImage} alt='OG Preview' className='h-full w-full object-cover' />
									) : (
										<div className='text-muted-foreground flex flex-col items-center justify-center p-4 text-center'>
											<ImageIcon className='mb-2 size-8 opacity-50' />
											<span className='text-xs'>No OG Image specified</span>
										</div>
									)}
								</div>
								<div className='space-y-1 p-3'>
									<p className='text-muted-foreground font-mono text-[10px] font-semibold uppercase'>
										koushikpuppala.com
									</p>
									<p className='text-foreground line-clamp-1 text-xs font-semibold'>{title}</p>
									<p className='text-muted-foreground line-clamp-2 text-[11px]'>{description}</p>
								</div>
							</div>
						</div>

						{/* System Metadata Verification */}
						<div className='border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs'>
							<h3 className='text-muted-foreground flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider uppercase'>
								<Shield className='text-signal-ink size-3.5' />
								Architecture Boundaries
							</h3>
							<ul className='text-muted-foreground space-y-2 text-xs'>
								<li className='flex items-center justify-between'>
									<span>Backend Verification:</span>
									<span className='text-foreground font-mono font-medium'>NestJS 11</span>
								</li>
								<li className='flex items-center justify-between'>
									<span>Prisma Model:</span>
									<span className='text-foreground font-mono font-medium'>Metadata (db.Uuid)</span>
								</li>
								<li className='flex items-center justify-between'>
									<span>Media Storage:</span>
									<span className='text-foreground font-mono font-medium'>AWS S3 Presigned</span>
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
					<h2 className='font-display text-foreground text-lg font-bold tracking-tight'>
						Metadata Audit & Configuration Records
					</h2>
					<p className='text-muted-foreground text-xs'>
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
