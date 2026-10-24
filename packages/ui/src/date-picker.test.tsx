import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from './date-picker'

const renderPicker = (props: Partial<Parameters<typeof DatePicker>[0]> = {}) => {
	const onChange = vi.fn()
	render(
		<>
			<label htmlFor='start'>Start date</label>
			<DatePicker id='start' value='2026-03-10' onChange={onChange} {...props} />
		</>,
	)

	return onChange
}

const day = (n: number) =>
	screen
		.getAllByRole('button')
		.find(
			button =>
				button.classList.contains('rdrDay') &&
				!button.classList.contains('rdrDayPassive') &&
				button.textContent === String(n),
		) as HTMLButtonElement

describe('DatePicker', () => {
	it('is named by its label and shows the date in words', () => {
		renderPicker()

		expect(screen.getByRole('button', { name: /Start date/ })).toHaveTextContent('Mar 10, 2026')
	})

	it('reports the picked day as YYYY-MM-DD', async () => {
		const onChange = renderPicker()

		await userEvent.click(screen.getByRole('button', { name: /Start date/ }))
		await userEvent.click(day(18))

		expect(onChange).toHaveBeenCalledWith('2026-03-18')
	})

	it('disables days before min', async () => {
		renderPicker({ min: '2026-03-15' })

		await userEvent.click(screen.getByRole('button', { name: /Start date/ }))

		expect(day(12)).toHaveClass('rdrDayDisabled')
		expect(day(20)).not.toHaveClass('rdrDayDisabled')
	})

	it('moves to another month with the month picker', async () => {
		const onChange = renderPicker()

		await userEvent.click(screen.getByRole('button', { name: /Start date/ }))
		await userEvent.click(screen.getByRole('button', { name: 'Month' }))
		await userEvent.click(screen.getByRole('option', { name: 'June' }))
		await userEvent.click(day(4))

		expect(onChange).toHaveBeenCalledWith('2026-06-04')
	})

	it('clears an optional date', async () => {
		const onChange = renderPicker()

		await userEvent.click(screen.getByRole('button', { name: /Start date/ }))
		await userEvent.click(screen.getByRole('button', { name: 'Clear date' }))

		expect(onChange).toHaveBeenCalledWith('')
	})
})
