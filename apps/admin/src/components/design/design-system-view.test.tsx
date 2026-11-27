import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DesignSystemView } from 'components/design/design-system-view'
import {
	CONTROL_STEPS,
	RADIUS_STEPS,
	SAMPLE_ROWS,
	SWATCHES,
	TEXT_STEPS,
} from 'components/design/design-tokens'

// covers: AC-6, AC-10
describe('DesignSystemView', () => {
	it('shows a page title and one section for each token group', () => {
		render(<DesignSystemView />)

		expect(screen.getByRole('heading', { level: 1, name: 'Design tokens' })).toBeInTheDocument()
		const sections = screen.getAllByRole('heading', { level: 2 }).map(item => item.textContent)
		expect(sections).toEqual(['Color', 'Type', 'Radius and depth', 'Controls', 'Form', 'Table'])
	})

	it('lists every color, type step, radius and control size from the token data', () => {
		render(<DesignSystemView />)

		for (const swatch of SWATCHES) expect(screen.getByText(swatch.name)).toBeInTheDocument()
		for (const step of TEXT_STEPS)
			expect(screen.getByText(`${step.name} ${step.size}`)).toBeInTheDocument()
		for (const step of RADIUS_STEPS) expect(screen.getByText(step.name)).toBeInTheDocument()
		for (const step of CONTROL_STEPS)
			expect(screen.getByText(`${step.name} ${step.height}px`)).toBeInTheDocument()
	})

	it('gives every sample control an accessible name', () => {
		render(<DesignSystemView />)

		for (const step of CONTROL_STEPS)
			expect(screen.getByRole('textbox', { name: `${step.name} sample` })).toBeInTheDocument()
		expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
		expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument()
		for (const name of ['Small', 'Medium', 'Large', 'Save'])
			expect(screen.getByRole('button', { name })).toBeInTheDocument()
	})

	it('renders the sample table with a header and one row per sample', () => {
		render(<DesignSystemView />)

		const table = screen.getByRole('table')
		expect(
			within(table)
				.getAllByRole('columnheader')
				.map(item => item.textContent),
		).toEqual(['Name', 'Status', 'Count'])
		const body = within(table).getAllByRole('row').slice(1)
		expect(body).toHaveLength(SAMPLE_ROWS.length)
		for (const row of SAMPLE_ROWS) {
			const line = body.find(item => within(item).queryByText(row.name))
			expect(line).toBeDefined()
			expect(within(line as HTMLElement).getByText(row.status)).toBeInTheDocument()
			expect(within(line as HTMLElement).getByText(String(row.count))).toBeInTheDocument()
		}
	})

	it('has no links, so it stays out of navigation', () => {
		render(<DesignSystemView />)

		expect(screen.queryAllByRole('link')).toHaveLength(0)
	})
})
