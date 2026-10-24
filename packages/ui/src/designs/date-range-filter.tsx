'use client'

import type { DateRangeFilterProps } from 'types/components'
import dayjs from 'dayjs'
import { DateRange } from 'react-date-range'
import { classNames } from 'utils/classNames'
import { formatDate } from 'utils/formatDate'
import { IoCalendarOutline } from 'react-icons/io5'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { calendarNavigator } from '../calendar-navigator'
import { CONTROL, ICON, PANEL_DATE } from './data-table-styles'

const DAY = 'YYYY-MM-DD'

export const DateRangeFilter = ({ value, onChange, hidden }: DateRangeFilterProps) => {
	const empty = !value.from && !value.to

	return (
		<Popover className={classNames({ hidden })}>
			<PopoverButton
				aria-label='Select date range'
				className={classNames(CONTROL, 'flex cursor-pointer items-center justify-center')}>
				<IoCalendarOutline
					className={classNames(ICON, 'pointer-events-none mr-2 inline-block size-4.5')}
					aria-hidden='true'
				/>
				<span className={classNames('truncate', { 'text-muted-foreground': empty })}>
					{value.from && value.to
						? `${formatDate(value.from)} to ${formatDate(value.to)}`
						: 'Select Date Range'}
				</span>
			</PopoverButton>
			<PopoverPanel transition={true} anchor='bottom start' className={PANEL_DATE}>
				<DateRange
					onChange={item =>
						onChange({
							from: dayjs(item.selection?.startDate).format(DAY),
							to: dayjs(item.selection?.endDate).format(DAY),
						})
					}
					ranges={[
						{
							startDate: value.from ? new Date(value.from) : new Date(),
							endDate: value.to ? new Date(value.to) : new Date(),
							key: 'selection',
						},
					]}
					maxDate={new Date()}
					editableDateInputs={true}
					dateDisplayFormat='dd MMM yyyy'
					moveRangeOnFirstSelection={true}
					retainEndDateOnFirstSelection={true}
					rangeColors={['var(--color-signal)']}
					minDate={new Date('2020-01-01')}
					navigatorRenderer={calendarNavigator}
				/>
				<div
					className={classNames('flex items-center justify-center px-4 pb-2', { hidden: empty })}>
					<button
						type='button'
						onClick={() => onChange({ from: '', to: '' })}
						className={classNames(CONTROL, 'flex w-full items-center justify-center')}>
						Clear Date Range
					</button>
				</div>
			</PopoverPanel>
		</Popover>
	)
}
