'use client'

import { useEffect, useState } from 'react'
import { Image as ImageIcon, Plus, Sparkles, Trash2 } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SingletonEditor } from '@/components/cms/singleton-editor'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import { adminFetch } from '@/lib/api-client'

import type { HomeContent } from 'types/models'

export const HomeContentClientView = () => {
	const [content, setContent] = useState<HomeContent>({
		title: '',
		separator: '|',
		subtitles: [],
		content: '',
		ctaLabel: '',
		ctaUrl: '',
		secondaryCtaLabel: '',
		secondaryCtaUrl: '',
		featuredSkills: [],
		stats: null,
		profileImageUrl: '',
		isPublished: false,
	})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isDirty, setIsDirty] = useState(false)
	const [mediaModalOpen, setMediaModalOpen] = useState(false)
	const [notice, setNotice] = useState<string | null>(null)
	const [newSubtitle, setNewSubtitle] = useState('')
	const [newSkill, setNewSkill] = useState('')

	const loadHome = async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await adminFetch<HomeContent & { profileImage?: { url?: string } }>(
				'/api/v1/home/published',
			)
			if (res.data) {
				const d = res.data
				setContent({
					id: d.id,
					title: d.title || '',
					separator: d.separator || '|',
					subtitles: Array.isArray(d.subtitles) ? d.subtitles : [],
					content: d.content || '',
					ctaLabel: d.ctaLabel || '',
					ctaUrl: d.ctaUrl || '',
					secondaryCtaLabel: d.secondaryCtaLabel || '',
					secondaryCtaUrl: d.secondaryCtaUrl || '',
					featuredSkills: Array.isArray(d.featuredSkills) ? d.featuredSkills : [],
					stats: d.stats || null,
					profileImageUrl: d.profileImageUrl || d.profileImage?.url || '',
					isPublished: d.isPublished ?? true,
				})
			} else if (res.error) {
				setError(res.error)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load homepage content from API.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadHome()
	}, [])

	const handleChange = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) => {
		setContent((prev: HomeContent) => ({ ...prev, [key]: value }))
		setIsDirty(true)
	}

	const handleAddSubtitle = () => {
		if (!newSubtitle.trim()) return
		setContent((prev: HomeContent) => ({
			...prev,
			subtitles: [...(prev.subtitles || []), newSubtitle.trim()],
		}))
		setNewSubtitle('')
		setIsDirty(true)
	}

	const handleRemoveSubtitle = (index: number) => {
		setContent((prev: HomeContent) => ({
			...prev,
			subtitles: (prev.subtitles || []).filter((_: string, i: number) => i !== index),
		}))
		setIsDirty(true)
	}

	const handleAddSkill = () => {
		if (!newSkill.trim()) return
		setContent((prev: HomeContent) => ({
			...prev,
			featuredSkills: [...(prev.featuredSkills || []), newSkill.trim()],
		}))
		setNewSkill('')
		setIsDirty(true)
	}

	const handleRemoveSkill = (index: number) => {
		setContent((prev: HomeContent) => ({
			...prev,
			featuredSkills: (prev.featuredSkills || []).filter((_: string, i: number) => i !== index),
		}))
		setIsDirty(true)
	}

	const handleSave = async () => {
		setSaving(true)
		setNotice(null)
		setError(null)
		try {
			const res = await adminFetch<HomeContent>(
				content.id ? `/api/v1/home/${content.id}` : '/api/v1/home',
				{
					method: content.id ? 'PATCH' : 'POST',
					body: JSON.stringify(content),
				},
			)
			if (res.data) {
				setContent((prev: HomeContent) => ({ ...prev, ...res.data }))
				setIsDirty(false)
				setNotice('Homepage content published successfully.')
			} else {
				setError(res.error || 'Failed to save homepage content.')
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'API request failed.')
		} finally {
			setSaving(false)
			setTimeout(() => setNotice(null), 4000)
		}
	}

	return (
		<SingletonEditor
			title='Homepage Editorial Studio'
			description='Authoritative display title, subtitles, separator, hero bio narrative, CTA routes, and featured skills.'
			isDirty={isDirty}
			loading={loading}
			saving={saving}
			error={error}
			onRetry={loadHome}
			onSave={handleSave}
			onDiscard={() => setIsDirty(false)}>
			{notice && (
				<div className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs text-success font-mono'>
					<Sparkles className='size-3.5' />
					<span>{notice}</span>
				</div>
			)}

			<div className='space-y-6'>
				<div className='grid gap-6 sm:grid-cols-3'>
					<div className='space-y-1.5 sm:col-span-2'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							Hero Display Name / Title
						</Label>
						<Input
							value={content.title}
							onChange={e => handleChange('title', e.target.value)}
							placeholder='e.g. KOUSHIK PUPPALA'
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							Status Separator
						</Label>
						<Input
							value={content.separator ?? '|'}
							onChange={e => handleChange('separator', e.target.value)}
							placeholder='|'
						/>
					</div>
				</div>

				{/* Subtitles Management */}
				<div className='space-y-3 pt-2 border-t border-border'>
					<Label className='text-xs font-mono uppercase text-muted-foreground block'>
						Role Subtitles / Rotating Badges
					</Label>
					<div className='space-y-2'>
						{content.subtitles.map((sub, i) => (
							<div
								key={`sub-${i}`}
								className='flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong/50 p-3 text-xs'>
								<span className='font-mono text-foreground'>{sub}</span>
								<button
									type='button'
									onClick={() => handleRemoveSubtitle(i)}
									className='text-muted-foreground hover:text-destructive p-1'>
									<Trash2 className='size-3.5' />
								</button>
							</div>
						))}
					</div>
					<div className='flex items-center gap-2 pt-1'>
						<Input
							value={newSubtitle}
							onChange={e => setNewSubtitle(e.target.value)}
							placeholder='Add a new role subtitle…'
							className='h-9 text-xs font-mono'
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									handleAddSubtitle()
								}
							}}
						/>
						<Button
							type='button'
							variant='secondary'
							size='sm'
							onClick={handleAddSubtitle}
							className='shrink-0'>
							<Plus className='size-3.5' />
							<span>Add Subtitle</span>
						</Button>
					</div>
				</div>

				{/* Hero Bio Content */}
				<div className='space-y-1.5 pt-2 border-t border-border'>
					<Label className='text-xs font-mono uppercase text-muted-foreground'>
						Hero Main Bio / Systems Philosophy Content
					</Label>
					<Textarea
						value={content.content}
						onChange={e => handleChange('content', e.target.value)}
						rows={4}
						placeholder='Architecting resilient distributed platforms…'
					/>
				</div>

				{/* Featured Skills Badges */}
				<div className='space-y-3 pt-2 border-t border-border'>
					<Label className='text-xs font-mono uppercase text-muted-foreground block'>
						Featured Stack Badges
					</Label>
					<div className='flex flex-wrap gap-2'>
						{(content.featuredSkills || []).map((skill, i) => (
							<span
								key={`sk-${i}`}
								className='inline-flex items-center gap-2 rounded-lg border border-border bg-surface-strong/70 px-3 py-1 text-xs font-mono'>
								<span>{skill}</span>
								<button
									type='button'
									onClick={() => handleRemoveSkill(i)}
									className='text-muted-foreground hover:text-destructive'>
									&times;
								</button>
							</span>
						))}
					</div>
					<div className='flex items-center gap-2 pt-1'>
						<Input
							value={newSkill}
							onChange={e => setNewSkill(e.target.value)}
							placeholder='Add featured skill (e.g. Next.js 16)…'
							className='h-9 text-xs font-mono'
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									handleAddSkill()
								}
							}}
						/>
						<Button
							type='button'
							variant='secondary'
							size='sm'
							onClick={handleAddSkill}
							className='shrink-0'>
							<Plus className='size-3.5' />
							<span>Add Skill</span>
						</Button>
					</div>
				</div>

				{/* Profile Visual Selection */}
				<div className='space-y-2 pt-2 border-t border-border'>
					<Label className='text-xs font-mono uppercase text-muted-foreground block'>
						Hero Profile Visual
					</Label>
					<div className='flex items-center gap-4'>
						<div className='size-20 rounded-2xl border border-border bg-surface-strong overflow-hidden relative grid place-items-center shrink-0'>
							{content.profileImageUrl ? (
								/* eslint-disable-next-line @next/next/no-img-element */
								<img
									src={content.profileImageUrl}
									alt='Hero Profile'
									className='size-full object-cover'
								/>
							) : (
								<ImageIcon className='size-6 text-muted-foreground/40' />
							)}
						</div>
						<div className='space-y-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setMediaModalOpen(true)}>
								<ImageIcon className='size-3.5' />
								<span>Select from S3 Media Library</span>
							</Button>
							<p className='font-mono text-[0.6875rem] text-muted-foreground'>
								Square aspect ratio (PNG / WebP)
							</p>
						</div>
					</div>
				</div>

				{/* Call to Action Buttons */}
				<div className='grid gap-6 sm:grid-cols-2 pt-2 border-t border-border'>
					<div className='space-y-3'>
						<span className='font-mono text-xs font-semibold text-foreground block uppercase'>
							Primary CTA Button
						</span>
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground'>Label</Label>
							<Input
								value={content.ctaLabel}
								onChange={e => handleChange('ctaLabel', e.target.value)}
								placeholder='Explore Selected Work'
							/>
						</div>
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground'>Target URL / Route</Label>
							<Input
								value={content.ctaUrl}
								onChange={e => handleChange('ctaUrl', e.target.value)}
								placeholder='#projects'
							/>
						</div>
					</div>

					<div className='space-y-3'>
						<span className='font-mono text-xs font-semibold text-foreground block uppercase'>
							Secondary CTA Button
						</span>
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground'>Label</Label>
							<Input
								value={content.secondaryCtaLabel ?? ''}
								onChange={e => handleChange('secondaryCtaLabel', e.target.value)}
								placeholder='Get In Touch'
							/>
						</div>
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground'>Target URL / Route</Label>
							<Input
								value={content.secondaryCtaUrl ?? ''}
								onChange={e => handleChange('secondaryCtaUrl', e.target.value)}
								placeholder='#contact'
							/>
						</div>
					</div>
				</div>
			</div>

			{/* S3 Media Picker Modal */}
			<MediaPickerModal
				open={mediaModalOpen}
				onOpenChange={setMediaModalOpen}
				title='Select Hero Profile Image'
				onSelect={media => {
					handleChange('profileImageUrl', media.url)
					handleChange('profileImageId', media.id)
				}}
			/>
		</SingletonEditor>
	)
}
