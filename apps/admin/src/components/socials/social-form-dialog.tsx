'use client'

import type { SelectOption } from 'types/components'
import type { SocialPlatform } from 'types/enums'
import type { SocialFormDialogProps, SocialRow as Social } from 'types/components/admin'
import { Input } from 'ui/input'
import { Select } from 'ui/select'
import { Field } from 'components/form/field'
import { useFormDialog } from 'lib/use-form-dialog'
import { FormDialog } from 'components/form/form-dialog'
import { PublishStateSelect } from 'components/form/publish-state-select'

const PLATFORMS: SelectOption<SocialPlatform>[] = [
	{ label: 'GitHub', value: 'GITHUB' },
	{ label: 'LinkedIn', value: 'LINKEDIN' },
	{ label: 'Twitter / X', value: 'TWITTER' },
	{ label: 'Discord', value: 'DISCORD' },
	{ label: 'Official Email', value: 'EMAIL' },
	{ label: 'YouTube', value: 'YOUTUBE' },
	{ label: 'Official Website', value: 'WEBSITE' },
	{ label: 'Instagram', value: 'INSTAGRAM' },
	{ label: 'Facebook', value: 'FACEBOOK' },
]

const EMPTY: Partial<Social> = {
	platform: 'GITHUB',
	label: '',
	url: '',
	handle: '',
	status: 'DRAFT',
}

const platformOf = (social: Partial<Social>): SocialPlatform => social.platform ?? 'GITHUB'

const normalize = (social: Partial<Social>): Partial<Social> => ({
	...social,
	platform: platformOf(social),
})

const toPayload = (form: Partial<Social>): Partial<Social> => ({
	platform: platformOf(form),
	label: form.label || form.platform || 'Link',
	url: form.url || '',
	handle: form.handle || undefined,
	isVisible: form.status !== 'DRAFT',
})

export const SocialFormDialog = ({ open, onOpenChange, social, onSave }: SocialFormDialogProps) => {
	const { form, setForm, setField, saving, saveError, submit } = useFormDialog({
		open,
		record: social,
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
			title={social?.id ? 'Edit Social Link' : 'Add Social Channel'}
			description='Configure verified communication channel details.'
			error={saveError}
			saving={saving}
			submitLabel='Save Social Link'
			onSubmit={submit}
			className='max-w-md'>
			<Field id='social-platform' label='Platform'>
				<Select
					id='social-platform'
					value={platformOf(form)}
					onChange={value =>
						setForm(prev => ({ ...prev, platform: value, label: prev.label || value }))
					}
					options={PLATFORMS}
				/>
			</Field>

			<Field id='social-display-label' label='Display Label' required>
				<Input
					id='social-display-label'
					value={form.label || ''}
					onChange={e => setField('label', e.target.value)}
					required
					placeholder='e.g. GitHub'
				/>
			</Field>

			<Field id='social-profile-url' label='Profile URL' required>
				<Input
					id='social-profile-url'
					value={form.url || ''}
					onChange={e => setField('url', e.target.value)}
					required
					placeholder='https://…'
				/>
			</Field>

			<Field id='social-handle-username-optional' label='Handle / Username (Optional)'>
				<Input
					id='social-handle-username-optional'
					value={form.handle || ''}
					onChange={e => setField('handle', e.target.value)}
					placeholder='@koushikpuppala'
				/>
			</Field>

			<Field id='social-status' label='Status'>
				<PublishStateSelect
					id='social-status'
					value={form.status}
					onChange={value => setField('status', value)}
				/>
			</Field>
		</FormDialog>
	)
}
