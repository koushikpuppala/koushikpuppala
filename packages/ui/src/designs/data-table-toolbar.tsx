'use client'

import type { DataTableToolbarProps } from 'types/components'
import { Input } from '@headlessui/react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineFilterAltOff } from 'react-icons/md'
import { classNames } from 'utils/classNames'
import { FilterControl } from './filter-control'
import { DateRangeFilter } from './date-range-filter'
import { ColumnVisibilityMenu } from './column-visibility-menu'
import { CONTROL, ICON, SEARCH_ICON } from './data-table-styles'

export const DataTableToolbar = ({
	search,
	onSearch,
	disableSearch,
	filters,
	filterValue,
	onFilter,
	date,
	onDate,
	disableDateRange,
	onClear,
	disableClearFilters,
	columns,
	disableColumnVisibility,
}: DataTableToolbarProps) => (
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
					onChange={e => onSearch(e.target.value)}
					className={classNames(CONTROL, 'w-full pr-3 pl-9')}
				/>
			</div>
			{filters?.map(filter => (
				<FilterControl
					key={filter.id}
					filter={filter}
					value={filterValue(filter.id)}
					onChange={value => onFilter(filter.id, value)}
				/>
			))}
			<DateRangeFilter value={date} onChange={onDate} hidden={disableDateRange} />
		</div>
		<div className='flex items-center justify-center gap-2'>
			<button
				type='reset'
				aria-label='Reset Filters'
				disabled={disableClearFilters}
				onClick={onClear}
				className={classNames(
					CONTROL,
					'flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap',
					{ hidden: disableClearFilters },
				)}>
				<MdOutlineFilterAltOff className={classNames(ICON, 'size-5')} aria-hidden='true' /> Clear
				Filters
			</button>
			<ColumnVisibilityMenu columns={columns} hidden={disableColumnVisibility} />
		</div>
	</div>
)
