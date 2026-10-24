'use client'

import type { AboutContent, AboutStat } from 'types/models'
import { useState } from 'react'
import { Input } from 'ui/input'
import { Textarea } from 'ui/textarea'
import { DTO_FIELDS } from 'types/api'
import { pickFields } from 'lib/utils'
import { asList } from 'lib/form-values'
import { aboutActions } from 'actions/about'
import { Notice } from 'components/cms/notice'
import { Field } from 'components/form/field'
import { AboutStatsField } from './about-stats-field'
import { MediaField } from 'components/form/media-field'
import { SingletonFormSkeleton } from 'components/skeletons'
import { useSingletonEditor } from 'lib/use-singleton-editor'
import { SingletonEditor } from 'components/cms/singleton-editor'
import { MediaPickerModal } from 'components/cms/media-picker-modal'
import { StringListField } from 'components/form/string-list-field'

const EMPTY: AboutContent = {
	title: '',
	leadStatement: '',
	content: '',
	biography: '',
	location: '',
	coordinates: '',
	timezone: '',
	status: '',
	highlights: [],
	stats: [],
	ctaLabel: '',
	ctaUrl: '',
	profileImageUrl: '',
	isPublished: false,
}

const fromRecord = (about: AboutContent): AboutContent => ({
	id: about.id,
	title: about.title || '',
	leadStatement: about.leadStatement || '',
	content: about.content || '',
	biography: about.biography || '',
	location: about.location || '',
	coordinates: about.coordinates || '',
	timezone: about.timezone || '',
	status: about.status || '',
	highlights: asList(about.highlights),
	stats: Array.isArray(about.stats) ? (about.stats as AboutStat[]) : [],
	ctaLabel: about.ctaLabel || '',
	ctaUrl: about.ctaUrl || '',
	profileImageId: about.profileImageId,
	profileImageUrl: about.profileImage?.url || '',
	isPublished: Boolean(about.isPublished),
})

const toPayload = (content: AboutContent) => pickFields(content, DTO_FIELDS.about)

const TEXT_FIELDS: Array<[keyof AboutContent, string, string]> = [
	['location', 'about-location', 'Location'],
	['coordinates', 'about-coordinates', 'Coordinates'],
	['timezone', 'about-timezone', 'Timezone'],
	['status', 'about-status-badge', 'Status Badge'],
]

export const AboutView = () => {
	const [pickingImage, setPickingImage] = useState(false)
	const editor = useSingletonEditor({
		actions: aboutActions,
		empty: EMPTY,
		fromRecord,
		toPayload,
		validate: about => (about.title.trim() ? null : 'Heading title is required.'),
		label: 'About page',
		loadError: 'Failed to load about content from API.',
		saveError: 'Failed to save about content.',
	})
	const { content, change, update } = editor

	const text = (key: keyof AboutContent) => ({
		value: (content[key] as string | null | undefined) ?? '',
		onChange: (value: string) => change(key, value),
	})

	return (
		<SingletonEditor
			skeleton={<SingletonFormSkeleton layout='about' />}
			title='About Page Editorial Studio'
			description='Detailed narrative, biographical background, career milestones, engineering philosophy, and system statistics.'
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
				<div className='grid gap-6 sm:grid-cols-2'>
					<Field variant='editor' id='about-heading-title' label='Heading Title' required>
						<Input
							id='about-heading-title'
							value={content.title}
							onChange={e => change('title', e.target.value)}
							required
						/>
					</Field>
					<Field variant='editor' id='about-lead-statement' label='Lead Statement'>
						<Input
							id='about-lead-statement'
							value={content.leadStatement ?? ''}
							onChange={e => change('leadStatement', e.target.value)}
						/>
					</Field>
				</div>

				<Field variant='editor' id='about-short-overview-summary' label='Short Overview / Summary'>
					<Textarea
						id='about-short-overview-summary'
						value={content.content ?? ''}
						onChange={e => change('content', e.target.value)}
						rows={3}
					/>
				</Field>

				<Field
					variant='editor'
					id='about-detailed-biography-narrative'
					label='Detailed Biography Narrative'>
					<Textarea
						id='about-detailed-biography-narrative'
						value={content.biography}
						onChange={e => change('biography', e.target.value)}
						rows={6}
					/>
				</Field>

				<div className='border-border grid gap-4 border-t pt-2 sm:grid-cols-2 lg:grid-cols-4'>
					{TEXT_FIELDS.map(([key, id, label]) => {
						const field = text(key)

						return (
							<Field key={id} variant='editor' id={id} label={label}>
								<Input id={id} value={field.value} onChange={e => field.onChange(e.target.value)} />
							</Field>
						)
					})}
				</div>

				<div className='border-border grid gap-6 border-t pt-2 sm:grid-cols-2'>
					<Field variant='editor' id='about-cta-label' label='CTA Label'>
						<Input
							id='about-cta-label'
							value={content.ctaLabel ?? ''}
							onChange={e => change('ctaLabel', e.target.value)}
						/>
					</Field>
					<Field variant='editor' id='about-cta-url' label='CTA URL'>
						<Input
							id='about-cta-url'
							value={content.ctaUrl ?? ''}
							onChange={e => change('ctaUrl', e.target.value)}
						/>
					</Field>
				</div>

				<div className='border-border border-t pt-2'>
					<StringListField
						label='How I work (the "How I work" list on the About page)'
						items={content.highlights}
						onChange={items => change('highlights', items)}
						placeholder='Add a way you work…'
					/>
				</div>

				<AboutStatsField
					stats={Array.isArray(content.stats) ? (content.stats as AboutStat[]) : []}
					onChange={stats => change('stats', stats)}
				/>

				<div className='border-border border-t pt-2'>
					<MediaField
						variant='large'
						label='Portrait / Visual'
						url={content.profileImageUrl}
						alt='About Profile'
						buttonLabel='Choose from S3 Media'
						onPick={() => setPickingImage(true)}
					/>
				</div>
			</div>

			<MediaPickerModal
				open={pickingImage}
				onOpenChange={setPickingImage}
				title='Select About Visual'
				onSelect={media =>
					update(current => ({ ...current, profileImageUrl: media.url, profileImageId: media.id }))
				}
			/>
		</SingletonEditor>
	)
}
