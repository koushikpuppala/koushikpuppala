'use client'

import type { DataTableProps } from 'types/components'
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import dayjs from 'dayjs'
import {
	HiCheck,
	HiChevronDown,
	HiChevronLeft,
	HiChevronRight,
	HiChevronUp,
	HiChevronUpDown,
	HiXMark,
} from 'react-icons/hi2'
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
import { randomUUIDArray } from 'utils/random'
import { IoCalendarOutline } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineFilterAltOff } from 'react-icons/md'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { formatDate } from 'utils/formatDate'

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
		manualSorting: true,
		manualFiltering: true,
		enableMultiSort: false,
		manualPagination: true,
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
		<div className='flex w-full flex-col gap-2'>
			<div className='flex items-center justify-between gap-2 text-neutral-300'>
				<div className='flex w-full flex-wrap items-center gap-2'>
					<div className={classNames('relative w-full max-w-3xs', { hidden: disableSearch })}>
						<FiSearch className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
						<Input
							type='text'
							value={search}
							placeholder='Search...'
							disabled={disableSearch}
							onChange={e => setSearch?.(e.target.value)}
							className='w-full max-w-3xs rounded-md border border-neutral-100/10 bg-neutral-100/0 py-2 pr-3 pl-9 text-sm font-medium shadow transition-all outline-none hover:bg-neutral-100/5'
						/>
					</div>
					{filters?.map(filter => {
						const { id, type, label, options } = filter
						const value = table.getColumn(id)?.getFilterValue()?.toString()

						switch (type) {
							case 'search':
								return (
									<div key={id} className='relative w-full max-w-3xs'>
										<FiSearch className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />

										<Input
											type='text'
											value={value ?? ''}
											placeholder={label}
											onChange={e => table.getColumn(id)?.setFilterValue(e.target.value ?? '')}
											className={classNames(
												'w-full max-w-3xs rounded-md border border-neutral-100/10 bg-neutral-100/0 py-2 pr-3 pl-9 text-sm font-medium shadow transition-all outline-none hover:bg-neutral-100/5',
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
												'flex w-full max-w-44 cursor-pointer items-center justify-between rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow transition-all outline-none hover:bg-neutral-900/5',
											)}>
											<span className={classNames('truncate', { 'text-neutral-500': !value })}>
												{options?.find(option => option.value === value)?.label ?? label}
											</span>
											<div className='flex items-center justify-center gap-0.5'>
												<HiChevronDown
													className='pointer-events-none size-4 fill-neutral-100/60'
													aria-hidden='true'
												/>
												<HiXMark
													onClick={() => table.getColumn(id)?.setFilterValue('')}
													className={classNames(
														'size-4 cursor-pointer fill-neutral-100 p-0.5 hover:fill-neutral-200',
														{ hidden: !value },
													)}
													aria-hidden='true'
												/>
											</div>
										</ListboxButton>
										<ListboxOptions
											transition={true}
											anchor='bottom start'
											className='scrollbar-none mt-0.5 w-(--button-width) rounded-md border border-neutral-100/10 bg-neutral-800 p-1 shadow-2xl outline-none'>
											{options.map(option => (
												<ListboxOption
													key={option.value}
													value={option}
													className='group flex w-full cursor-pointer items-center rounded-md px-2 py-1 text-sm capitalize hover:bg-neutral-100/10'>
													<HiCheck className='invisible mr-2 size-3 group-data-selected:visible' />
													<span className='text-sm/6'>{option.label}</span>
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
													'flex w-full max-w-44 cursor-pointer items-center justify-between rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow transition-all outline-none hover:bg-neutral-100/5',
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
													className='pointer-events-none size-4 fill-neutral-100/60'
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
													className='size-4 cursor-pointer fill-neutral-100 p-0.5 hover:fill-neutral-200'
													aria-hidden='true'
												/>
											</div>
										</div>
										<ComboboxOptions
											transition={true}
											anchor='bottom start'
											className='scrollbar-none mt-0.5 w-(--input-width) rounded-md border border-neutral-100/10 bg-neutral-800 p-1 shadow-2xl outline-none'>
											{filteredOptions.length > 0 ? (
												filteredOptions.map(option => (
													<ComboboxOption
														key={option.value}
														value={option}
														className='group flex w-full cursor-pointer items-center rounded-md px-2 py-1 text-sm capitalize hover:bg-neutral-100/10'>
														<HiCheck className='invisible mr-2 size-3 group-data-selected:visible' />
														<div className='text-sm/6'>{option.label}</div>
													</ComboboxOption>
												))
											) : (
												<ComboboxOption
													value={null}
													disabled={true}
													className='group flex w-full cursor-not-allowed items-center rounded-md px-2 py-1 text-sm capitalize opacity-50'>
													<div className='text-sm/6'>No options found</div>
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
							className='flex cursor-pointer items-center justify-center rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow transition-all outline-none hover:bg-neutral-100/5'>
							<IoCalendarOutline className='pointer-events-none mr-2 inline-block size-4 fill-neutral-100/60' />
							<span
								className={classNames('truncate', {
									'text-neutral-500': !date.from && !date.to,
								})}>
								{date.from && date.to
									? `${formatDate(date.from)} to ${formatDate(date.to)}`
									: 'Select Date Range'}
							</span>
						</MenuButton>
						<MenuItems
							transition={true}
							anchor='bottom start'
							className='mt-0.5 rounded-md border border-neutral-900/10 bg-neutral-800 p-1 shadow-2xl outline-none'>
							<DateRange
								onChange={item =>
									setDate({
										from: dayjs(item.selection.startDate).format('YYYY-MM-DD'),
										to: dayjs(item.selection.endDate).format('YYYY-MM-DD'),
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
									className='flex w-full items-center justify-center rounded-md border border-neutral-100/25 bg-neutral-100/0 px-4 py-2 text-sm text-neutral-300 transition-all hover:bg-neutral-100/5'>
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
							'flex cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium whitespace-nowrap shadow transition-all outline-none hover:bg-neutral-100/5',
							{ hidden: disableClearFilters },
						)}>
						<MdOutlineFilterAltOff className='size-5 fill-neutral-300' /> Clear Filters
					</button>
					<Menu as='div' className={classNames({ hidden: disableColumnVisibility })}>
						<MenuButton
							aria-label='Columns Visibility'
							className='relative flex cursor-pointer items-center justify-center rounded-md border border-neutral-100/10 bg-neutral-100/0 p-0.5 text-sm font-medium whitespace-nowrap shadow transition-all outline-none hover:bg-neutral-100/5'>
							<span className='sr-only'>Columns Visibility</span>
							<CiViewList className='size-8 shrink-0 fill-neutral-300' />
						</MenuButton>
						<MenuItems
							transition={true}
							anchor='bottom end'
							className='mt-0.5 rounded-md border border-neutral-100/10 bg-neutral-800 p-1 shadow-2xl outline-none'>
							{table
								.getAllColumns()
								.filter(column => column.getCanHide())
								.map(column => {
									const isVisible = column.getIsVisible()
									return (
										<MenuItem key={column.id}>
											<button
												type='button'
												className='flex w-full cursor-pointer items-center rounded-md px-2 py-1 text-sm capitalize hover:bg-neutral-100/10'
												onClick={() => column.toggleVisibility(!isVisible)}>
												<FaCheck className={classNames('mr-2 size-3', { invisible: !isVisible })} />
												<span className='text-sm/6'>{column.columnDef.header?.toString()}</span>
											</button>
										</MenuItem>
									)
								})}
						</MenuItems>
					</Menu>
				</div>
			</div>
			<div className='overflow-hidden rounded-md border border-neutral-100/10'>
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
																'ml-1 inline-flex cursor-pointer items-center',
																{ hidden: disableSorting },
															)}>
															{{
																asc: <HiChevronDown className='size-4 fill-neutral-100/60' />,
																desc: <HiChevronUp className='size-4 fill-neutral-100/60' />,
															}[header.column.getIsSorted() as string] ?? (
																<HiChevronUpDown className='size-4 fill-neutral-100/60' />
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
							randomUUIDArray(pagination.pageSize).map(key => (
								<TableRow
									key={key}
									className={classNames({ 'animate-pulse hover:bg-transparent': loading })}>
									{table
										.getAllColumns()
										.filter(column => column.getIsVisible())
										.map(column => (
											<TableCell key={column.id}>
												<div className='h-6 w-full rounded-sm bg-neutral-700'>&nbsp;</div>
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
									className='text-text-muted h-24 text-center'>
									No data found for the selected filters.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div
				className={classNames(
					'flex flex-col items-center justify-between gap-2 pb-2 text-neutral-300 lg:flex-row',
					{ hidden: disablePagination },
				)}>
				<div className='text-muted-foreground flex w-full justify-center text-sm lg:justify-start'>
					Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
					{Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of {totalCount}{' '}
					entries
				</div>
				<div
					className={classNames('flex w-full items-center justify-center gap-2 lg:justify-end', {
						hidden: disablePageSizeOptions,
					})}>
					<span className='text-muted-foreground text-sm'>Rows per page:</span>
					<div className='relative'>
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
							className='cursor-pointer appearance-none rounded-md border border-neutral-100/10 bg-neutral-100/0 px-2 py-1.5 pr-6 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5'>
							{[10, 25, 50, 100].map(size => (
								<option key={size} value={size} className='bg-neutral-800 text-sm'>
									{size}
								</option>
							))}
						</select>
						<span className='pointer-events-none absolute inset-y-0 right-2 flex items-center text-neutral-300'>
							<HiChevronDown className='size-4' aria-hidden='true' />
						</span>
					</div>
				</div>
				<div className='flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-end'>
					<button
						type='button'
						aria-label='Go to previous page'
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						className='flex cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-100/10 bg-neutral-700/50 px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none not-disabled:hover:bg-neutral-100/5 disabled:cursor-not-allowed disabled:opacity-50'>
						<HiChevronLeft className='size-5 shrink-0 text-neutral-300' />
						Previous
					</button>
					<button
						type='button'
						aria-label='Go to next page'
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						className='flex cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-100/10 bg-neutral-700/50 px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none not-disabled:hover:bg-neutral-100/5 disabled:cursor-not-allowed disabled:opacity-50'>
						Next
						<HiChevronRight className='size-5 shrink-0 text-neutral-300' />
					</button>
				</div>
			</div>
		</div>
	)
}
