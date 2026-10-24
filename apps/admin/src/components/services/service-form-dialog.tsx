'use client'

import type { ServiceFormDialogProps, ServiceRow as Service } from 'types/components/admin'
import { Input } from 'ui/input'
import { Textarea } from 'ui/textarea'
import { asList } from 'lib/form-values'
import { Field } from 'components/form/field'
import { useFormDialog } from 'lib/use-form-dialog'
import { FormDialog } from 'components/form/form-dialog'
import { StringListField } from 'components/form/string-list-field'
import { PublishStateSelect } from 'components/form/publish-state-select'

const EMPTY: Partial<Service> = { title: '', description: '', features: [], status: 'DRAFT' }

const normalize = (service: Partial<Service>): Partial<Service> => ({
	...service,
	features: asList(service.features),
})

const toPayload = (form: Partial<Service>): Partial<Service> => ({
	title: form.title || '',
	description: form.description || '',
	features: asList(form.features),
	isPublished: form.status === 'PUBLISHED',
})

export const ServiceFormDialog = ({
	open,
	onOpenChange,
	service,
	onSave,
}: ServiceFormDialogProps) => {
	const { form, setField, saving, saveError, submit } = useFormDialog({
		open,
		record: service,
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
			title={service?.id ? 'Edit Service' : 'Add Competency / Service'}
			description='Define service title, description, features, and visibility.'
			error={saveError}
			saving={saving}
			submitLabel='Save Service'
			onSubmit={submit}
			className='max-w-md'>
			<Field id='services-service-title' label='Service Title' required>
				<Input
					id='services-service-title'
					value={form.title || ''}
					onChange={e => setField('title', e.target.value)}
					required
					placeholder='e.g. Full-Stack Web Development'
				/>
			</Field>

			<Field id='services-description' label='Description' required>
				<Textarea
					id='services-description'
					value={form.description || ''}
					onChange={e => setField('description', e.target.value)}
					rows={3}
					required
					placeholder='Scope of work, deliverables, and engineering practices…'
				/>
			</Field>

			<StringListField
				label='Key Feature Deliverables'
				items={form.features}
				onChange={items => setField('features', items)}
				placeholder='Add feature highlight…'
			/>

			<Field id='services-status' label='Status'>
				<PublishStateSelect
					id='services-status'
					value={form.status}
					onChange={value => setField('status', value)}
				/>
			</Field>
		</FormDialog>
	)
}
