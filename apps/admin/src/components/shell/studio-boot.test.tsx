import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { StudioBoot } from 'components/shell/studio-boot'

describe('StudioBoot', () => {
	it('shows the session check as the active step first', () => {
		render(<StudioBoot stage='session' />)

		const status = screen.getByRole('status')
		expect(within(status).getByText('Checking your session')).toBeInTheDocument()
		expect(within(status).getByText('Verifying studio access')).toBeInTheDocument()
	})

	it('marks the session as found while access is verified', () => {
		render(<StudioBoot stage='access' />)

		const status = screen.getByRole('status')
		expect(within(status).getByText('Session found')).toBeInTheDocument()
		expect(within(status).getByText('Verifying studio access')).toBeInTheDocument()
	})
})
