'use client'

import type { DatePickerProps } from 'types/components'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { Calendar } from 'react-date-range'
import { IoCalendarOutline } from 'react-icons/io5'
import { classNames } from 'utils/classNames'
import { formatDate } from 'utils/formatDate'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { FIELD } from './select'
import { calendarNavigator } from './calendar-navigator'

const FORMAT = 'YYYY-MM-DD'

const toDate = (value?: string) => {
	const parsed = value ? dayjs(value.slice(0, 10)) : null

	return parsed?.isValid() ? parsed.toDate() : undefined
}

export const DatePicker = ({
	id,
	value,
	onChange,
	min,
	max,
	disabled,
	required,
	placeholder = 'Pick a date',
	className,
}: DatePickerProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null)
	const date = toDate(value ?? undefined)

	return (
		<Popover className='relative'>
			<PopoverButton
				ref={buttonRef}
				id={id}
				disabled={disabled}
				className={classNames(FIELD, className)}>
				<span className={classNames('truncate', !date && 'text-muted-foreground')}>
					{date ? formatDate(date) : placeholder}
				</span>
				<IoCalendarOutline className='text-foreground/60 size-4 shrink-0' aria-hidden='true' />
			</PopoverButton>

			{required && (
				<input
					tabIndex={-1}
					aria-hidden='true'
					required
					value={value ?? ''}
					onChange={() => {}}
					onInvalid={() => buttonRef.current?.focus()}
					className='pointer-events-none absolute bottom-0 left-4 size-px opacity-0'
				/>
			)}

			<PopoverPanel
				anchor='bottom start'
				className='border-foreground/10 bg-surface-strong z-60 mt-1 rounded-lg border p-1 shadow-2xl outline-none'>
				{({ close }) => (
					<>
						<Calendar
							date={date}
							onChange={picked => {
								onChange(dayjs(picked).format(FORMAT))
								close()
							}}
							minDate={toDate(min)}
							maxDate={toDate(max)}
							color='var(--color-signal)'
							showDateDisplay={false}
							navigatorRenderer={calendarNavigator}
						/>
						{!required && date && (
							<div className='flex justify-end px-3 pb-2'>
								<button
									type='button'
									onClick={() => {
										onChange('')
										close()
									}}
									className='text-muted-foreground hover:text-foreground focus-ring:ring-2 focus-ring:ring-signal/40 rounded-md px-2 py-1 text-xs font-medium outline-none'>
									Clear date
								</button>
							</div>
						)}
					</>
				)}
			</PopoverPanel>
		</Popover>
	)
}
