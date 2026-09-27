'use client'

import type { DataTableProps } from 'types/components'
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import dayjs from 'dayjs'
import { HiCheck, HiChevronDown, HiChevronUp, HiChevronUpDown, HiXMark } from 'react-icons/hi2'
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Input,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from '@headlessui/react'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { FaCheck } from 'react-icons/fa6'
import { FiSearch } from 'react-icons/fi'
import { CiViewList } from 'react-icons/ci'
import { DateRange } from 'react-date-range'
import { classNames } from 'utils/classNames'
import { formatDate } from 'utils/formatDate'
import { randomUUIDArray } from 'utils/random'
import { IoCalendarOutline } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineFilterAltOff } from 'react-icons/md'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

export const DataTable = <TData, TValue>(props: DataTableProps<TData, TValue>) => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	const isInitialRender = useRef(true)

	const { columns, data, filters, totalCount } = props
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

	const PREFIX = identifier ? `${identifier}_` : ''
	const DEFAULT_PAGE_SIZE = useRef(pageSize).current
	const INITIAL_PAGE_SIZE = searchParams.get(`${PREFIX}pageSize`)
		? Number(searchParams.get(`${PREFIX}pageSize`))
		: disablePagination
			? totalCount
			: DEFAULT_PAGE_SIZE

	const [sorting, setSorting] = useState<SortingState>(
		searchParams.get(`${PREFIX}sortBy`)
			? [
					{
						id: searchParams.get(`${PREFIX}sortBy`) || '',
						desc: searchParams.get(`${PREFIX}order`) === 'desc',
					},
				]
			: [],
	)
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		...Object.fromEntries(
			Array.from(searchParams.entries())
				.filter(([key]) => key.startsWith(`hide_${PREFIX}`))
				.map(([key]) => [key.replace(`hide_${PREFIX}`, ''), false]),
		),
	})
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		filters
			? filters.map(filter => {
					return { id: filter.id, value: searchParams.get(`${PREFIX}${filter.id}`) ?? '' }
				})
			: [],
	)

	const [query, setQuery] = useState('')
	const [search, setSearch] = useState(searchParams.get(`${PREFIX}search`) || '')
	const [date, setDate] = useState({
		from: searchParams.get(`${PREFIX}from`) || '',
		to: searchParams.get(`${PREFIX}to`) || '',
	})
	const [pagination, setPagination] = useState({
		pageIndex: searchParams.get(`${PREFIX}page`)
			? Number(searchParams.get(`${PREFIX}page`)) - 1
			: 0,
		pageSize: INITIAL_PAGE_SIZE,
	})

	const table = useReactTable({
		data,
		manualSorting: props.manualSorting ?? true,
		manualFiltering: props.manualFiltering ?? true,
		enableMultiSort: false,
		manualPagination: props.manualPagination ?? true,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		getPaginationRowModel: getPaginationRowModel(),
		columns: columns.length ? columns : [{ accessorKey: '__empty', header: '' }],
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

	useEffect(() => {
		const queryParams = new URLSearchParams()

		// keep params not belonging to this table
		for (const [key, value] of searchParams.entries())
			if (!key.startsWith(PREFIX) && !key.startsWith(`hide_${PREFIX}`)) queryParams.set(key, value)

		if (pagination.pageIndex !== 0)
			queryParams.set(`${PREFIX}page`, (pagination.pageIndex + 1).toString())
		else queryParams.delete(`${PREFIX}page`)

		if (!disablePageSizeOptions && pagination.pageSize !== DEFAULT_PAGE_SIZE)
			queryParams.set(`${PREFIX}pageSize`, pagination.pageSize.toString())
		else queryParams.delete(`${PREFIX}pageSize`)

		if (!disableSearch && search) queryParams.set(`${PREFIX}search`, search)
		else queryParams.delete(`${PREFIX}search`)

		if (!disableDateRange && date.from) queryParams.set(`${PREFIX}from`, date.from)
		else queryParams.delete(`${PREFIX}from`)

		if (!disableDateRange && date.to) queryParams.set(`${PREFIX}to`, date.to)
		else queryParams.delete(`${PREFIX}to`)

		Object.entries(columnVisibility).forEach(([key, value]) => {
			if (!value) queryParams.set(`hide_${PREFIX}${key}`, 'true')
			else queryParams.delete(`hide_${PREFIX}${key}`)
		})

		sorting.map(sort => {
			if (sort.id && sort.desc !== undefined) {
				queryParams.set(`${PREFIX}sortBy`, sort.id)
				queryParams.set(`${PREFIX}order`, sort.desc ? 'desc' : 'asc')
			}

			return sort
		})

		columnFilters.map(
			filter =>
				filter.value && queryParams.set(`${PREFIX}${filter.id?.trim()}`, String(filter.value)),
		)

		const nextUrlParams = new URLSearchParams([...queryParams.entries()].sort())
		const currentUrlParams = new URLSearchParams([...searchParams.entries()].sort())

		const nextUrl = `${pathname}?${nextUrlParams.toString()}`
		const currentUrl = `${pathname}?${currentUrlParams.toString()}`

		if (nextUrl !== currentUrl) router.replace(nextUrl, { scroll: false })
	}, [
		// routing
		PREFIX,
		router,
		pathname,
		searchParams,

		// pagination (primitive only)
		pagination.pageSize,
		pagination.pageIndex,

		// table state
		search,
		sorting,
		date.to,
		date.from,
		columnFilters,
		columnVisibility,

		// config
		disableSearch,
		disableDateRange,
		DEFAULT_PAGE_SIZE,
		disablePageSizeOptions,
	])

	const handleClearFilters = () => {
		setQuery('')
		setSearch('')
		setDate({ from: '', to: '' })
		setPagination({ pageIndex: 0, pageSize: disablePagination ? totalCount : pageSize })

		table.resetSorting()
		table.resetGlobalFilter()
		table.resetColumnFilters()
		table.resetColumnVisibility()
	}

	return (
		<div className='flex w-full flex-col gap-4'>
			<div className='text-foreground flex items-center justify-between gap-2'>
				<div className='flex w-full flex-wrap items-center gap-2'>
					<div className={classNames('relative w-full max-w-xs', { hidden: disableSearch })}>
						<FiSearch className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
						<Input
							type='text'
							value={search}
							placeholder='Search...'
							disabled={disableSearch}
							onChange={e => setSearch?.(e.target.value)}
							className='border-border bg-surface text-foreground focus:ring-signal-ink w-full max-w-xs rounded-lg border py-2 pr-3 pl-9 font-mono text-xs focus:ring-1 focus:outline-none'
						/>
					</div>
					{filters?.map(filter => {
						const { id, type, label, options } = filter
						const value = table.getColumn(id)?.getFilterValue()?.toString()

						switch (type) {
							case 'search':
								return (
									<div key={id} className='relative w-full max-w-xs'>
										<FiSearch className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />

										<Input
											type='text'
											value={value ?? ''}
											placeholder={label}
											onChange={e => table.getColumn(id)?.setFilterValue(e.target.value ?? '')}
											className={classNames(
												'border-border bg-surface text-foreground focus:ring-signal-ink w-full max-w-xs rounded-lg border py-2 pr-3 pl-9 font-mono text-xs focus:ring-1 focus:outline-none',
											)}
										/>
									</div>
								)
							case 'select':
								return (
									<Listbox
										key={id}
										value={options.find(option => option.value === value) ?? null}
										onChange={option => table.getColumn(id)?.setFilterValue(option?.value ?? '')}>
										<ListboxButton
											className={classNames(
												'border-border bg-surface text-foreground hover:bg-accent flex w-full max-w-44 cursor-pointer items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none',
											)}>
											<span className={classNames('truncate', { 'text-muted-foreground': !value })}>
												{options?.find(option => option.value === value)?.label ?? label}
											</span>
											<div className='flex items-center justify-center gap-0.5'>
												<HiChevronDown
													className='fill-muted-foreground pointer-events-none size-4'
													aria-hidden='true'
												/>
												<HiXMark
													onClick={() => table.getColumn(id)?.setFilterValue('')}
													className={classNames(
														'fill-muted-foreground hover:fill-foreground size-4 cursor-pointer p-0.5',
														{ hidden: !value },
													)}
													aria-hidden='true'
												/>
											</div>
										</ListboxButton>
										<ListboxOptions
											transition={true}
											anchor='bottom start'
											className='border-border bg-surface mt-0.5 w-(--button-width) scrollbar-none rounded-xl border p-1 font-mono text-xs shadow-lg outline-none'>
											{options.map(option => (
												<ListboxOption
													key={option.value}
													value={option}
													className='group hover:bg-accent text-foreground flex w-full cursor-pointer items-center rounded-lg px-2 py-1.5 capitalize'>
													<HiCheck className='invisible mr-2 size-3 group-data-selected:visible' />
													<span>{option.label}</span>
												</ListboxOption>
											))}
										</ListboxOptions>
									</Listbox>
								)
							case 'search-select': {
								const filteredOptions = options.filter(option =>
									option.label.toLowerCase().includes(query.toLowerCase()),
								)
								return (
									<Combobox
										key={id}
										onClose={() => setQuery('')}
										value={options.find(option => option.value === value) ?? null}
										onChange={option => table.getColumn(id)?.setFilterValue(option?.value ?? '')}>
										<div className='relative'>
											<ComboboxInput
												className={classNames(
													'border-border bg-surface text-foreground hover:bg-accent flex w-full max-w-44 cursor-pointer items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none',
												)}
												placeholder={label}
												value={
													value ? options.find(option => option.value === value)?.label : query
												}
												displayValue={(option: (typeof options)[number]) => option?.label || label}
												onChange={event => setQuery(event.target.value)}
											/>
											<ComboboxButton
												className={classNames('group absolute inset-y-0 px-2.5', {
													'right-0': !value,
													'right-6': value,
												})}>
												<HiChevronUpDown
													className='fill-muted-foreground pointer-events-none size-4'
													aria-hidden='true'
												/>
											</ComboboxButton>
											<div
												className={classNames(
													'group absolute inset-y-0 right-0 flex items-center justify-center px-2.5',
													{ hidden: !value },
												)}>
												<HiXMark
													onClick={() => table.getColumn(id)?.setFilterValue('')}
													className='fill-muted-foreground hover:fill-foreground size-4 cursor-pointer p-0.5'
													aria-hidden='true'
												/>
											</div>
										</div>
										<ComboboxOptions
											transition={true}
											anchor='bottom start'
											className='border-border bg-surface mt-0.5 w-(--input-width) scrollbar-none rounded-xl border p-1 font-mono text-xs shadow-lg outline-none'>
											{filteredOptions.length > 0 ? (
												filteredOptions.map(option => (
													<ComboboxOption
														key={option.value}
														value={option}
														className='group hover:bg-accent text-foreground flex w-full cursor-pointer items-center rounded-lg px-2 py-1.5 capitalize'>
														<HiCheck className='invisible mr-2 size-3 group-data-selected:visible' />
														<div>{option.label}</div>
													</ComboboxOption>
												))
											) : (
												<ComboboxOption
													value={null}
													disabled={true}
													className='group text-muted-foreground flex w-full cursor-not-allowed items-center rounded-lg px-2 py-1.5 capitalize opacity-50'>
													<div>No options found</div>
												</ComboboxOption>
											)}
										</ComboboxOptions>
									</Combobox>
								)
							}
							default:
								return null
						}
					})}
					<Menu as='div' className={classNames({ hidden: disableDateRange })}>
						<MenuButton
							aria-label='Columns Visibility'
							className='border-border bg-surface text-foreground hover:bg-accent flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none'>
							<IoCalendarOutline className='fill-muted-foreground pointer-events-none mr-2 inline-block size-4' />
							<span
								className={classNames('truncate', {
									'text-muted-foreground': !date.from && !date.to,
								})}>
								{date.from && date.to
									? `${formatDate(date.from)} to ${formatDate(date.to)}`
									: 'Select Date Range'}
							</span>
						</MenuButton>
						<MenuItems
							transition={true}
							anchor='bottom start'
							className='border-border bg-surface mt-0.5 rounded-xl border p-1 font-mono text-xs shadow-lg outline-none'>
							<DateRange
								onChange={item =>
									setDate({
										from: dayjs(item.selection?.startDate).format('YYYY-MM-DD'),
										to: dayjs(item.selection?.endDate).format('YYYY-MM-DD'),
									})
								}
								ranges={[
									{
										startDate: date.from ? new Date(date.from) : new Date(),
										endDate: date.to ? new Date(date.to) : new Date(),
										key: 'selection',
									},
								]}
								maxDate={new Date()}
								editableDateInputs={true}
								dateDisplayFormat='dd MMM yyyy'
								moveRangeOnFirstSelection={true}
								retainEndDateOnFirstSelection={true}
								rangeColors={['var(--color-accent)']}
								minDate={new Date('2020-01-01')}
							/>
							<div
								className={classNames('flex items-center justify-center px-4 pb-2', {
									hidden: !date.from && !date.to,
								})}>
								<button
									type='button'
									onClick={() => setDate({ from: '', to: '' })}
									className='border-border bg-surface text-foreground hover:bg-accent flex w-full items-center justify-center rounded-lg border px-4 py-2 text-xs transition-all'>
									Clear Date Range
								</button>
							</div>
						</MenuItems>
					</Menu>
				</div>
				<div className='flex items-center justify-center gap-2'>
					<button
						type='reset'
						aria-label='Reset Filters'
						disabled={disableClearFilters}
						onClick={() => handleClearFilters()}
						className={classNames(
							'border-border bg-surface text-foreground hover:bg-accent flex cursor-pointer items-center justify-center gap-1 rounded-lg border px-3 py-2 font-mono text-xs whitespace-nowrap focus:outline-none',
							{ hidden: disableClearFilters },
						)}>
						<MdOutlineFilterAltOff className='fill-muted-foreground size-4' /> Clear Filters
					</button>
					<Menu as='div' className={classNames({ hidden: disableColumnVisibility })}>
						<MenuButton
							aria-label='Columns Visibility'
							className='border-border bg-surface hover:bg-accent relative flex cursor-pointer items-center justify-center rounded-lg border p-1 font-mono text-xs whitespace-nowrap focus:outline-none'>
							<span className='sr-only'>Columns Visibility</span>
							<CiViewList className='fill-muted-foreground size-6 shrink-0' />
						</MenuButton>
						<MenuItems
							transition={true}
							anchor='bottom end'
							className='border-border bg-surface mt-0.5 rounded-xl border p-1 font-mono text-xs shadow-lg outline-none'>
							{table
								.getAllColumns()
								.filter(column => column.getCanHide())
								.map(column => {
									const isVisible = column.getIsVisible()
									return (
										<MenuItem key={column.id}>
											<button
												type='button'
												className='hover:bg-accent text-foreground flex w-full cursor-pointer items-center rounded-lg px-2 py-1.5 capitalize'
												onClick={() => column.toggleVisibility(!isVisible)}>
												<FaCheck className={classNames('mr-2 size-3', { invisible: !isVisible })} />
												<span>{column.columnDef.header?.toString()}</span>
											</button>
										</MenuItem>
									)
								})}
						</MenuItems>
					</Menu>
				</div>
			</div>
			<div className='border-border bg-surface overflow-hidden rounded-2xl border shadow-xs'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers
									.filter(header => header.column.getIsVisible())
									.map(header => {
										return (
											<TableHead key={header.id} className='select-none'>
												<div className='flex items-center justify-between'>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
													{header.column.getCanSort() && (
														<button
															type='button'
															onClick={header.column.getToggleSortingHandler()}
															className={classNames(
																'text-muted-foreground hover:text-foreground ml-1 inline-flex cursor-pointer items-center',
																{ hidden: disableSorting },
															)}>
															{{
																asc: <HiChevronDown className='fill-muted-foreground size-4' />,
																desc: <HiChevronUp className='fill-muted-foreground size-4' />,
															}[header.column.getIsSorted() as string] ?? (
																<HiChevronUpDown className='fill-muted-foreground size-4' />
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
							randomUUIDArray(Math.min(pagination.pageSize, 5)).map(key => (
								<TableRow key={key} className='hover:bg-transparent'>
									{table
										.getAllColumns()
										.filter(column => column.getIsVisible())
										.map(column => (
											<TableCell key={column.id}>
												<div className='bg-accent/50 h-5 w-full animate-pulse rounded-md'>
													&nbsp;
												</div>
											</TableCell>
										))}
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className='hover:bg-transparent'>
								<TableCell
									colSpan={Math.max(columns.length, 1)}
									className='text-muted-foreground h-24 text-center'>
									No data found matching your filters.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Integrated Table Footer / Counter & Pagination */}
				{!disablePagination && (
					<div className='border-border text-muted-foreground bg-surface flex flex-col items-center justify-between gap-3 border-t px-4 py-3 font-mono text-xs sm:flex-row'>
						<div>
							Showing {totalCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1} to{' '}
							{Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of{' '}
							{totalCount} records
						</div>
						<div className='flex items-center gap-4'>
							{!disablePageSizeOptions && (
								<div className='flex items-center gap-2'>
									<span>Rows per page:</span>
									<select
										value={pagination.pageSize}
										onChange={e => {
											const newSize = Number(e.target.value)
											const maxPageIndex = Math.max(0, Math.ceil(totalCount / newSize) - 1)

											setPagination(prev => ({
												pageIndex: Math.min(prev.pageIndex, maxPageIndex),
												pageSize: newSize,
											}))
										}}
										className='border-border bg-surface text-foreground cursor-pointer rounded-lg border px-2 py-1 font-mono text-xs focus:outline-none'>
										{[10, 25, 50, 100].map(size => (
											<option key={size} value={size}>
												{size}
											</option>
										))}
									</select>
								</div>
							)}
							<div className='flex items-center gap-1.5'>
								<button
									type='button'
									disabled={!table.getCanPreviousPage()}
									onClick={() => table.previousPage()}
									className='border-border bg-surface text-foreground hover:bg-accent cursor-pointer rounded-lg border px-3 py-1.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40'>
									Previous
								</button>
								<button
									type='button'
									disabled={!table.getCanNextPage()}
									onClick={() => table.nextPage()}
									className='border-border bg-surface text-foreground hover:bg-accent cursor-pointer rounded-lg border px-3 py-1.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40'>
									Next
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
