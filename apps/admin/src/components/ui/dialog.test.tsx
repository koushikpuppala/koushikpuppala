import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'

// jsdom has no layout, so offsetParent is always null; the dialog uses it to skip hidden controls.
const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent')
let laidOut = true

Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
	configurable: true,
	get: () => (laidOut ? document.body : null),
})

beforeEach(() => {
	laidOut = true
})

afterAll(() => {
	if (original) Object.defineProperty(HTMLElement.prototype, 'offsetParent', original)
})

const renderDialog = (onOpenChange = vi.fn(), withInput = true) => {
	const result = render(
		<>
			<button type='button'>Opener</button>
			<Dialog open onOpenChange={onOpenChange}>
				<DialogContent onClose={() => onOpenChange(false)}>
					<DialogHeader>
						<DialogTitle>Edit record</DialogTitle>
						<DialogDescription>Change the fields below.</DialogDescription>
					</DialogHeader>
					{withInput ? <input aria-label='Name' /> : null}
					<DialogFooter>
						<button type='button'>Cancel</button>
						<button type='button'>Save</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>,
	)

	return { ...result, onOpenChange }
}

describe('Dialog', () => {
	it('is named by its title and description, focuses the first field and locks scrolling', () => {
		renderDialog()

		const dialog = screen.getByRole('dialog', { name: 'Edit record' })
		expect(dialog).toHaveAccessibleDescription('Change the fields below.')
		expect(screen.getByLabelText('Name')).toHaveFocus()
		expect(document.body.style.overflow).toBe('hidden')
	})

	it('focuses the first button when there is no field', () => {
		renderDialog(vi.fn(), false)

		expect(screen.getAllByRole('button')[1]).toHaveFocus()
	})

	it('keeps Tab and Shift+Tab inside the dialog', () => {
		renderDialog()
		const save = screen.getByRole('button', { name: 'Save' })
		const name = screen.getByLabelText('Name')
		const first = screen.getAllByRole('button').find(b => b.closest('[role="dialog"]')) as HTMLElement

		save.focus()
		fireEvent.keyDown(window, { key: 'Tab' })
		expect(first).toHaveFocus()

		fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
		expect(save).toHaveFocus()

		name.focus()
		fireEvent.keyDown(window, { key: 'Tab' })
		expect(name).toHaveFocus()
	})

	it('ignores Tab when nothing inside can take focus', () => {
		laidOut = false
		renderDialog()
		const name = screen.getByLabelText('Name')
		name.focus()

		fireEvent.keyDown(window, { key: 'Tab' })

		expect(name).toHaveFocus()
	})

	it('closes on Escape, the backdrop or the close button, and ignores handled keys', async () => {
		const { onOpenChange, container } = renderDialog()

		const handled = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
		handled.preventDefault()
		window.dispatchEvent(handled)
		expect(onOpenChange).not.toHaveBeenCalled()

		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onOpenChange).toHaveBeenCalledWith(false)

		fireEvent.click(container.querySelector('[aria-hidden="true"]') as Element)
		await userEvent.click(screen.getByRole('button', { name: /close/i }))
		expect(onOpenChange).toHaveBeenCalledTimes(3)
	})

	it('restores scrolling and focus to the opener when closed', () => {
		const opener = vi.fn()
		const { rerender } = render(
			<>
				<button type='button' onFocus={opener}>
					Opener
				</button>
				<Dialog open={false} onOpenChange={vi.fn()}>
					<DialogContent>
						<DialogTitle>Hidden</DialogTitle>
					</DialogContent>
				</Dialog>
			</>,
		)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		screen.getByRole('button', { name: 'Opener' }).focus()
		opener.mockClear()

		const tree = (open: boolean) => (
			<>
				<button type='button' onFocus={opener}>
					Opener
				</button>
				<Dialog open={open} onOpenChange={vi.fn()}>
					<DialogContent>
						<DialogTitle>Shown</DialogTitle>
						<input aria-label='Field' />
					</DialogContent>
				</Dialog>
			</>
		)
		rerender(tree(true))
		rerender(tree(false))

		expect(document.body.style.overflow).toBe('')
		expect(opener).toHaveBeenCalled()
	})
})
