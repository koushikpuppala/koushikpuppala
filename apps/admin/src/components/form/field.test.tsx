import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Field } from 'components/form/field'

describe('Field', () => {
	it('shows an asterisk outside the label for required fields', () => {
		render(
			<Field id='title' label='Title' required>
				<input id='title' required />
			</Field>,
		)

		expect(screen.getByLabelText('Title')).toBeRequired()
		expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
	})

	it('shows no asterisk for optional fields', () => {
		render(
			<Field id='subtitle' label='Subtitle'>
				<input id='subtitle' />
			</Field>,
		)

		expect(screen.queryByText('*')).not.toBeInTheDocument()
	})
})
