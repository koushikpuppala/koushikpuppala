import type { DataTableColumnDef } from 'types/components'

import userEvent from '@testing-library/user-event'
import { DataTable } from './designs/data-table'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

const replace = vi.fn()
vi.mock('next/navigation', () => ({
	usePathname: () => '/content',
	useRouter: () => ({ replace, push: vi.fn() }),
	useSearchParams: () => new URLSearchParams(),
}))

type Row = { id: string; name: string; role: string }

const columns: DataTableColumnDef<Row>[] = [
	{ accessorKey: 'name', header: 'Name' },
	{ accessorKey: 'role', header: 'Role' },
]

const rows: Row[] = Array.from({ length: 12 }, (_, i) => ({
	id: String(i + 1),
	name: `Person ${String(i + 1).padStart(2, '0')}`,
	role: i % 2 ? 'EDITOR' : 'ADMIN',
}))

const bodyRows = () => within(screen.getAllByRole('rowgroup')[1] as HTMLElement).getAllByRole('row')

describe('DataTable', () => {
	beforeEach(() => replace.mockClear())

	it('labels the search box for assistive technology', () => {
		render(<DataTable data={rows} columns={columns} totalCount={rows.length} />)

		expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument()
	})

	describe('server mode (default)', () => {
		it('renders the rows it is given and leaves filtering to the API', async () => {
			render(<DataTable data={rows} columns={columns} totalCount={rows.length} />)

			await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), 'Person 07')

			expect(bodyRows()).toHaveLength(rows.length)
			expect(replace).toHaveBeenLastCalledWith('/content?search=Person+07', { scroll: false })
		})

		it('requests the next page through the URL', async () => {
			render(<DataTable data={rows.slice(0, 5)} columns={columns} totalCount={12} pageSize={5} />)

			expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

			await userEvent.click(screen.getByRole('button', { name: 'Next' }))

			expect(replace).toHaveBeenLastCalledWith('/content?page=2', { scroll: false })
		})

		it('changes the page size through the URL', async () => {
			render(<DataTable data={rows} columns={columns} totalCount={rows.length} />)

			await userEvent.click(screen.getByRole('button', { name: 'Rows per page' }))
			await userEvent.click(screen.getByRole('option', { name: '25' }))

			expect(replace).toHaveBeenLastCalledWith('/content?pageSize=25', { scroll: false })
		})

		it('namespaces URL params with the identifier', async () => {
			render(
				<DataTable data={rows} columns={columns} totalCount={rows.length} identifier='users' />,
			)

			await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), 'x')

			expect(replace).toHaveBeenLastCalledWith('/content?users_search=x', { scroll: false })
		})
	})

	describe('client mode', () => {
		const clientProps = { manualFiltering: false, manualPagination: false } as const

		it('filters rows locally', async () => {
			render(<DataTable data={rows} columns={columns} totalCount={rows.length} {...clientProps} />)

			await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), 'Person 07')

			expect(bodyRows()).toHaveLength(1)
			expect(screen.getByText('Person 07')).toBeInTheDocument()
		})

		it('shows the empty state when nothing matches', async () => {
			render(<DataTable data={rows} columns={columns} totalCount={rows.length} {...clientProps} />)

			await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), 'nobody')

			expect(screen.getByText('No data found')).toBeInTheDocument()
			expect(screen.getByText(/Nothing matches the selected filters/)).toBeInTheDocument()
		})

		it('pages through rows locally', async () => {
			render(
				<DataTable
					data={rows}
					columns={columns}
					totalCount={rows.length}
					pageSize={5}
					{...clientProps}
				/>,
			)

			expect(bodyRows()).toHaveLength(5)

			await userEvent.click(screen.getByRole('button', { name: 'Next' }))

			expect(screen.getByText('Person 06')).toBeInTheDocument()
			expect(screen.queryByText('Person 01')).not.toBeInTheDocument()
		})
	})

	it('makes columns sortable only when they opt in', () => {
		const sortable: DataTableColumnDef<Row>[] = [
			{ accessorKey: 'name', header: 'Name', enableSorting: true },
			{ accessorKey: 'role', header: 'Role' },
		]
		render(<DataTable data={rows} columns={sortable} totalCount={rows.length} />)

		expect(screen.getByRole('button', { name: 'Sort by Name' })).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Sort by Role' })).not.toBeInTheDocument()
		expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'none')
	})

	it('announces loading and marks the table busy until rows arrive', () => {
		const { rerender } = render(<DataTable data={[]} columns={columns} totalCount={0} loading />)

		expect(screen.getByRole('status')).toHaveTextContent('Loading rows…')
		expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')

		rerender(<DataTable data={rows} columns={columns} totalCount={rows.length} />)

		expect(screen.getByRole('status')).toBeEmptyDOMElement()
		expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'false')
	})

	it('labels the date range button', () => {
		render(<DataTable data={rows} columns={columns} totalCount={rows.length} />)

		expect(screen.getByRole('button', { name: 'Select date range' })).toBeInTheDocument()
	})

	it('shows the custom empty state only while no filter is active', async () => {
		render(
			<DataTable
				data={[]}
				columns={columns}
				totalCount={0}
				emptyState={{ title: 'No projects yet', description: 'Create your first one.' }}
			/>,
		)

		expect(screen.getByText('No projects yet')).toBeInTheDocument()

		await userEvent.type(screen.getByRole('textbox', { name: 'Search' }), 'x')

		expect(screen.queryByText('No projects yet')).not.toBeInTheDocument()
		expect(screen.getByText('No data found')).toBeInTheDocument()
	})
})
