import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserCreateDialog } from 'components/users/user-create-dialog'

const create = vi.fn()

vi.mock('actions/users', () => ({
	usersActions: { create: (...args: unknown[]) => create(...args) },
}))

const fill = async () => {
	await userEvent.click(screen.getByLabelText('Full Name'))
	await userEvent.paste('Alex Morgan')
	await userEvent.click(screen.getByLabelText('Email Address'))
	await userEvent.paste('alex@example.com')
	await userEvent.click(screen.getByLabelText('Initial Password'))
	await userEvent.paste('secret-phrase-123')
}

describe('UserCreateDialog', () => {
	it('opens blank again after a successful create', async () => {
		create.mockResolvedValue({ data: { id: 'u1' }, error: null })
		const onOpenChange = vi.fn()
		const onCreated = vi.fn()
		const { rerender } = render(
			<UserCreateDialog open onOpenChange={onOpenChange} onCreated={onCreated} />,
		)

		await fill()
		await userEvent.click(screen.getByRole('button', { name: 'Create Personnel' }))

		expect(onCreated).toHaveBeenCalled()
		expect(onOpenChange).toHaveBeenCalledWith(false)

		rerender(<UserCreateDialog open={false} onOpenChange={onOpenChange} onCreated={onCreated} />)
		rerender(<UserCreateDialog open onOpenChange={onOpenChange} onCreated={onCreated} />)

		expect(screen.getByLabelText('Full Name')).toHaveValue('')
		expect(screen.getByLabelText('Email Address')).toHaveValue('')
	})

	it('drops unsaved input after cancel and reopen', async () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<UserCreateDialog open onOpenChange={onOpenChange} onCreated={vi.fn()} />,
		)

		await fill()
		await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

		rerender(<UserCreateDialog open={false} onOpenChange={onOpenChange} onCreated={vi.fn()} />)
		rerender(<UserCreateDialog open onOpenChange={onOpenChange} onCreated={vi.fn()} />)

		expect(screen.getByLabelText('Full Name')).toHaveValue('')
	})
})
