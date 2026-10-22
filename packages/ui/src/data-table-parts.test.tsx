import type {
	DataTableBodyProps,
	DataTableHeadCellProps,
	DataTableToolbarProps,
} from 'types/components'

import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { DataTableBody } from './designs/data-table-body'
import { DataTableHeadCell } from './designs/data-table-head-cell'
import { DataTableToolbar } from './designs/data-table-toolbar'

const NO_MATCH = 'Nothing matches the selected filters. Try another search or clear the filters.'

const renderBody = (props: Partial<DataTableBodyProps> = {}) =>
	render(
		<table>
			<DataTableBody
				loading={false}
				skeletonRows={3}
				columnIds={['name', 'role']}
				rows={[]}
				emptyState={undefined}
				hasActiveFilters={false}
				{...props}
			/>
		</table>,
	)

const bodyRows = () => within(screen.getByRole('rowgroup')).getAllByRole('row')

describe('DataTableBody', () => {
	it('shows one skeleton row per requested row while loading, and no data', () => {
		renderBody({
			loading: true,
			rows: [{ id: 'r1', cells: [{ id: 'c1', sticky: false, content: 'Ada' }] }],
		})

		expect(bodyRows()).toHaveLength(3)
		expect(within(bodyRows()[0] as HTMLElement).getAllByRole('cell')).toHaveLength(2)
		expect(screen.queryByText('Ada')).not.toBeInTheDocument()
	})

	it('renders each row with its cells and pins sticky cells', () => {
		renderBody({
			rows: [
				{
					id: 'r1',
					cells: [
						{ id: 'c1', sticky: false, content: 'Ada' },
						{ id: 'c2', sticky: true, content: 'Edit' },
					],
				},
				{ id: 'r2', cells: [{ id: 'c3', sticky: false, content: 'Grace' }] },
			],
		})

		expect(bodyRows()).toHaveLength(2)
		expect(screen.getByText('Ada')).toBeInTheDocument()
		expect(screen.getByText('Grace')).toBeInTheDocument()
		expect(screen.getByText('Edit').closest('td')?.className).toMatch(/sticky/)
		expect(screen.getByText('Ada').closest('td')?.className ?? '').not.toMatch(/sticky/)
	})

	it('uses the caller empty state when the collection is empty and no filter is on', () => {
		renderBody({
			emptyState: {
				title: 'No projects yet',
				description: 'Create your first project.',
				action: <button type='button'>New project</button>,
			},
		})

		expect(screen.getByText('No projects yet')).toBeInTheDocument()
		expect(screen.getByText('Create your first project.')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'New project' })).toBeInTheDocument()
		expect(screen.getByRole('cell')).toHaveAttribute('colspan', '2')
	})

	it('ignores the caller empty state and explains the filters when a filter is on', () => {
		renderBody({ emptyState: { title: 'No projects yet' }, hasActiveFilters: true })

		expect(screen.queryByText('No projects yet')).not.toBeInTheDocument()
		expect(screen.getByText('No data found')).toBeInTheDocument()
		expect(screen.getByText(NO_MATCH)).toBeInTheDocument()
	})

	it('falls back to a generic message with no empty state and no filters', () => {
		renderBody({ columnIds: [] })

		expect(screen.getByText('No data found')).toBeInTheDocument()
		expect(screen.getByText('There is nothing here yet.')).toBeInTheDocument()
		expect(screen.getByRole('cell')).toHaveAttribute('colspan', '1')
	})
})

const renderHead = (props: Partial<DataTableHeadCellProps> = {}) =>
	render(
		<table>
			<thead>
				<tr>
					<DataTableHeadCell
						label='Name'
						sortable
						sorted={false}
						onSort={undefined}
						sticky={false}
						{...props}>
						Name
					</DataTableHeadCell>
				</tr>
			</thead>
		</table>,
	)

describe('DataTableHeadCell', () => {
	it.each([
		[false, 'none'],
		['asc', 'ascending'],
		['desc', 'descending'],
	] as const)('marks a sortable column sorted %s as aria-sort %s', (sorted, ariaSort) => {
		renderHead({ sorted })

		expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', ariaSort)
	})

	it('calls onSort from a labelled sort button', async () => {
		const onSort = vi.fn()
		renderHead({ onSort })

		await userEvent.click(screen.getByRole('button', { name: 'Sort by Name' }))

		expect(onSort).toHaveBeenCalledTimes(1)
	})

	it('has no sort button or aria-sort when the column is not sortable', () => {
		renderHead({ sortable: false })

		expect(screen.getByRole('columnheader')).not.toHaveAttribute('aria-sort')
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('pins a sticky column header', () => {
		renderHead({ sticky: true })

		expect(screen.getByRole('columnheader').className).toMatch(/sticky/)
	})
})

const renderToolbar = (props: Partial<DataTableToolbarProps> = {}) => {
	const handlers = {
		onSearch: vi.fn(),
		onFilter: vi.fn(),
		onDate: vi.fn(),
		onClear: vi.fn(),
	}

	render(
		<DataTableToolbar
			search=''
			disableSearch={false}
			filters={undefined}
			filterValue={() => undefined}
			date={{ from: '', to: '' }}
			disableDateRange={false}
			disableClearFilters={false}
			columns={[]}
			disableColumnVisibility={false}
			{...handlers}
			{...props}
		/>,
	)

	return handlers
}

describe('DataTableToolbar', () => {
	it('reports what is typed in the search box', async () => {
		const { onSearch } = renderToolbar()

		await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), 'a')

		expect(onSearch).toHaveBeenCalledWith('a')
	})

	it('disables and hides the search box when search is off', () => {
		renderToolbar({ disableSearch: true })

		const search = screen.getByRole('textbox', { name: 'Search', hidden: true })
		expect(search).toBeDisabled()
		expect(search.parentElement?.className).toMatch(/\bhidden\b/)
	})

	it('renders each filter with its current value and reports changes by id', async () => {
		const { onFilter } = renderToolbar({
			filters: [{ id: 'email', label: 'Email', type: 'search' }],
			filterValue: id => (id === 'email' ? 'ada' : undefined),
		})

		const filter = screen.getByRole('textbox', { name: 'Email' })
		expect(filter).toHaveValue('ada')

		await userEvent.type(filter, 'x')

		expect(onFilter).toHaveBeenCalledWith('email', 'adax')
	})

	it('clears every filter from the reset button', async () => {
		const { onClear } = renderToolbar()

		await userEvent.click(screen.getByRole('button', { name: 'Reset Filters' }))

		expect(onClear).toHaveBeenCalledTimes(1)
	})

	it('disables and hides the reset button when clearing is off', () => {
		renderToolbar({ disableClearFilters: true })

		const reset = screen.getByRole('button', { name: 'Reset Filters', hidden: true })
		expect(reset).toBeDisabled()
		expect(reset.className).toMatch(/\bhidden\b/)
	})
})
