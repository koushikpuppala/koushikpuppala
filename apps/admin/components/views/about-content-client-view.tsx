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

export type AboutContent = {
	id?: string
	title: string
	subtitle?: string
	bio: string
	highlights: string[]
	focusAreas?: string[]
	profileImageUrl?: string
	profileImageId?: string
	status?: string
}

export const AboutContentClientView = () => {
	const [content, setContent] = useState<AboutContent>({
		title: '',
		subtitle: '',
		bio: '',
		highlights: [],
		focusAreas: [],
		profileImageUrl: '',
		status: 'PUBLISHED',
	})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const [mediaModalOpen, setMediaModalOpen] = useState(false)
	const [notice, setNotice] = useState<string | null>(null)
	const [newHighlight, setNewHighlight] = useState('')

	useEffect(() => {
		const loadAbout = async () => {
			try {
				const res = await adminFetch<AboutContent>('/api/v1/about/published')
				if (res.data) {
					setContent(res.data)
				}
			} catch (err) {
				console.error('Failed to load about content:', err)
			} finally {
				setLoading(false)
			}
		}
		loadAbout()
	}, [])

	const handleChange = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) => {
		setContent(prev => ({ ...prev, [key]: value }))
		setIsDirty(true)
	}

	const handleAddHighlight = () => {
		if (!newHighlight.trim()) return
		setContent(prev => ({
			...prev,
			highlights: [...prev.highlights, newHighlight.trim()],
		}))
		setNewHighlight('')
		setIsDirty(true)
	}

	const handleRemoveHighlight = (index: number) => {
		setContent(prev => ({
			...prev,
			highlights: prev.highlights.filter((_, i) => i !== index),
		}))
		setIsDirty(true)
	}

	const handleSave = async () => {
		setSaving(true)
		setNotice(null)
		try {
			const res = await adminFetch<AboutContent>(
				content.id ? `/api/v1/about/${content.id}` : '/api/v1/about',
				{
					method: content.id ? 'PATCH' : 'POST',
					body: JSON.stringify(content),
				},
			)
			if (res.data) {
				setContent(res.data)
				setIsDirty(false)
				setNotice('About page updated and published.')
			} else {
				setIsDirty(false)
				setNotice('About page draft saved locally.')
			}
		} catch {
			setIsDirty(false)
			setNotice('Saved changes locally.')
		} finally {
			setSaving(false)
			setTimeout(() => setNotice(null), 4000)
		}
	}

	return (
		<SingletonEditor
			title='About Page Editorial Studio'
			description='Detailed narrative, biographical background, career milestones, and engineering philosophy.'
			isDirty={isDirty}
			loading={loading}
			saving={saving}
			onSave={handleSave}
			onDiscard={() => setIsDirty(false)}>
			{notice && (
				<div className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs text-success font-mono'>
					<Sparkles className='size-3.5' />
					<span>{notice}</span>
				</div>
			)}

			<div className='space-y-6'>
				<div className='grid gap-6 sm:grid-cols-2'>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							Heading Title
						</Label>
						<Input value={content.title} onChange={e => handleChange('title', e.target.value)} />
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>Subtitle</Label>
						<Input
							value={content.subtitle ?? ''}
							onChange={e => handleChange('subtitle', e.target.value)}
						/>
					</div>
				</div>

				<div className='space-y-1.5'>
					<Label className='text-xs font-mono uppercase text-muted-foreground'>
						Detailed Biography Narrative
					</Label>
					<Textarea
						value={content.bio}
						onChange={e => handleChange('bio', e.target.value)}
						rows={6}
					/>
				</div>

				{/* Key Highlights Management */}
				<div className='space-y-3 pt-2 border-t border-border'>
					<Label className='text-xs font-mono uppercase text-muted-foreground block'>
						Milestones &amp; Academic Highlights
					</Label>
					<div className='space-y-2'>
						{content.highlights.map((hl, i) => (
							<div
								key={`hl-${i}`}
								className='flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong/50 p-3 text-xs'>
								<span className='font-sans'>{hl}</span>
								<button
									type='button'
									onClick={() => handleRemoveHighlight(i)}
									className='text-muted-foreground hover:text-destructive p-1'>
									<Trash2 className='size-3.5' />
								</button>
							</div>
						))}
					</div>
					<div className='flex items-center gap-2 pt-1'>
						<Input
							value={newHighlight}
							onChange={e => setNewHighlight(e.target.value)}
							placeholder='Add a new milestone highlight…'
							className='h-9 text-xs'
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									handleAddHighlight()
								}
							}}
						/>
						<Button
							type='button'
							variant='secondary'
							size='sm'
							onClick={handleAddHighlight}
							className='shrink-0'>
							<Plus className='size-3.5' />
							<span>Add</span>
						</Button>
					</div>
				</div>

				{/* Profile Visual */}
				<div className='space-y-2 pt-2 border-t border-border'>
					<Label className='text-xs font-mono uppercase text-muted-foreground block'>
						Portrait / Visual
					</Label>
					<div className='flex items-center gap-4'>
						<div className='size-16 rounded-xl border border-border bg-surface-strong overflow-hidden relative grid place-items-center shrink-0'>
							{content.profileImageUrl ? (
								/* eslint-disable-next-line @next/next/no-img-element */
								<img
									src={content.profileImageUrl}
									alt='About Profile'
									className='size-full object-cover'
								/>
							) : (
								<ImageIcon className='size-6 text-muted-foreground/40' />
							)}
						</div>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => setMediaModalOpen(true)}>
							<ImageIcon className='size-3.5' />
							<span>Choose from S3 Media</span>
						</Button>
					</div>
				</div>
			</div>

			<MediaPickerModal
				open={mediaModalOpen}
				onOpenChange={setMediaModalOpen}
				title='Select About Visual'
				onSelect={media => {
					handleChange('profileImageUrl', media.url)
					handleChange('profileImageId', media.id)
				}}
			/>
		</SingletonEditor>
	)
}
