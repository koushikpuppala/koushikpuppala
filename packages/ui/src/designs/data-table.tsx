'use client'

import type {
	DataTableBodyRow,
	DataTableColumnDef,
	DataTableFeatures,
	DataTableProps,
	VisibleColumn,
} from 'types/components'
import type { RowData } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_arrIncludes,
	filterFn_equals,
	filterFn_inDateRange,
	filterFn_inNumberRange,
	filterFn_includesString,
	filterFn_weakEquals,
	flexRender,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_basic,
	sortFn_datetime,
	sortFn_text,
	tableFeatures,
	useTable,
} from '@tanstack/react-table'
import { DataTableBody } from './data-table-body'
import { useTableUrlSync } from './use-table-url-sync'
import { DataTableToolbar } from './data-table-toolbar'
import { DataTableHeadCell } from './data-table-head-cell'
import { DataTablePagination } from './data-table-pagination'
import { columnLabel, readInitialTableState } from './data-table-state'
import { Table, TableHeader, TableRow } from './table'

const dataTableFeatures: DataTableFeatures = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	columnVisibilityFeature,
	rowSortingFeature,
	rowPaginationFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filterFns: {
		includesString: filterFn_includesString,
		inNumberRange: filterFn_inNumberRange,
		equals: filterFn_equals,
		arrIncludes: filterFn_arrIncludes,
		inDateRange: filterFn_inDateRange,
		weakEquals: filterFn_weakEquals,
	},
	sortFns: {
		datetime: sortFn_datetime,
		alphanumeric: sortFn_alphanumeric,
		text: sortFn_text,
		basic: sortFn_basic,
	},
})

export const DataTable = <TData extends RowData>(props: DataTableProps<TData>) => {
	const searchParams = useSearchParams()
	const isInitialRender = useRef(true)

	const { columns, data, filters, totalCount, emptyState } = props
	const {
		pageSize = 10,
		identifier = '',
		loading = false,
		disableSearch = false,
		disableSorting = false,
		disableDateRange = false,
		disablePagination = false,
		disableClearFilters = false,
		disablePageSizeOptions = false,
		disableColumnVisibility = false,
	} = props

	const prefix = identifier ? `${identifier}_` : ''
	const defaultPageSize = useRef(pageSize).current

	const [initial] = useState(() =>
		readInitialTableState({
			searchParams,
			prefix,
			filters,
			pageSize: disablePagination ? totalCount : defaultPageSize,
		}),
	)
	const [sorting, setSorting] = useState(initial.sorting)
	const [columnVisibility, setColumnVisibility] = useState(initial.columnVisibility)
	const [columnFilters, setColumnFilters] = useState(initial.columnFilters)
	const [search, setSearch] = useState(initial.search)
	const [date, setDate] = useState(initial.date)
	const [pagination, setPagination] = useState(initial.pagination)

	const tableColumns = useMemo<DataTableColumnDef<TData>[]>(
		// TanStack Table needs at least one column to render the empty state row.
		() => (columns.length ? columns : [{ id: '__empty', header: '' }]),
		[columns],
	)

	const table = useTable({
		data,
		columns: tableColumns,
		enableMultiSort: false,
		features: dataTableFeatures,
		defaultColumn: { enableSorting: false },
		onSortingChange: setSorting,
		// Sorting, filtering and paging happen on the server by default; the table only reflects state.
		manualSorting: props.manualSorting ?? true,
		manualFiltering: props.manualFiltering ?? true,
		manualPagination: props.manualPagination ?? true,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		pageCount: disablePagination ? 1 : Math.ceil(totalCount / pagination.pageSize),
		state: { sorting, pagination, columnFilters, columnVisibility, globalFilter: search },
		onPaginationChange: updater =>
			setPagination(prev => (typeof updater === 'function' ? updater(prev) : updater)),
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset to first page only on filters change
	useEffect(() => {
		if (isInitialRender.current) {
			isInitialRender.current = false
			return
		}

		setPagination(prev => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }))
	}, [search, date.from, date.to, columnFilters, sorting])

	useTableUrlSync({
		prefix,
		defaultPageSize,
		pagination,
		search,
		date,
		sorting,
		columnFilters,
		columnVisibility,
		disableSearch,
		disableDateRange,
		disablePageSizeOptions,
	})

	const clearFilters = () => {
		setSearch('')
		setDate({ from: '', to: '' })
		setPagination({ pageIndex: 0, pageSize: disablePagination ? totalCount : pageSize })

		table.resetSorting()
		table.resetGlobalFilter()
		table.resetColumnFilters()
		table.resetColumnVisibility()
	}

	// Clamp the page so a larger page size never leaves the user past the last page.
	const changePageSize = (size: number) => {
		const maxPageIndex = Math.max(0, Math.ceil(totalCount / size) - 1)

		setPagination(prev => ({ pageIndex: Math.min(prev.pageIndex, maxPageIndex), pageSize: size }))
	}

	const hasActiveFilters = Boolean(
		search || date.from || date.to || columnFilters.some(filter => filter.value),
	)

	const hideableColumns: VisibleColumn[] = table
		.getAllColumns()
		.filter(column => column.getCanHide())
		.map(column => ({
			id: column.id,
			label: columnLabel(column.columnDef.header, column.id),
			visible: column.getIsVisible(),
			toggle: () => column.toggleVisibility(!column.getIsVisible()),
		}))

	const visibleColumnIds = table
		.getAllColumns()
		.filter(column => column.getIsVisible())
		.map(column => column.id)

	const rows: DataTableBodyRow[] = loading
		? []
		: table.getRowModel().rows.map(row => ({
				id: row.id,
				cells: row.getVisibleCells().map(cell => ({
					id: cell.id,
					sticky: cell.column.id === 'actions',
					content: flexRender(cell.column.columnDef.cell, cell.getContext()),
				})),
			}))

	return (
		<div className='relative flex w-full flex-col gap-4'>
			<DataTableToolbar
				search={search}
				onSearch={setSearch}
				disableSearch={disableSearch}
				filters={filters}
				filterValue={id => table.getColumn(id)?.getFilterValue()?.toString()}
				onFilter={(id, value) => table.getColumn(id)?.setFilterValue(value)}
				date={date}
				onDate={setDate}
				disableDateRange={disableDateRange}
				onClear={clearFilters}
				disableClearFilters={disableClearFilters}
				columns={hideableColumns}
				disableColumnVisibility={disableColumnVisibility}
			/>

			<p role='status' className='sr-only'>
				{loading ? 'Loading rows…' : ''}
			</p>

			<div className='border-border bg-surface overflow-hidden rounded-lg border'>
				<Table aria-busy={loading}>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow
								key={headerGroup.id}
								className='cursor-default border-b-0 hover:bg-transparent'>
								{headerGroup.headers
									.filter(header => header.column.getIsVisible())
									.map(header => (
										<DataTableHeadCell
											key={header.id}
											label={columnLabel(header.column.columnDef.header, header.id)}
											sortable={header.column.getCanSort() && !disableSorting}
											sorted={header.column.getIsSorted()}
											onSort={header.column.getToggleSortingHandler()}
											sticky={header.column.id === 'actions'}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</DataTableHeadCell>
									))}
							</TableRow>
						))}
					</TableHeader>
					<DataTableBody
						loading={loading}
						skeletonRows={pagination.pageSize || 5}
						columnIds={visibleColumnIds}
						rows={rows}
						emptyState={emptyState}
						hasActiveFilters={hasActiveFilters}
					/>
				</Table>
			</div>

			{!disablePagination && (
				<DataTablePagination
					pagination={pagination}
					totalCount={totalCount}
					canPrevious={table.getCanPreviousPage()}
					canNext={table.getCanNextPage()}
					onPrevious={() => table.previousPage()}
					onNext={() => table.nextPage()}
					onPageSize={changePageSize}
					disablePageSizeOptions={disablePageSizeOptions}
				/>
			)}
		</div>
	)
}
