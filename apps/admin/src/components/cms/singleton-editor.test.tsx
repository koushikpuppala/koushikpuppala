import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SingletonEditor } from 'components/cms/singleton-editor'

describe('SingletonEditor', () => {
	it('shows the page skeleton while the record loads', () => {
		render(
			<SingletonEditor
				title='Home Page'
				loading
				onSave={vi.fn()}
				skeleton={<div data-testid='home-skeleton' />}>
				<p>Form fields</p>
			</SingletonEditor>,
		)

		expect(screen.getByRole('status')).toHaveTextContent('Loading Home Page')
		expect(screen.getByTestId('home-skeleton')).toBeInTheDocument()
		expect(screen.queryByText('Form fields')).not.toBeInTheDocument()
	})

	it('shows the form once loaded', () => {
		render(
			<SingletonEditor title='Home Page' onSave={vi.fn()}>
				<p>Form fields</p>
			</SingletonEditor>,
		)

		expect(screen.queryByRole('status')).not.toBeInTheDocument()
		expect(screen.getByText('Form fields')).toBeInTheDocument()
	})
})
