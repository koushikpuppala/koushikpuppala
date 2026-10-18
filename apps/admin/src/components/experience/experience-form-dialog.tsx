'use client'

import type { SelectOption } from 'types/components'
import type { EmploymentType } from 'types/enums'
import type { ExperienceFormDialogProps, ExperienceRow as Experience } from 'types/components/admin'
import { Input } from 'ui/input'
import { Select } from 'ui/select'
import { DatePicker } from 'ui/date-picker'
import { Field } from 'components/form/field'
import { useFormDialog } from 'lib/use-form-dialog'
import { asList, dateValue } from 'lib/form-values'
import { FormDialog } from 'components/form/form-dialog'
import { CheckboxField } from 'components/form/checkbox-field'
import { StringListField } from 'components/form/string-list-field'
import { PublishStateSelect } from 'components/form/publish-state-select'

const EMPLOYMENT_TYPES: SelectOption<EmploymentType>[] = [
	{ label: 'Full time', value: 'FULL_TIME' },
	{ label: 'Part time', value: 'PART_TIME' },
	{ label: 'Internship', value: 'INTERN' },
	{ label: 'Contract', value: 'CONTRACT' },
	{ label: 'Freelance', value: 'FREELANCE' },
]

const EMPTY: Partial<Experience> = {
	organization: '',
	title: '',
	location: '',
	employmentType: 'FULL_TIME',
	startDate: '',
	endDate: '',
	isCurrent: false,
	featured: false,
	description: [],
	achievements: [],
	technologies: [],
	website: '',
	status: 'DRAFT',
}

const normalize = (experience: Partial<Experience>): Partial<Experience> => ({
	...experience,
	description: asList(experience.description),
	achievements: asList(experience.achievements),
	technologies: asList(experience.technologies),
	employmentType: experience.employmentType || 'FULL_TIME',
})

const toPayload = (form: Partial<Experience>): Partial<Experience> => ({
	...form,
	title: form.title || '',
	organization: form.organization || '',
	location: form.location || '',
	employmentType: form.employmentType || 'FULL_TIME',
	startDate: form.startDate || new Date().toISOString(),
	endDate: form.isCurrent ? null : form.endDate || null,
	isCurrent: Boolean(form.isCurrent),
	featured: Boolean(form.featured),
	description: asList(form.description),
	achievements: asList(form.achievements),
	technologies: asList(form.technologies),
	website: form.website || null,
	isPublished: form.status === 'PUBLISHED',
})

export const ExperienceFormDialog = ({
	open,
	onOpenChange,
	experience,
	onSave,
}: ExperienceFormDialogProps) => {
	const { form, setForm, setField, saving, saveError, submit } = useFormDialog({
		open,
		record: experience,
		empty: EMPTY,
		normalize,
		toPayload,
		onSave,
		onOpenChange,
	})

	return (
		<FormDialog
			open={open}
			onOpenChange={onOpenChange}
			title={experience?.id ? 'Edit Experience Record' : 'Add Experience Entry'}
			description='Add career milestones, roles, technologies, and achievements.'
			error={saveError}
			saving={saving}
			submitLabel='Save Experience'
			onSubmit={submit}>
			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='experience-organization' label='Organization' required>
					<Input
						id='experience-organization'
						value={form.organization || ''}
						onChange={e => setField('organization', e.target.value)}
						required
						placeholder='e.g. Upraised'
					/>
				</Field>
				<Field id='experience-role-title' label='Role Title' required>
					<Input
						id='experience-role-title'
						value={form.title || ''}
						onChange={e => setField('title', e.target.value)}
						required
						placeholder='e.g. Software Engineer'
					/>
				</Field>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='experience-location' label='Location'>
					<Input
						id='experience-location'
						value={form.location || ''}
						onChange={e => setField('location', e.target.value)}
						placeholder='Bengaluru, Karnataka, India'
					/>
				</Field>
				<Field id='experience-employment-type' label='Employment Type'>
					<Select
						id='experience-employment-type'
						value={form.employmentType || 'FULL_TIME'}
						onChange={value => setField('employmentType', value)}
						options={EMPLOYMENT_TYPES}
					/>
				</Field>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='experience-start-date' label='Start Date' required>
					<DatePicker
						id='experience-start-date'
						value={dateValue(form.startDate)}
						onChange={value => setField('startDate', value)}
						required
					/>
				</Field>
				<Field id='experience-end-date' label='End Date'>
					<DatePicker
						id='experience-end-date'
						value={dateValue(form.endDate)}
						min={dateValue(form.startDate) || undefined}
						disabled={Boolean(form.isCurrent)}
						onChange={value => setField('endDate', value)}
					/>
				</Field>
			</div>

			<Field id='experience-website-url' label='Organization Website URL'>
				<Input
					id='experience-website-url'
					value={form.website || ''}
					onChange={e => setField('website', e.target.value)}
					placeholder='https://upraised.co'
				/>
			</Field>

			<div className='flex items-center justify-between pt-1'>
				<CheckboxField
					label='Currently working here'
					checked={form.isCurrent}
					onChange={checked =>
						setForm(prev => ({
							...prev,
							isCurrent: checked,
							endDate: checked ? null : prev.endDate,
						}))
					}
				/>
				<CheckboxField
					label='Feature on portfolio'
					checked={form.featured}
					onChange={checked => setField('featured', checked)}
				/>
			</div>

			<Field id='experience-status' label='Status'>
				<PublishStateSelect
					id='experience-status'
					value={form.status}
					onChange={value => setField('status', value)}
				/>
			</Field>

			<StringListField
				label='Role Responsibilities'
				items={form.description}
				onChange={items => setField('description', items)}
				placeholder='Add role responsibility bullet…'
			/>

			<StringListField
				label='Measurable Achievements'
				items={form.achievements}
				onChange={items => setField('achievements', items)}
				placeholder='Add measurable impact bullet…'
			/>

			<StringListField
				variant='chips'
				label='Technologies Used'
				items={form.technologies}
				onChange={items => setField('technologies', items)}
				placeholder='Add technology (e.g. Next.js, PostgreSQL)…'
			/>
		</FormDialog>
	)
}
