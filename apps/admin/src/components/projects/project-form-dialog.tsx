'use client'

import type { SelectOption } from 'types/components'
import type { ProjectStatus } from 'types/enums'
import type { Project as ProjectRecord } from 'types/models'
import type { ProjectFormDialogProps, ProjectRow as Project } from 'types/components/admin'
import { useState } from 'react'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Select } from 'ui/select'
import { Textarea } from 'ui/textarea'
import { asList } from 'lib/form-values'
import { Field } from 'components/form/field'
import { useFormDialog } from 'lib/use-form-dialog'
import { FormDialog } from 'components/form/form-dialog'
import { CheckboxField } from 'components/form/checkbox-field'
import { MediaField } from 'components/form/media-field'
import { MediaPickerModal } from 'components/cms/media-picker-modal'
import { StringListField } from 'components/form/string-list-field'
import { PublishStateSelect } from 'components/form/publish-state-select'

const LIFECYCLES: SelectOption<ProjectStatus>[] = [
	{ label: 'COMPLETED', value: 'COMPLETED' },
	{ label: 'IN PROGRESS', value: 'IN_PROGRESS' },
	{ label: 'ARCHIVED', value: 'ARCHIVED' },
]

const COMPACT_SELECT = 'h-8 w-auto min-w-32 px-2.5 font-mono'

const toSlug = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')

const EMPTY: Partial<Project> = {
	title: '',
	slug: '',
	subtitle: '',
	category: 'Full Stack',
	projectType: 'Web Application',
	shortDescription: '',
	descriptions: [],
	caseStudy: '',
	tags: [],
	technologies: [],
	github: '',
	liveUrl: '',
	featured: false,
	lifecycle: 'COMPLETED',
	status: 'DRAFT',
}

const normalize = (project: Partial<Project>): Partial<Project> => ({
	...project,
	subtitle: project.subtitle || '',
	category: project.category || 'Full Stack',
	projectType: project.projectType || 'Web Application',
	descriptions: asList(project.descriptions),
	tags: asList(project.tags),
	technologies: asList(project.technologies),
	github: project.github || '',
})

const toPayload = (form: Partial<Project>): Partial<ProjectRecord> => {
	const descriptions = asList(form.descriptions)

	return {
		title: form.title || '',
		slug: form.slug || toSlug(form.title || ''),
		subtitle: form.subtitle || form.title || '',
		category: form.category || 'Full Stack',
		projectType: form.projectType || 'Web Application',
		shortDescription: form.shortDescription || '',
		descriptions: descriptions.length
			? descriptions
			: [form.shortDescription || form.title || 'Project showcase.'],
		caseStudy: form.caseStudy || null,
		tags: asList(form.tags),
		technologies: asList(form.technologies),
		github: form.github || null,
		liveUrl: form.liveUrl || null,
		thumbnailId: form.thumbnailId,
		status: form.lifecycle ?? 'COMPLETED',
		featured: Boolean(form.featured),
		isPublished: form.status === 'PUBLISHED',
	}
}

export const ProjectFormDialog = ({
	open,
	onOpenChange,
	project,
	onSave,
}: ProjectFormDialogProps) => {
	const [pickingCover, setPickingCover] = useState(false)
	const { form, setForm, setField, saving, saveError, submit } = useFormDialog({
		open,
		record: project,
		empty: EMPTY,
		normalize,
		toPayload,
		onSave,
		onOpenChange,
	})

	const changeTitle = (title: string) =>
		setForm(prev => ({
			...prev,
			title,
			slug: !prev.slug || prev.slug === toSlug(prev.title || '') ? toSlug(title) : prev.slug,
		}))

	return (
		<FormDialog
			open={open}
			onOpenChange={onOpenChange}
			title={project?.id ? 'Edit Project' : 'Create New Project'}
			description='Configure project metadata, technologies, and deployment links.'
			error={saveError}
			saving={saving}
			submitLabel='Save Project'
			onSubmit={submit}
			className='max-h-[88vh] max-w-2xl'
			aside={
				<MediaPickerModal
					open={pickingCover}
					onOpenChange={setPickingCover}
					title='Select Project Cover'
					onSelect={media =>
						setForm(prev => ({
							...prev,
							thumbnailId: media.id,
							thumbnail: { id: media.id, fileName: media.fileName, url: media.url },
						}))
					}
				/>
			}>
			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='projects-title' label='Title' required>
					<Input
						id='projects-title'
						value={form.title || ''}
						onChange={e => changeTitle(e.target.value)}
						required
						placeholder='e.g. ExpenseWise'
					/>
				</Field>
				<Field id='projects-slug' label='Slug' required>
					<Input
						id='projects-slug'
						value={form.slug || ''}
						onChange={e => setField('slug', e.target.value)}
						required
						placeholder='expensewise'
					/>
				</Field>
			</div>

			<div className='grid gap-4 sm:grid-cols-3'>
				<Field id='projects-subtitle' label='Subtitle'>
					<Input
						id='projects-subtitle'
						value={form.subtitle || ''}
						onChange={e => setField('subtitle', e.target.value)}
						placeholder='AI-Powered Financial Intelligence'
					/>
				</Field>
				<Field id='projects-category' label='Category'>
					<Input
						id='projects-category'
						value={form.category || ''}
						onChange={e => setField('category', e.target.value)}
						placeholder='FULL STACK & AI'
					/>
				</Field>
				<Field id='projects-project-type' label='Project Type'>
					<Input
						id='projects-project-type'
						value={form.projectType || ''}
						onChange={e => setField('projectType', e.target.value)}
						placeholder='Financial Platform'
					/>
				</Field>
			</div>

			<Field id='projects-short-summary' label='Short Summary'>
				<Input
					id='projects-short-summary'
					value={form.shortDescription || ''}
					onChange={e => setField('shortDescription', e.target.value)}
					placeholder='One sentence high-level summary…'
				/>
			</Field>

			<StringListField
				label='Detailed Overview Bullets'
				items={form.descriptions}
				onChange={items => setField('descriptions', items)}
				placeholder='Add feature/architecture description bullet…'
			/>

			<Field id='projects-case-study-narrative' label='Case Study Narrative'>
				<Textarea
					id='projects-case-study-narrative'
					value={form.caseStudy || ''}
					onChange={e => setField('caseStudy', e.target.value)}
					rows={4}
					placeholder='Architectural overview, key engineering decisions, throughput metrics…'
				/>
			</Field>

			<StringListField
				variant='chips'
				chipVariant='outline'
				label='Search & Filter Tags'
				items={form.tags}
				onChange={items => setField('tags', items)}
				placeholder='Add filter tag (e.g. Next.js 16, Redis)…'
			/>

			<StringListField
				variant='chips'
				label='Tech Stack Badges'
				items={form.technologies}
				onChange={items => setField('technologies', items)}
				placeholder='Add technology tag (e.g. Docker, PostgreSQL)…'
			/>

			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='projects-github-repository' label='GitHub Repository'>
					<Input
						id='projects-github-repository'
						value={form.github || ''}
						onChange={e => setField('github', e.target.value)}
						placeholder='https://github.com/…'
					/>
				</Field>
				<Field id='projects-live-production-url' label='Live Production URL'>
					<Input
						id='projects-live-production-url'
						value={form.liveUrl || ''}
						onChange={e => setField('liveUrl', e.target.value)}
						placeholder='https://…'
					/>
				</Field>
			</div>

			<MediaField
				label='Cover Visual'
				url={form.thumbnail?.url}
				alt='Cover'
				buttonLabel='Select Cover from S3'
				onPick={() => setPickingCover(true)}
			/>

			<div className='border-border flex items-center justify-between border-t pt-2'>
				<CheckboxField
					label='Feature on Homepage'
					checked={form.featured}
					onChange={checked => setField('featured', checked)}
					className='font-medium'
				/>

				<div className='flex items-center gap-2'>
					<Label htmlFor='projects-status' className='text-xs'>
						Status:
					</Label>
					<PublishStateSelect
						id='projects-status'
						value={form.status}
						onChange={value => setField('status', value)}
						className={COMPACT_SELECT}
					/>
				</div>

				<div className='flex items-center gap-2'>
					<Label htmlFor='projects-lifecycle' className='text-xs'>
						Lifecycle:
					</Label>
					<Select
						id='projects-lifecycle'
						value={form.lifecycle || 'COMPLETED'}
						onChange={value => setField('lifecycle', value)}
						options={LIFECYCLES}
						className={COMPACT_SELECT}
					/>
				</div>
			</div>
		</FormDialog>
	)
}
