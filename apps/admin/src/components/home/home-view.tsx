'use client'

import type { HomeContent } from 'types/models'
import { useState } from 'react'
import { Input } from 'ui/input'
import { Textarea } from 'ui/textarea'
import { DTO_FIELDS } from 'types/api'
import { pickFields } from 'lib/utils'
import { asList } from 'lib/form-values'
import { homeActions } from 'actions/home'
import { Notice } from 'components/cms/notice'
import { Field } from 'components/form/field'
import { MediaField } from 'components/form/media-field'
import { SingletonFormSkeleton } from 'components/skeletons'
import { useSingletonEditor } from 'lib/use-singleton-editor'
import { SingletonEditor } from 'components/cms/singleton-editor'
import { MediaPickerModal } from 'components/cms/media-picker-modal'
import { StringListField } from 'components/form/string-list-field'

const EMPTY: HomeContent = {
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
}

const fromRecord = (home: HomeContent): HomeContent => ({
	id: home.id,
	title: home.title || '',
	separator: home.separator || '|',
	subtitles: asList(home.subtitles),
	content: home.content || '',
	ctaLabel: home.ctaLabel || '',
	ctaUrl: home.ctaUrl || '',
	secondaryCtaLabel: home.secondaryCtaLabel || '',
	secondaryCtaUrl: home.secondaryCtaUrl || '',
	featuredSkills: asList(home.featuredSkills),
	stats: home.stats || null,
	profileImageId: home.profileImageId,
	profileImageUrl: home.profileImage?.url || '',
	isPublished: Boolean(home.isPublished),
})

const toPayload = ({ stats, ...rest }: HomeContent) =>
	pickFields(stats ? { ...rest, stats } : rest, DTO_FIELDS.home)

export const HomeView = () => {
	const [pickingImage, setPickingImage] = useState(false)
	const editor = useSingletonEditor({
		actions: homeActions,
		empty: EMPTY,
		fromRecord,
		toPayload,
		validate: home => (home.title.trim() ? null : 'Hero title is required.'),
		label: 'Homepage',
		loadError: 'Failed to load homepage content from API.',
		saveError: 'Failed to save homepage content.',
	})
	const { content, change, update } = editor

	return (
		<SingletonEditor
			skeleton={<SingletonFormSkeleton layout='home' />}
			title='Homepage Editorial Studio'
			description='Authoritative display title, subtitles, separator, hero bio narrative, CTA routes, and featured skills.'
			isDirty={editor.isDirty}
			loading={editor.loading}
			saving={editor.saving}
			error={editor.error}
			onRetry={editor.reload}
			onSave={editor.save}
			onDiscard={editor.discard}
			isPublished={Boolean(content.isPublished)}
			canPublish={Boolean(content.id)}
			publishing={editor.publishing}
			onTogglePublish={editor.togglePublish}>
			<Notice message={editor.notice} />

			<div className='space-y-6'>
				<div className='grid gap-6 sm:grid-cols-3'>
					<Field
						variant='editor'
						id='home-title'
						label='Hero Display Name / Title'
						required
						className='sm:col-span-2'>
						<Input
							id='home-title'
							value={content.title}
							onChange={e => change('title', e.target.value)}
							required
							placeholder='e.g. KOUSHIK PUPPALA'
						/>
					</Field>
					<Field variant='editor' id='home-separator' label='Status Separator'>
						<Input
							id='home-separator'
							value={content.separator ?? '|'}
							onChange={e => change('separator', e.target.value)}
							placeholder='|'
						/>
					</Field>
				</div>

				<div className='border-border border-t pt-2'>
					<StringListField
						label='Role Subtitles / Rotating Badges'
						items={content.subtitles}
						onChange={items => change('subtitles', items)}
						placeholder='Add a new role subtitle…'
					/>
				</div>

				<Field
					variant='editor'
					id='home-content'
					label='Hero Main Bio / Systems Philosophy Content'
					className='border-border border-t pt-2'>
					<Textarea
						id='home-content'
						value={content.content}
						onChange={e => change('content', e.target.value)}
						rows={4}
						placeholder='Architecting resilient distributed platforms…'
					/>
				</Field>

				<div className='border-border border-t pt-2'>
					<StringListField
						variant='chips'
						label='Featured Stack Badges'
						items={content.featuredSkills}
						onChange={items => change('featuredSkills', items)}
						placeholder='Add featured skill (e.g. Next.js 16)…'
					/>
				</div>

				<div className='border-border border-t pt-2'>
					<MediaField
						variant='large'
						label='Hero Profile Visual'
						url={content.profileImageUrl}
						alt='Hero Profile'
						buttonLabel='Select from S3 Media Library'
						hint='Square aspect ratio (PNG / WebP)'
						onPick={() => setPickingImage(true)}
					/>
				</div>

				<div className='border-border grid gap-6 border-t pt-2 sm:grid-cols-2'>
					<div className='space-y-3'>
						<span className='text-foreground block font-mono text-xs font-semibold uppercase'>
							Primary CTA Button
						</span>
						<Field id='home-cta-label' label='Label'>
							<Input
								id='home-cta-label'
								value={content.ctaLabel}
								onChange={e => change('ctaLabel', e.target.value)}
								placeholder='Explore Selected Work'
							/>
						</Field>
						<Field id='home-cta-url' label='Target URL / Route'>
							<Input
								id='home-cta-url'
								value={content.ctaUrl}
								onChange={e => change('ctaUrl', e.target.value)}
								placeholder='#projects'
							/>
						</Field>
					</div>

					<div className='space-y-3'>
						<span className='text-foreground block font-mono text-xs font-semibold uppercase'>
							Secondary CTA Button
						</span>
						<Field id='home-secondary-cta-label' label='Label'>
							<Input
								id='home-secondary-cta-label'
								value={content.secondaryCtaLabel ?? ''}
								onChange={e => change('secondaryCtaLabel', e.target.value)}
								placeholder='Get In Touch'
							/>
						</Field>
						<Field id='home-secondary-cta-url' label='Target URL / Route'>
							<Input
								id='home-secondary-cta-url'
								value={content.secondaryCtaUrl ?? ''}
								onChange={e => change('secondaryCtaUrl', e.target.value)}
								placeholder='#contact'
							/>
						</Field>
					</div>
				</div>
			</div>

			<MediaPickerModal
				open={pickingImage}
				onOpenChange={setPickingImage}
				title='Select Hero Profile Image'
				onSelect={media =>
					update(current => ({ ...current, profileImageUrl: media.url, profileImageId: media.id }))
				}
			/>
		</SingletonEditor>
	)
}
