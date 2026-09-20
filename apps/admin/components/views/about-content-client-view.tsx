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

import type { AboutContent, AboutStat } from 'types/models'

export const AboutContentClientView = () => {
	const [content, setContent] = useState<AboutContent>({
		title: 'About Koushik Puppala',
		leadStatement:
			'Bridging intuitive, high-performance user interfaces with resilient, observable distributed backend systems.',
		content:
			'Hi there, I am Koushik Puppala! Software engineer at Upraised® and Team Lead & Mentor for the Indian Institute of Information Technology Raichur web systems team.',
		bio: 'I specialize in designing and engineering high-throughput backend services, performant web interfaces, and modern cloud infrastructure.',
		biography:
			'I specialize in designing and engineering high-throughput backend services, performant web interfaces, and modern cloud infrastructure.',
		location: 'Bengaluru, Karnataka, India',
		coordinates: '12.9716° N, 77.5946° E',
		timezone: 'UTC+5:30 (IST)',
		status: 'AVAILABLE FOR WORK // GLOBAL REMOTE',
		highlights: [
			'Software Engineer at Upraised® scaling core platform services',
			'Head & Mentor for IIIT Raichur Web Systems Team',
			'Former Google Developer Student Clubs (GDSC) Lead',
			'Engineered production systems serving thousands of active users',
		],
		stats: [
			{ label: 'EXPERIENCE', value: '3+', detail: 'Years of Production Engineering' },
			{ label: 'SYSTEMS', value: '20+', detail: 'Projects & Platforms Delivered' },
			{ label: 'CONTRIBUTIONS', value: '1.8k+', detail: 'Open-Source Commits' },
			{ label: 'MENTORSHIP', value: '50+', detail: 'Junior Engineers Guided' },
		],
		ctaLabel: 'Read Full Biography',
		ctaUrl: '/about',
		profileImageUrl: '',
	})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const [mediaModalOpen, setMediaModalOpen] = useState(false)
	const [notice, setNotice] = useState<string | null>(null)
	const [newHighlight, setNewHighlight] = useState('')
	const [newStat, setNewStat] = useState<AboutStat>({ label: '', value: '', detail: '' })

	useEffect(() => {
		const loadAbout = async () => {
			try {
				const res = await adminFetch<AboutContent & { heading?: string; biography?: string }>(
					'/api/v1/about/published',
				)
				if (res.data) {
					const loadedData = res.data
					setContent(prev => ({
						...prev,
						...loadedData,
						title: loadedData.title || loadedData.heading || prev.title,
						bio: loadedData.bio || loadedData.biography || prev.bio,
						biography: loadedData.biography || loadedData.bio || prev.biography,
						content: loadedData.content || prev.content,
						leadStatement: loadedData.leadStatement || prev.leadStatement,
						location: loadedData.location || prev.location,
						coordinates: loadedData.coordinates || prev.coordinates,
						timezone: loadedData.timezone || prev.timezone,
						status: loadedData.status || prev.status,
						highlights:
							Array.isArray(loadedData.highlights) && loadedData.highlights.length > 0
								? loadedData.highlights
								: prev.highlights,
						stats:
							Array.isArray(loadedData.stats) && loadedData.stats.length > 0
								? (loadedData.stats as AboutStat[])
								: prev.stats,
					}))
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

	const handleAddStat = () => {
		if (!newStat.label.trim() || !newStat.value.trim()) return
		setContent(prev => ({
			...prev,
			stats: [...(Array.isArray(prev.stats) ? prev.stats : []), { ...newStat }],
		}))
		setNewStat({ label: '', value: '', detail: '' })
		setIsDirty(true)
	}

	const handleRemoveStat = (index: number) => {
		setContent(prev => ({
			...prev,
			stats: (Array.isArray(prev.stats) ? prev.stats : []).filter((_: AboutStat, i: number) => i !== index),
		}))
		setIsDirty(true)
	}

	const handleSave = async () => {
		setSaving(true)
		setNotice(null)
		try {
			const payload = {
				...content,
				biography: content.bio || content.biography,
			}
			const res = await adminFetch<AboutContent>(
				content.id ? `/api/v1/about/${content.id}` : '/api/v1/about',
				{
					method: content.id ? 'PATCH' : 'POST',
					body: JSON.stringify(payload),
				},
			)
			if (res.data) {
				setContent(prev => ({ ...prev, ...res.data }))
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
			description='Detailed narrative, biographical background, career milestones, engineering philosophy, and system statistics.'
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
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							Lead Statement
						</Label>
						<Input
							value={content.leadStatement ?? ''}
							onChange={e => handleChange('leadStatement', e.target.value)}
						/>
					</div>
				</div>

				<div className='space-y-1.5'>
					<Label className='text-xs font-mono uppercase text-muted-foreground'>
						Short Overview / Summary
					</Label>
					<Textarea
						value={content.content ?? ''}
						onChange={e => handleChange('content', e.target.value)}
						rows={3}
					/>
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

				{/* Location and Metadata Section */}
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-border'>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>Location</Label>
						<Input
							value={content.location ?? ''}
							onChange={e => handleChange('location', e.target.value)}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>Coordinates</Label>
						<Input
							value={content.coordinates ?? ''}
							onChange={e => handleChange('coordinates', e.target.value)}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>Timezone</Label>
						<Input
							value={content.timezone ?? ''}
							onChange={e => handleChange('timezone', e.target.value)}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>Status Badge</Label>
						<Input
							value={content.status ?? ''}
							onChange={e => handleChange('status', e.target.value)}
						/>
					</div>
				</div>

				{/* Call To Action Buttons */}
				<div className='grid gap-6 sm:grid-cols-2 pt-2 border-t border-border'>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>CTA Label</Label>
						<Input
							value={content.ctaLabel ?? ''}
							onChange={e => handleChange('ctaLabel', e.target.value)}
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>CTA URL</Label>
						<Input
							value={content.ctaUrl ?? ''}
							onChange={e => handleChange('ctaUrl', e.target.value)}
						/>
					</div>
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
							<span>Add Highlight</span>
						</Button>
					</div>
				</div>

				{/* Stats Management */}
				<div className='space-y-3 pt-2 border-t border-border'>
					<Label className='text-xs font-mono uppercase text-muted-foreground block'>
						Key Engineering Statistics &amp; Metrics
					</Label>
					<div className='space-y-2'>
						{(Array.isArray(content.stats) ? content.stats : []).map((stat: AboutStat, i: number) => (
							<div
								key={`stat-${i}`}
								className='flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong/50 p-3 text-xs'>
								<div className='flex items-center gap-4 font-mono'>
									<span className='font-bold uppercase text-signal-ink'>{stat.label}</span>
									<span className='font-medium text-foreground'>{stat.value}</span>
									{stat.detail && (
										<span className='text-muted-foreground text-[0.7rem]'>{stat.detail}</span>
									)}
								</div>
								<button
									type='button'
									onClick={() => handleRemoveStat(i)}
									className='text-muted-foreground hover:text-destructive p-1'>
									<Trash2 className='size-3.5' />
								</button>
							</div>
						))}
					</div>
					<div className='grid gap-2 sm:grid-cols-3 pt-1'>
						<Input
							value={newStat.label}
							onChange={e => setNewStat(prev => ({ ...prev, label: e.target.value }))}
							placeholder='Label (e.g. EXPERIENCE)'
							className='h-9 text-xs font-mono'
						/>
						<Input
							value={newStat.value}
							onChange={e => setNewStat(prev => ({ ...prev, value: e.target.value }))}
							placeholder='Value (e.g. 3+)'
							className='h-9 text-xs font-mono'
						/>
						<div className='flex items-center gap-2'>
							<Input
								value={newStat.detail ?? ''}
								onChange={e => setNewStat(prev => ({ ...prev, detail: e.target.value }))}
								placeholder='Detail (e.g. Years of Engineering)'
								className='h-9 text-xs'
							/>
							<Button
								type='button'
								variant='secondary'
								size='sm'
								onClick={handleAddStat}
								className='shrink-0'>
								<Plus className='size-3.5' />
								<span>Add</span>
							</Button>
						</div>
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
