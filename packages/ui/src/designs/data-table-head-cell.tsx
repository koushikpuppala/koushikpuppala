'use client'

import type { DataTableHeadCellProps } from 'types/components'
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from 'react-icons/hi2'
import { classNames } from 'utils/classNames'
import { TableHead } from './table'

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const

const SORT_ICON = { asc: HiChevronDown, desc: HiChevronUp } as const

const STICKY_HEAD = 'sticky right-0 z-10 bg-[color-mix(in_oklab,var(--signal)_10%,var(--surface))]'

export const DataTableHeadCell = ({
	label,
	sortable,
	sorted,
	onSort,
	sticky,
	children,
}: DataTableHeadCellProps) => {
	const SortIcon = sorted ? SORT_ICON[sorted] : HiChevronUpDown

	return (
		<TableHead
			className={classNames('select-none', sticky && STICKY_HEAD)}
			aria-sort={sortable ? (sorted ? ARIA_SORT[sorted] : 'none') : undefined}>
			<div className='flex items-center justify-between gap-2'>
				{children}
				{sortable && (
					<button
						type='button'
						onClick={onSort}
						aria-label={`Sort by ${label}`}
						className='focus-ring:ring-signal/40 focus-ring:ring-2 inline-flex cursor-pointer items-center rounded outline-none'>
						<SortIcon className='fill-muted-foreground size-4' aria-hidden='true' />
					</button>
				)}
			</div>
		</TableHead>
	)
}
