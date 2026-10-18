'use client'

import type { UpdateUserPayload, UserRecord } from 'types/api'
import type { UserEditDialogProps } from 'types/components/admin'
import { Select } from 'ui/select'
import { usersActions } from 'actions/users'
import { Field } from 'components/form/field'
import { useFormDialog } from 'lib/use-form-dialog'
import { FormDialog } from 'components/form/form-dialog'
import { ROLE_DETAIL_OPTIONS, STATUS_DETAIL_OPTIONS } from './user-options'

const EMPTY: Partial<UpdateUserPayload> = { role: 'EDITOR', status: 'ACTIVE' }

export const UserEditDialog = ({ user, onClose, onUpdated }: UserEditDialogProps) => {
	const { form, setField, saving, saveError, submit } = useFormDialog<UpdateUserPayload>({
		open: Boolean(user),
		record: user,
		empty: EMPTY,
		normalize: ({ role, status }) => ({ role, status }),
		toPayload: values => values,
		onSave: async ({ role = 'EDITOR', status = 'ACTIVE' }) => {
			if (!user) return

			const res = await usersActions.update<UserRecord>(user.id, { role, status })

			if (res.error) throw new Error(res.error)
			if (!res.data) throw new Error('The user could not be updated.')

			onUpdated(user.id, role, status)
		},
		onOpenChange: open => !open && onClose(),
	})

	return (
		<FormDialog
			open={Boolean(user)}
			onOpenChange={open => !open && onClose()}
			title='Modify Role & Permissions'
			description={`Update RBAC and account state for ${user?.email}`}
			error={saveError}
			saving={saving}
			submitLabel='Save Permissions'
			onSubmit={submit}
			className='max-w-md'>
			<Field id='edit-user-role' label='Role Authorization'>
				<Select
					id='edit-user-role'
					aria-label='Edit user role'
					value={form.role}
					onChange={value => setField('role', value)}
					options={ROLE_DETAIL_OPTIONS}
					className='text-sm'
				/>
			</Field>

			<Field id='edit-user-status' label='Account Status'>
				<Select
					id='edit-user-status'
					aria-label='Edit user status'
					value={form.status}
					onChange={value => setField('status', value)}
					options={STATUS_DETAIL_OPTIONS}
					className='text-sm'
				/>
			</Field>
		</FormDialog>
	)
}
