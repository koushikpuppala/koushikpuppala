import type { DataTablePagerProps } from 'types/components'
import { Select } from '../select'
import { classNames } from 'utils/classNames'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { CONTROL, ICON, PAGE_SIZES, PAGER } from './data-table-styles'

export const DataTablePagination = ({
	pagination,
	totalCount,
	canPrevious,
	canNext,
	onPrevious,
	onNext,
	onPageSize,
	disablePageSizeOptions,
}: DataTablePagerProps) => {
	const { pageIndex, pageSize } = pagination
	const first = totalCount === 0 ? 0 : pageIndex * pageSize + 1
	const last = Math.min((pageIndex + 1) * pageSize, totalCount)

	return (
		<div className='flex flex-col items-center justify-between gap-2 pb-2 lg:flex-row'>
			<p className='text-muted-foreground w-full text-center text-sm lg:text-left'>
				Showing {first} to {last} of {totalCount} entries
			</p>
			<div className='flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-end'>
				{!disablePageSizeOptions ? (
					<div className='flex items-center gap-2'>
						<span aria-hidden='true' className='text-muted-foreground text-sm whitespace-nowrap'>
							Rows per page
						</span>
						<Select
							aria-label='Rows per page'
							value={String(pageSize)}
							onChange={value => onPageSize(Number(value))}
							options={PAGE_SIZES}
							className={classNames(CONTROL, 'h-auto w-auto min-w-20 gap-3')}
						/>
					</div>
				) : null}
				<div className='flex items-center gap-2'>
					<button type='button' disabled={!canPrevious} onClick={onPrevious} className={PAGER}>
						<HiChevronLeft className={classNames(ICON, 'size-5')} aria-hidden='true' />
						Previous
					</button>
					<button type='button' disabled={!canNext} onClick={onNext} className={PAGER}>
						Next
						<HiChevronRight className={classNames(ICON, 'size-5')} aria-hidden='true' />
					</button>
				</div>
			</div>
		</div>
	)
}
