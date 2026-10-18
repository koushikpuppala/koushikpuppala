'use client'

import type { CreateUserPayload, UserRecord } from 'types/api'
import type { UserCreateDialogProps } from 'types/components/admin'
import { useEffect, type ChangeEvent } from 'react'
import { Input } from 'ui/input'
import { Select } from 'ui/select'
import { usersActions } from 'actions/users'
import { Field } from 'components/form/field'
import { createUserSchema } from 'validations/user'
import { useFormReducer } from 'utils/useFormReducer'
import { FormDialog } from 'components/form/form-dialog'
import { ROLE_OPTIONS, STATUS_OPTIONS } from './user-options'

const INITIAL: CreateUserPayload = {
	fullName: '',
	email: '',
	password: '',
	role: 'EDITOR',
	status: 'ACTIVE',
}

export const UserCreateDialog = ({ open, onOpenChange, onCreated }: UserCreateDialogProps) => {
	const form = useFormReducer<CreateUserPayload>({
		initialValues: INITIAL,
		schema: createUserSchema,
		onSubmit: async values => {
			const res = await usersActions.create<UserRecord>(values)

			if (res.error) throw new Error(res.error)

			if (res.data) {
				onCreated(res.data)
				onOpenChange(false)
			}
		},
	})

	useEffect(() => {
		if (open) form.reset()
	}, [open])

	const text = (key: 'fullName' | 'email' | 'password') => ({
		value: form.values[key],
		onChange: (event: ChangeEvent<HTMLInputElement>) => form.handleChange(key, event.target.value),
		onBlur: () => form.handleBlur(key),
	})

	return (
		<FormDialog
			open={open}
			onOpenChange={onOpenChange}
			title='Create Personnel / Admin Account'
			description='Add a new administrator or content editor to manage the CMS.'
			error={form.submitError}
			saving={form.isSubmitting}
			submitLabel='Create Personnel'
			onSubmit={form.handleSubmit}
			className='max-w-md'>
			<Field id='user-fullname' label='Full Name' required error={form.errors.fullName}>
				<Input id='user-fullname' required placeholder='e.g. Alex Morgan' {...text('fullName')} />
			</Field>

			<Field id='user-email' label='Email Address' error={form.errors.email} required>
				<Input
					id='user-email'
					required
					type='email'
					placeholder='user@example.com'
					{...text('email')}
				/>
			</Field>

			<Field id='user-password' label='Initial Password' error={form.errors.password} required>
				<Input
					id='user-password'
					required
					type='password'
					placeholder='Min 6 characters'
					{...text('password')}
				/>
			</Field>

			<div className='grid grid-cols-2 gap-4'>
				<Field id='user-role' label='Role'>
					<Select
						id='user-role'
						aria-label='User role'
						value={form.values.role}
						onChange={value => form.handleChange('role', value)}
						options={ROLE_OPTIONS}
						className='text-sm'
					/>
				</Field>
				<Field id='user-status' label='Status'>
					<Select
						id='user-status'
						aria-label='User status'
						value={form.values.status}
						onChange={value => form.handleChange('status', value)}
						options={STATUS_OPTIONS}
						className='text-sm'
					/>
				</Field>
			</div>
		</FormDialog>
	)
}
