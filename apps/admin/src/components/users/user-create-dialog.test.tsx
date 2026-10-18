import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserCreateDialog } from './user-create-dialog'

const create = vi.fn()

vi.mock('actions/users', () => ({
	usersActions: { create: (...args: unknown[]) => create(...args) },
}))

const fill = async () => {
	await userEvent.type(screen.getByLabelText('Full Name'), 'Alex Morgan')
	await userEvent.type(screen.getByLabelText('Email Address'), 'alex@example.com')
	await userEvent.type(screen.getByLabelText('Initial Password'), 'secret123')
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
