import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialFormDialog } from './social-form-dialog'
import { render, screen } from '@testing-library/react'

const renderModal = (onSave: () => Promise<void>) => {
	const onOpenChange = vi.fn()

	render(<SocialFormDialog open onOpenChange={onOpenChange} social={null} onSave={onSave} />)

	return { onOpenChange }
}

const fillAndSave = async () => {
	await userEvent.clear(screen.getByLabelText('Display Label'))
	await userEvent.type(screen.getByLabelText('Display Label'), 'My GitHub')
	await userEvent.type(screen.getByLabelText('Profile URL'), 'https://github.com/me')
	await userEvent.click(screen.getByRole('button', { name: 'Save Social Link' }))
}

describe('SocialFormDialog', () => {
	it('closes after a successful save and sends only API fields', async () => {
		const onSave = vi.fn().mockResolvedValue(undefined)
		const { onOpenChange } = renderModal(onSave)

		await fillAndSave()

		expect(onSave).toHaveBeenCalledWith({
			platform: 'GITHUB',
			label: 'My GitHub',
			url: 'https://github.com/me',
			handle: undefined,
			isVisible: false,
		})
		expect(onOpenChange).toHaveBeenCalledWith(false)
	})

	it('stays open, keeps the input and shows the error when saving fails', async () => {
		const { onOpenChange } = renderModal(
			vi.fn().mockRejectedValue(new Error('url must be a URL address')),
		)

		await fillAndSave()

		expect(onOpenChange).not.toHaveBeenCalled()
		expect(screen.getByRole('alert')).toHaveTextContent('url must be a URL address')
		expect(screen.getByLabelText('Display Label')).toHaveValue('My GitHub')
		expect(screen.getByRole('button', { name: 'Save Social Link' })).toBeEnabled()
	})

	it('opens blank again after a successful create', async () => {
		const onOpenChange = vi.fn()
		const onSave = vi.fn().mockResolvedValue(undefined)
		const { rerender } = render(
			<SocialFormDialog open onOpenChange={onOpenChange} social={null} onSave={onSave} />,
		)

		await fillAndSave()

		rerender(
			<SocialFormDialog open={false} onOpenChange={onOpenChange} social={null} onSave={onSave} />,
		)
		rerender(<SocialFormDialog open onOpenChange={onOpenChange} social={null} onSave={onSave} />)

		expect(screen.getByLabelText('Display Label')).toHaveValue('')
		expect(screen.getByLabelText('Profile URL')).toHaveValue('')
	})

	it('drops unsaved input after cancel and reopen', async () => {
		const onOpenChange = vi.fn()
		const onSave = vi.fn()
		const { rerender } = render(
			<SocialFormDialog open onOpenChange={onOpenChange} social={null} onSave={onSave} />,
		)

		await userEvent.type(screen.getByLabelText('Profile URL'), 'https://github.com/me')
		await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

		expect(onOpenChange).toHaveBeenCalledWith(false)

		rerender(
			<SocialFormDialog open={false} onOpenChange={onOpenChange} social={null} onSave={onSave} />,
		)
		rerender(<SocialFormDialog open onOpenChange={onOpenChange} social={null} onSave={onSave} />)

		expect(screen.getByLabelText('Profile URL')).toHaveValue('')
		expect(onSave).not.toHaveBeenCalled()
	})

	it('marks required fields with an asterisk', () => {
		renderModal(vi.fn())

		expect(screen.getByLabelText('Profile URL')).toBeRequired()
		expect(screen.getByText('Profile URL').parentElement).toHaveTextContent('Profile URL*')
	})
})
