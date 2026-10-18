'use client'

import type {
	DataTableColumnDef,
	DataTableFeatures,
	DataTableProps,
	VisibleColumn,
} from 'types/components'
import type {
	ColumnFiltersState,
	ColumnVisibilityState,
	RowData,
	SortingState,
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '@headlessui/react'
import { FiSearch } from 'react-icons/fi'
import { useSearchParams } from 'next/navigation'
import { MdOutlineFilterAltOff } from 'react-icons/md'
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from 'react-icons/hi2'
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
import { Skeleton } from '../skeleton'
import { EmptyState } from '../empty-state'
import { classNames } from 'utils/classNames'
import { FilterControl } from './filter-control'
import { DateRangeFilter } from './date-range-filter'
import { useTableUrlSync } from './use-table-url-sync'
import { DataTablePagination } from './data-table-pagination'
import { ColumnVisibilityMenu } from './column-visibility-menu'
import { CONTROL, ICON, SEARCH_ICON, STICKY_ACTIONS } from './data-table-styles'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

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

	// Table state lives in the URL so filters survive reloads and can be shared. The prefix
	// keeps the parameters of several tables on one page apart.
	const prefix = identifier ? `${identifier}_` : ''
	const param = (key: string) => searchParams.get(`${prefix}${key}`)

	const defaultPageSize = useRef(pageSize).current
	const initialPageSize = param('pageSize')
		? Number(param('pageSize'))
		: disablePagination
			? totalCount
			: defaultPageSize

	const [sorting, setSorting] = useState<SortingState>(
		param('sortBy') ? [{ id: param('sortBy') || '', desc: param('order') === 'desc' }] : [],
	)
	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(
		Object.fromEntries(
			Array.from(searchParams.entries())
				.filter(([key]) => key.startsWith(`hide_${prefix}`))
				.map(([key]) => [key.replace(`hide_${prefix}`, ''), false]),
		),
	)
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		filters ? filters.map(filter => ({ id: filter.id, value: param(filter.id) ?? '' })) : [],
	)
	const [search, setSearch] = useState(param('search') || '')
	const [date, setDate] = useState({ from: param('from') || '', to: param('to') || '' })
	const [pagination, setPagination] = useState({
		pageIndex: param('page') ? Number(param('page')) - 1 : 0,
		pageSize: initialPageSize,
	})

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

	const visibleColumnCount = Math.max(
		table.getAllColumns().filter(column => column.getIsVisible()).length,
		1,
	)

	const hideableColumns: VisibleColumn[] = table
		.getAllColumns()
		.filter(column => column.getCanHide())
		.map(column => ({
			id: column.id,
			label: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id,
			visible: column.getIsVisible(),
			toggle: () => column.toggleVisibility(!column.getIsVisible()),
		}))

	return (
		<div className='relative flex w-full flex-col gap-4'>
			<div className='text-foreground flex items-center justify-between gap-2'>
				<div className='flex w-full flex-wrap items-center gap-2'>
					<div className={classNames('relative w-full max-w-3xs', { hidden: disableSearch })}>
						<FiSearch className={SEARCH_ICON} />
						<Input
							type='text'
							value={search}
							placeholder='Search...'
							aria-label='Search'
							disabled={disableSearch}
							onChange={e => setSearch(e.target.value)}
							className={classNames(CONTROL, 'w-full pr-3 pl-9')}
						/>
					</div>
					{filters?.map(filter => (
						<FilterControl
							key={filter.id}
							filter={filter}
							value={table.getColumn(filter.id)?.getFilterValue()?.toString()}
							onChange={value => table.getColumn(filter.id)?.setFilterValue(value)}
						/>
					))}
					<DateRangeFilter value={date} onChange={setDate} hidden={disableDateRange} />
				</div>
				<div className='flex items-center justify-center gap-2'>
					<button
						type='reset'
						aria-label='Reset Filters'
						disabled={disableClearFilters}
						onClick={clearFilters}
						className={classNames(
							CONTROL,
							'flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap',
							{ hidden: disableClearFilters },
						)}>
						<MdOutlineFilterAltOff className={classNames(ICON, 'size-5')} aria-hidden='true' />{' '}
						Clear Filters
					</button>
					<ColumnVisibilityMenu columns={hideableColumns} hidden={disableColumnVisibility} />
				</div>
			</div>

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
									.map(header => {
										const canSort = header.column.getCanSort() && !disableSorting
										const sorted = header.column.getIsSorted()
										const label =
											typeof header.column.columnDef.header === 'string'
												? header.column.columnDef.header
												: header.id

										return (
											<TableHead
												key={header.id}
												className={classNames(
													'select-none',
													header.column.id === 'actions' &&
														'sticky right-0 z-10 bg-[color-mix(in_oklab,var(--signal)_10%,var(--surface))]',
												)}
												aria-sort={
													canSort
														? sorted === 'asc'
															? 'ascending'
															: sorted === 'desc'
																? 'descending'
																: 'none'
														: undefined
												}>
												<div className='flex items-center justify-between gap-2'>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
													{canSort && (
														<button
															type='button'
															onClick={header.column.getToggleSortingHandler()}
															aria-label={`Sort by ${label}`}
															className='focus-ring:ring-signal/40 focus-ring:ring-2 inline-flex cursor-pointer items-center rounded outline-none'>
															{{
																asc: (
																	<HiChevronDown
																		className='fill-muted-foreground size-4'
																		aria-hidden='true'
																	/>
																),
																desc: (
																	<HiChevronUp
																		className='fill-muted-foreground size-4'
																		aria-hidden='true'
																	/>
																),
															}[sorted as string] ?? (
																<HiChevronUpDown
																	className='fill-muted-foreground size-4'
																	aria-hidden='true'
																/>
															)}
														</button>
													)}
												</div>
											</TableHead>
										)
									})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ? (
							Array.from({ length: pagination.pageSize || 5 }, (_, row) => `skeleton-${row}`).map(
								key => (
									<TableRow key={key} className='hover:bg-transparent'>
										{table
											.getAllColumns()
											.filter(column => column.getIsVisible())
											.map(column => (
												<TableCell key={column.id}>
													<Skeleton className='h-6 w-full rounded-sm' />
												</TableCell>
											))}
									</TableRow>
								),
							)
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} className='group/row even:bg-surface-strong/40'>
									{row.getVisibleCells().map(cell => (
										<TableCell
											key={cell.id}
											className={cell.column.id === 'actions' ? STICKY_ACTIONS : undefined}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className='hover:bg-transparent'>
								<TableCell colSpan={visibleColumnCount} className='p-0'>
									{emptyState && !hasActiveFilters ? (
										<EmptyState
											title={emptyState.title}
											description={emptyState.description}
											action={emptyState.action}
										/>
									) : (
										<EmptyState
											title='No data found'
											description={
												hasActiveFilters
													? 'Nothing matches the selected filters. Try another search or clear the filters.'
													: 'There is nothing here yet.'
											}
										/>
									)}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
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
