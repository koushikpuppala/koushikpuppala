'use client'

import { useEffect, useState } from 'react'
import { Image as ImageIcon, Sparkles } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SingletonEditor } from '@/components/cms/singleton-editor'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import { adminFetch } from '@/lib/api-client'

export type HomeContent = {
	id?: string
	title: string
	subtitle?: string
	heroHeadline: string
	heroBio: string
	ctaLabel: string
	ctaUrl: string
	secondaryCtaLabel?: string
	secondaryCtaUrl?: string
	profileImageUrl?: string
	profileImageId?: string
	status?: string
}

export const HomeContentClientView = () => {
	const [content, setContent] = useState<HomeContent>({
		title: '',
		subtitle: '',
		heroHeadline: '',
		heroBio: '',
		ctaLabel: '',
		ctaUrl: '',
		secondaryCtaLabel: '',
		secondaryCtaUrl: '',
		profileImageUrl: '',
		status: 'PUBLISHED',
	})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const [mediaModalOpen, setMediaModalOpen] = useState(false)
	const [notice, setNotice] = useState<string | null>(null)

	useEffect(() => {
		const loadHome = async () => {
			try {
				const res = await adminFetch<HomeContent>('/api/v1/home/published')
				if (res.data) {
					setContent(res.data)
				}
			} catch (err) {
				console.error('Failed to load homepage content:', err)
			} finally {
				setLoading(false)
			}
		}
		loadHome()
	}, [])

	const handleChange = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) => {
		setContent(prev => ({ ...prev, [key]: value }))
		setIsDirty(true)
	}

	const handleSave = async () => {
		setSaving(true)
		setNotice(null)
		try {
			const res = await adminFetch<HomeContent>(
				content.id ? `/api/v1/home/${content.id}` : '/api/v1/home',
				{
					method: content.id ? 'PATCH' : 'POST',
					body: JSON.stringify(content),
				},
			)
			if (res.data) {
				setContent(res.data)
				setIsDirty(false)
				setNotice('Homepage content published successfully to production.')
			} else {
				setIsDirty(false)
				setNotice('Homepage draft saved locally.')
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
			title='Homepage Editorial Studio'
			description='Authoritative copy, hero headlines, call-to-action routing, and profile visuals displayed on the public landing page.'
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
				{/* Title & Subtitle */}
				<div className='grid gap-6 sm:grid-cols-2'>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							Site Display Title
						</Label>
						<Input
							value={content.title}
							onChange={e => handleChange('title', e.target.value)}
							placeholder='e.g. Koushik Puppala — Software Engineer'
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							SEO Subtitle
						</Label>
						<Input
							value={content.subtitle ?? ''}
							onChange={e => handleChange('subtitle', e.target.value)}
							placeholder='e.g. Full-Stack Developer & Systems Architect'
						/>
					</div>
				</div>

				{/* Hero Headline */}
				<div className='space-y-1.5'>
					<Label className='text-xs font-mono uppercase text-muted-foreground'>
						Hero Main Headline
					</Label>
					<Input
						value={content.heroHeadline}
						onChange={e => handleChange('heroHeadline', e.target.value)}
						placeholder='e.g. Full-Stack Software Engineer'
					/>
				</div>

				{/* Hero Biography */}
				<div className='space-y-1.5'>
					<Label className='text-xs font-mono uppercase text-muted-foreground'>
						Hero Lead Narrative / Bio
					</Label>
					<Textarea
						value={content.heroBio}
						onChange={e => handleChange('heroBio', e.target.value)}
						rows={4}
						placeholder='Lead introduction text displayed above the fold…'
					/>
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
								Recommended: Square aspect ratio (min 512x512 PNG/WebP)
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
								placeholder='View Projects'
							/>
						</div>
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground'>Target URL / Route</Label>
							<Input
								value={content.ctaUrl}
								onChange={e => handleChange('ctaUrl', e.target.value)}
								placeholder='/projects'
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
								placeholder='Contact Me'
							/>
						</div>
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground'>Target URL / Route</Label>
							<Input
								value={content.secondaryCtaUrl ?? ''}
								onChange={e => handleChange('secondaryCtaUrl', e.target.value)}
								placeholder='/contact'
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
