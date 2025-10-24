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
import { CiViewList } from 'react-icons/ci'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-date-range'
import { classNames } from 'utils/classNames'
import { MdOutlineFilterAltOff } from 'react-icons/md'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

export const DataTable = <TData, TValue>(props: DataTableProps<TData, TValue>) => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const { columns, data, filters, totalCount } = props
	const {
		pageSize = 10,
		loading = false,
		disableSearch = false,
		disableDateRange = false,
		disablePagination = false,
		disableClearFilters = false,
		disableColumnVisibility = false,
	} = props

	const [sorting, setSorting] = useState<SortingState>(
		searchParams.get('sortBy')
			? [{ id: searchParams.get('sortBy') || '', desc: searchParams.get('order') === 'desc' }]
			: [],
	)
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		...Object.fromEntries(
			Array.from(searchParams.entries())
				.filter(([key]) => key.startsWith('hide_'))
				.map(([key]) => [key.replace('hide_', ''), false]),
		),
	})
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		filters
			? filters.map(filter => ({
					id: filter.id,
					value: searchParams.get(filter.id) ?? '',
				}))
			: [],
	)

	const [query, setQuery] = useState('')
	const [search, setSearch] = useState(searchParams.get('search') || '')
	const [date, setDate] = useState({
		from: searchParams.get('from') || '',
		to: searchParams.get('to') || '',
	})
	const [pagination, setPagination] = useState({
		pageIndex: searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0,
		pageSize: disablePagination
			? totalCount
			: searchParams.get('pageSize')
				? Number(searchParams.get('pageSize'))
				: pageSize,
	})

	const table = useReactTable({
		data,
		columns,
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
		pageCount: disablePagination ? 1 : Math.ceil(totalCount / pagination.pageSize),
		state: { sorting, pagination, columnFilters, columnVisibility, globalFilter: search },
		onPaginationChange: updater =>
			setPagination(prev => (typeof updater === 'function' ? updater(prev) : updater)),
	})

	useEffect(() => {
		const queryParams = new URLSearchParams()

		if (pagination.pageIndex !== 0) queryParams.set('page', (pagination.pageIndex + 1).toString())
		else queryParams.delete('page')

		if (pagination.pageSize !== pageSize)
			queryParams.set('pageSize', pagination.pageSize.toString())
		else queryParams.delete('pageSize')

		if (search) queryParams.set('search', search)
		else queryParams.delete('search')

		if (date.from) queryParams.set('from', date.from)
		else queryParams.delete('from')

		if (date.to) queryParams.set('to', date.to)
		else queryParams.delete('to')

		Object.entries(columnVisibility).forEach(([key, value]) => {
			if (!value) queryParams.set(`hide_${key}`, 'true')
			else queryParams.delete(`hide_${key}`)
		})

		sorting.map(sort => {
			if (sort.id && sort.desc !== undefined) {
				queryParams.set('sortBy', sort.id)
				queryParams.set('order', sort.desc ? 'desc' : 'asc')
			}
			return sort
		})

		columnFilters.forEach(
			filter => filter.value && queryParams.set(filter.id?.trim(), String(filter.value)),
		)

		router.replace(`${pathname}?${queryParams.toString()}`)
	}, [
		date,
		router,
		search,
		sorting,
		pathname,
		pageSize,
		pagination,
		columnFilters,
		columnVisibility,
	])

	const handleClearFilters = () => {
		setQuery('')
		setSearch('')
		setDate({ from: '', to: '' })
		setPagination({ pageIndex: 0, pageSize: 10 })

		table.resetSorting()
		table.resetGlobalFilter()
		table.resetColumnFilters()
		table.resetColumnVisibility()
	}

	return (
		<div className='flex w-full flex-col gap-2'>
			<div className='flex items-center justify-between gap-2 text-neutral-300'>
				<div className='flex w-full flex-wrap items-center gap-2'>
					<Input
						type='text'
						value={search}
						onChange={e => setSearch?.(e.target.value)}
						placeholder='Search...'
						className={classNames(
							'w-full max-w-3xs rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5',
							{ hidden: disableSearch },
						)}
					/>
					{filters?.map(filter => {
						const { id, type, label, options } = filter
						const value = table.getColumn(id)?.getFilterValue()?.toString()

						switch (type) {
							case 'search':
								return (
									<Input
										type='text'
										key={filter.id}
										value={value ?? ''}
										placeholder={label}
										onChange={e => table.getColumn(id)?.setFilterValue(e.target.value ?? '')}
										className={classNames(
											'w-full max-w-3xs rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5',
										)}
									/>
								)
							case 'select':
								return (
									<Listbox
										key={filter.id}
										value={options.find(option => option.value === value) ?? null}
										onChange={option => table.getColumn(id)?.setFilterValue(option?.value ?? '')}>
										<ListboxButton
											className={classNames(
												'flex w-full max-w-44 cursor-pointer items-center justify-between rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5',
											)}>
											<span className={classNames('truncate', { 'text-neutral-500': !value })}>
												{options?.find(option => option.value === value)?.label ?? label}
											</span>
											<HiChevronUpDown
												className='pointer-events-none size-4 fill-neutral-100/60'
												aria-hidden='true'
											/>
										</ListboxButton>
										<ListboxOptions
											transition={true}
											anchor='bottom start'
											className='mt-0.5 w-(--button-width) rounded-md border border-neutral-100/10 bg-neutral-800 p-1 shadow-2xl outline-none'>
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
							case 'search-select':
								const filteredOptions = options.filter(option =>
									option.label.toLowerCase().includes(query.toLowerCase()),
								)
								return (
									<Combobox
										key={filter.id}
										onClose={() => setQuery('')}
										value={options.find(option => option.value === value) ?? null}
										onChange={option => table.getColumn(id)?.setFilterValue(option?.value ?? '')}>
										<div className='relative'>
											<ComboboxInput
												className={classNames(
													'flex w-full max-w-44 cursor-pointer items-center justify-between rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5',
												)}
												placeholder={label}
												value={
													value ? options.find(option => option.value === value)?.label : query
												}
												displayValue={(option: (typeof options)[number]) => option?.label || label}
												onChange={event => setQuery(event.target.value)}
											/>
											<ComboboxButton className='group absolute inset-y-0 right-0 px-2.5'>
												<HiChevronDown
													className='pointer-events-none size-4 fill-neutral-100/60'
													aria-hidden='true'
												/>
											</ComboboxButton>
										</div>
										<ComboboxOptions
											transition={true}
											anchor='bottom start'
											className='mt-0.5 w-(--input-width) rounded-md border border-neutral-100/10 bg-neutral-800 p-1 shadow-2xl outline-none'>
											{filteredOptions.length > 0 ? (
												filteredOptions.map(option => (
													<ComboboxOption
														key={option.value}
														value={option}
														className='group flex w-full cursor-pointer items-center rounded-md px-2 py-1 text-sm capitalize hover:bg-neutral-100/10'>
														<HiCheck className='invisible mr-2 size-3 group-data-selected:visible' />
														<div className='text-sm/6 text-white'>{option.label}</div>
													</ComboboxOption>
												))
											) : (
												<ComboboxOption
													value={null}
													disabled={true}
													className='group flex w-full cursor-not-allowed items-center rounded-md px-2 py-1 text-sm capitalize opacity-50'>
													<div className='text-sm/6 text-white'>No options found</div>
												</ComboboxOption>
											)}
										</ComboboxOptions>
									</Combobox>
								)
							default:
								return null
						}
					})}
					<Menu as='div' className={classNames({ hidden: disableDateRange })}>
						<MenuButton
							aria-label='Columns Visibility'
							className='flex cursor-pointer items-center justify-center rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5'>
							<span
								className={classNames('truncate', {
									'text-neutral-500': !date.from && !date.to,
								})}>
								{date.from && date.to
									? `${dayjs(date.from).format('DD MMM YYYY')} to ${dayjs(date.to).format('DD MMM YYYY')}`
									: 'Select Date Range'}
							</span>
						</MenuButton>
						<MenuItems
							transition={true}
							anchor='bottom start'
							className='mt-0.5 rounded-md border border-neutral-100/10 bg-neutral-800 p-1 shadow-2xl outline-none'>
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
						</MenuItems>
					</Menu>
				</div>
				<div className='flex items-center justify-center gap-2'>
					<button
						aria-label='Reset Filters'
						disabled={disableClearFilters}
						onClick={() => handleClearFilters()}
						className={classNames(
							'flex cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-2 text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none hover:bg-neutral-100/5',
							{ hidden: disableClearFilters },
						)}>
						<MdOutlineFilterAltOff className='size-5 text-white' /> Clear Filters
					</button>
					<Menu as='div' className={classNames({ hidden: disableColumnVisibility })}>
						<MenuButton
							aria-label='Columns Visibility'
							className='relative flex cursor-pointer items-center justify-center rounded-md border border-neutral-100/10 bg-neutral-100/0 p-0.5 text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none hover:bg-neutral-100/5'>
							<span className='sr-only'>Columns Visibility</span>
							<CiViewList className='size-8 flex-shrink-0 text-neutral-200' />
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
												className='flex w-full cursor-pointer items-center rounded-md px-2 py-1 text-sm capitalize hover:bg-neutral-100/10'
												onClick={() => column.toggleVisibility(!isVisible)}>
												<FaCheck className={classNames('mr-2 size-3', { invisible: !isVisible })} />
												<span className='text-sm/6'>{column.id}</span>
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
															className='ml-1 inline-flex cursor-pointer items-center'>
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
							new Array(10).fill(null).map((_, index) => (
								<TableRow
									key={index}
									className={classNames({
										'animate-pulse hover:bg-transparent': loading,
									})}>
									{table
										.getAllColumns()
										.filter(column => column.getIsVisible())
										.map(column => (
											<TableCell key={column.id}>
												<div className='h-7 w-full rounded-sm bg-neutral-700'>&nbsp;</div>
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
								<TableCell colSpan={columns.length} className='text-text-muted h-24 text-center'>
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
				<div className='flex w-full items-center justify-center gap-2 lg:justify-end'>
					<span className='text-muted-foreground text-sm'>Rows per page:</span>
					<div className='relative'>
						<select
							value={pagination.pageSize}
							onChange={e => {
								const newSize = parseInt(e.target.value, 10)
								setPagination(prev => ({
									pageIndex: totalCount > newSize ? prev.pageIndex : 0,
									pageSize: newSize,
								}))
							}}
							className='cursor-pointer appearance-none rounded-md border border-neutral-100/10 bg-neutral-100/0 px-2 py-1.5 pr-6 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5'>
							{[10, 25, 50, 100].map(size => (
								<option key={size} value={size} className='bg-neutral-700'>
									{size}
								</option>
							))}
						</select>
						<span className='pointer-events-none absolute inset-y-0 right-2 flex items-center text-neutral-400'>
							<HiChevronDown className='size-4' aria-hidden='true' />
						</span>
					</div>
				</div>
				<div className='flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-end'>
					<button
						aria-label='Go to previous page'
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						className='flex cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-100/10 bg-neutral-100/0 px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none not-disabled:hover:bg-neutral-100/5 disabled:cursor-not-allowed disabled:opacity-50'>
						<HiChevronLeft className='size-5 flex-shrink-0 text-neutral-200' />
						Previous
					</button>
					<button
						aria-label='Go to next page'
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						className='flex cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-100/10 bg-neutral-100/0 px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none not-disabled:hover:bg-neutral-100/5 disabled:cursor-not-allowed disabled:opacity-50'>
						Next
						<HiChevronRight className='size-5 flex-shrink-0 text-neutral-200' />
					</button>
				</div>
			</div>
		</div>
	)
}
