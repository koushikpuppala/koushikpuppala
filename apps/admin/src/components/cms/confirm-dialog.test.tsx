import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './confirm-dialog'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const renderDialog = (onConfirm: () => Promise<void>) => {
	const onOpenChange = vi.fn()

	render(
		<ConfirmDialog
			open
			onOpenChange={onOpenChange}
			onConfirm={onConfirm}
			title='Delete item?'
			description='This cannot be undone.'
			confirmLabel='Delete'
		/>,
	)

	return { onOpenChange }
}

describe('ConfirmDialog', () => {
	it('closes after the action succeeds', async () => {
		const { onOpenChange } = renderDialog(vi.fn().mockResolvedValue(undefined))

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

		expect(onOpenChange).toHaveBeenCalledWith(false)
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})

	it('stays open and shows why when the action fails', async () => {
		const { onOpenChange } = renderDialog(
			vi.fn().mockRejectedValue(new Error('Media file is still in use by: projectsThumbnail (1).')),
		)

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

		expect(onOpenChange).not.toHaveBeenCalled()
		expect(screen.getByRole('alert')).toHaveTextContent('still in use')
	})

	it('clears the error when the user retries', async () => {
		const onConfirm = vi
			.fn()
			.mockRejectedValueOnce(new Error('Temporary failure'))
			.mockResolvedValueOnce(undefined)
		renderDialog(onConfirm)

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
		expect(screen.getByRole('alert')).toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})
})
