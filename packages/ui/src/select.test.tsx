import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './select'

const options = [
	{ label: 'Draft', value: 'DRAFT' },
	{ label: 'Published', value: 'PUBLISHED' },
	{ label: 'Archived', value: 'ARCHIVED' },
] as const

const renderSelect = (value: (typeof options)[number]['value'] | '' = 'DRAFT') => {
	const onChange = vi.fn()
	render(
		<>
			<label htmlFor='status'>Status</label>
			<Select id='status' value={value} onChange={onChange} options={options} />
		</>,
	)

	return onChange
}

describe('Select', () => {
	it('is named by its label and shows the chosen option', () => {
		renderSelect()

		expect(screen.getByRole('button', { name: /Status/ })).toHaveTextContent('Draft')
	})

	it('shows the placeholder when nothing is chosen', () => {
		renderSelect('')

		expect(screen.getByRole('button', { name: /Status/ })).toHaveTextContent('Select…')
	})

	it('opens on click and reports the picked option', async () => {
		const onChange = renderSelect()

		await userEvent.click(screen.getByRole('button', { name: /Status/ }))
		await userEvent.click(screen.getByRole('option', { name: 'Published' }))

		expect(onChange).toHaveBeenCalledWith('PUBLISHED')
	})

	it('works from the keyboard', async () => {
		const onChange = renderSelect()

		await userEvent.tab()
		await userEvent.keyboard('{ArrowDown}')
		await waitFor(() => expect(screen.getByRole('listbox')).toHaveFocus())
		await userEvent.keyboard('{ArrowDown}{Enter}')

		expect(onChange).toHaveBeenCalledWith('PUBLISHED')
	})
})
