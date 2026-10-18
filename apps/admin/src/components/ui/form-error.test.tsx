import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormError, errorMessage } from './form-error'

describe('FormError', () => {
	it('announces the message as an alert', () => {
		render(<FormError message='Slug already exists' />)

		expect(screen.getByRole('alert')).toHaveTextContent('Slug already exists')
	})

	it('renders nothing without a message', () => {
		const { container } = render(<FormError message={null} />)

		expect(container).toBeEmptyDOMElement()
	})
})

describe('errorMessage', () => {
	it('uses the Error message, or the fallback otherwise', () => {
		expect(errorMessage(new Error('Nope'))).toBe('Nope')
		expect(errorMessage('weird', 'Fallback')).toBe('Fallback')
	})
})
