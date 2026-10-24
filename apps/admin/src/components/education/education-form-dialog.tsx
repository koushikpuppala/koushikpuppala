'use client'

import type { EducationFormDialogProps, EducationRow as Education } from 'types/components/admin'
import { Input } from 'ui/input'
import { DatePicker } from 'ui/date-picker'
import { Field } from 'components/form/field'
import { FormDialog } from 'components/form/form-dialog'
import { useFormDialog } from 'lib/use-form-dialog'
import { StringListField } from 'components/form/string-list-field'
import { PublishStateSelect } from 'components/form/publish-state-select'
import { asList, dateValue } from 'lib/form-values'

const EMPTY: Partial<Education> = {
	university: '',
	degree: '',
	fieldOfStudy: '',
	location: '',
	startDate: '',
	endDate: '',
	isCurrent: false,
	description: [],
	achievements: [],
	website: '',
	status: 'DRAFT',
}

const normalize = (education: Partial<Education>): Partial<Education> => ({
	...education,
	description: asList(education.description),
	achievements: asList(education.achievements),
})

const toPayload = (form: Partial<Education>): Partial<Education> => ({
	...form,
	degree: form.degree || '',
	fieldOfStudy: form.fieldOfStudy || '',
	university: form.university || '',
	location: form.location || '',
	startDate: form.startDate || new Date().toISOString(),
	endDate: form.isCurrent ? null : form.endDate || null,
	isCurrent: Boolean(form.isCurrent),
	description: asList(form.description),
	achievements: asList(form.achievements),
	website: form.website || null,
	isPublished: form.status === 'PUBLISHED',
})

export const EducationFormDialog = ({
	open,
	onOpenChange,
	education,
	onSave,
}: EducationFormDialogProps) => {
	const { form, setField, saving, saveError, submit } = useFormDialog({
		open,
		record: education,
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
			title={education?.id ? 'Edit Education Record' : 'Add Academic Qualification'}
			description='Institution, degree, coursework, and honors.'
			error={saveError}
			saving={saving}
			submitLabel='Save Education'
			onSubmit={submit}>
			<Field
				id='education-university-institution-name'
				label='University / Institution Name'
				required>
				<Input
					id='education-university-institution-name'
					value={form.university || ''}
					onChange={e => setField('university', e.target.value)}
					required
					placeholder='e.g. Indian Institute of Information Technology Raichur'
				/>
			</Field>

			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='education-degree' label='Degree' required>
					<Input
						id='education-degree'
						value={form.degree || ''}
						onChange={e => setField('degree', e.target.value)}
						required
						placeholder='Bachelor of Technology (B.Tech)'
					/>
				</Field>
				<Field id='education-major-field-of-study' label='Major / Field of Study'>
					<Input
						id='education-major-field-of-study'
						value={form.fieldOfStudy || ''}
						onChange={e => setField('fieldOfStudy', e.target.value)}
						placeholder='Computer Science and Engineering'
					/>
				</Field>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='education-location' label='Location'>
					<Input
						id='education-location'
						value={form.location || ''}
						onChange={e => setField('location', e.target.value)}
						placeholder='Raichur, Karnataka, India'
					/>
				</Field>
				<Field id='education-website-url' label='Website URL'>
					<Input
						id='education-website-url'
						value={form.website || ''}
						onChange={e => setField('website', e.target.value)}
						placeholder='https://iiitr.ac.in'
					/>
				</Field>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<Field id='education-start-date' label='Start Date' required>
					<DatePicker
						id='education-start-date'
						value={dateValue(form.startDate)}
						onChange={value => setField('startDate', value)}
						required
					/>
				</Field>
				<Field id='education-graduation-end-date' label='Graduation / End Date'>
					<DatePicker
						id='education-graduation-end-date'
						value={dateValue(form.endDate)}
						min={dateValue(form.startDate) || undefined}
						onChange={value => setField('endDate', value)}
					/>
				</Field>
			</div>

			<Field id='education-status' label='Status'>
				<PublishStateSelect
					id='education-status'
					value={form.status}
					onChange={value => setField('status', value)}
				/>
			</Field>

			<StringListField
				label='Coursework & Overview Bullets'
				items={form.description}
				onChange={items => setField('description', items)}
				placeholder='Add coursework bullet…'
			/>

			<StringListField
				label='Academic Achievements'
				items={form.achievements}
				onChange={items => setField('achievements', items)}
				placeholder='Add academic honor or leadership milestone…'
			/>
		</FormDialog>
	)
}
