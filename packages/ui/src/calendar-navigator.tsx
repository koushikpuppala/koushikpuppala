'use client'

import type { ChangeShownDate } from 'types/components'
import type { CalendarProps } from 'react-date-range'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { Select } from './select'

const MONTHS = Array.from({ length: 12 }, (_, month) => ({
	label: new Date(2000, month, 1).toLocaleString('en-US', { month: 'long' }),
	value: String(month),
}))

const NAV_BUTTON =
	'text-foreground/70 hover:bg-accent hover:text-foreground focus-ring:ring-2 focus-ring:ring-signal/40 grid size-8 shrink-0 cursor-pointer place-items-center rounded-md outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-40'

const PICKER = 'h-8 w-auto min-w-0 gap-1 border-transparent bg-transparent px-2 font-semibold'

export const calendarNavigator = (
	focused: Date,
	changeShownDate: ChangeShownDate,
	{ minDate, maxDate }: CalendarProps,
) => {
	const thisYear = new Date().getFullYear()
	const firstYear = minDate?.getFullYear() ?? thisYear - 50
	const lastYear = maxDate?.getFullYear() ?? thisYear + 10
	const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => {
		const year = String(lastYear - i)

		return { label: year, value: year }
	})

	const month = focused.getMonth()
	const year = focused.getFullYear()
	const atStart = !!minDate && year * 12 + month <= minDate.getFullYear() * 12 + minDate.getMonth()
	const atEnd = !!maxDate && year * 12 + month >= maxDate.getFullYear() * 12 + maxDate.getMonth()

	return (
		<div className='flex items-center justify-between gap-1 px-2 pt-2 pb-1'>
			<button
				type='button'
				aria-label='Previous month'
				disabled={atStart}
				onClick={() => changeShownDate(-1, 'monthOffset')}
				className={NAV_BUTTON}>
				<HiChevronLeft className='size-4' aria-hidden='true' />
			</button>
			<div className='flex items-center'>
				<Select
					aria-label='Month'
					value={String(month)}
					onChange={value => changeShownDate(Number(value), 'setMonth')}
					options={MONTHS}
					className={PICKER}
				/>
				<Select
					aria-label='Year'
					value={String(year)}
					onChange={value => changeShownDate(Number(value), 'setYear')}
					options={years}
					className={PICKER}
				/>
			</div>
			<button
				type='button'
				aria-label='Next month'
				disabled={atEnd}
				onClick={() => changeShownDate(1, 'monthOffset')}
				className={NAV_BUTTON}>
				<HiChevronRight className='size-4' aria-hidden='true' />
			</button>
		</div>
	)
}
