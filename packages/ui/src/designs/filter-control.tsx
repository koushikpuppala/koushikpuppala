'use client'

import type { FilterControlProps } from 'types/components'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { classNames } from 'utils/classNames'
import { HiCheck, HiChevronDown, HiChevronUpDown, HiXMark } from 'react-icons/hi2'
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
} from '@headlessui/react'
import { CONTROL, OPTION, PANEL, SEARCH_ICON } from './data-table-styles'

const CLEAR = 'fill-foreground/60 hover:fill-foreground size-4 cursor-pointer p-0.5'

export const FilterControl = ({ filter, value, onChange }: FilterControlProps) => {
	const [query, setQuery] = useState('')

	if (filter.type === 'search')
		return (
			<div className='relative w-full max-w-3xs'>
				<FiSearch className={SEARCH_ICON} />
				<Input
					type='text'
					value={value ?? ''}
					placeholder={filter.label}
					aria-label={filter.label}
					onChange={e => onChange(e.target.value ?? '')}
					className={classNames(CONTROL, 'w-full pr-3 pl-9')}
				/>
			</div>
		)

	const { label, options } = filter
	const selected = options.find(option => option.value === value) ?? null

	if (filter.type === 'select')
		return (
			<Listbox value={selected} onChange={option => onChange(option?.value ?? '')}>
				<ListboxButton
					aria-label={label}
					className={classNames(
						CONTROL,
						'flex w-full max-w-44 cursor-pointer items-center justify-between gap-2',
					)}>
					<span className={classNames('truncate', { 'text-muted-foreground': !value })}>
						{selected?.label ?? label}
					</span>
					<div className='flex items-center justify-center gap-0.5'>
						<HiChevronDown
							className='fill-foreground/60 pointer-events-none size-4'
							aria-hidden='true'
						/>
						<HiXMark
							onClick={() => onChange('')}
							className={classNames(CLEAR, { hidden: !value })}
							aria-hidden='true'
						/>
					</div>
				</ListboxButton>
				<ListboxOptions
					transition={true}
					anchor='bottom start'
					className={classNames(PANEL, 'w-(--button-width)')}>
					{options.map(option => (
						<ListboxOption key={option.value} value={option} className={OPTION}>
							<HiCheck className='invisible mr-2 size-3 group-data-selected:visible' />
							<span className='text-sm/6'>{option.label}</span>
						</ListboxOption>
					))}
				</ListboxOptions>
			</Listbox>
		)

	const matches = options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))

	return (
		<Combobox
			onClose={() => setQuery('')}
			value={selected}
			onChange={option => onChange(option?.value ?? '')}>
			<div className='relative'>
				<ComboboxInput
					aria-label={label}
					className={classNames(CONTROL, 'w-full max-w-44 pr-14')}
					placeholder={label}
					value={value ? selected?.label : query}
					displayValue={(option: (typeof options)[number]) => option?.label || label}
					onChange={event => setQuery(event.target.value)}
				/>
				<ComboboxButton
					className={classNames('group absolute inset-y-0 px-2.5', {
						'right-0': !value,
						'right-6': value,
					})}>
					<HiChevronUpDown
						className='fill-foreground/60 pointer-events-none size-4'
						aria-hidden='true'
					/>
				</ComboboxButton>
				<div
					className={classNames(
						'group absolute inset-y-0 right-0 flex items-center justify-center px-2.5',
						{ hidden: !value },
					)}>
					<HiXMark onClick={() => onChange('')} className={CLEAR} aria-hidden='true' />
				</div>
			</div>
			<ComboboxOptions
				transition={true}
				anchor='bottom start'
				className={classNames(PANEL, 'w-(--input-width)')}>
				{matches.length > 0 ? (
					matches.map(option => (
						<ComboboxOption key={option.value} value={option} className={OPTION}>
							<HiCheck className='invisible mr-2 size-3 group-data-selected:visible' />
							<div className='text-sm/6'>{option.label}</div>
						</ComboboxOption>
					))
				) : (
					<ComboboxOption
						value={null}
						disabled={true}
						className='text-muted-foreground flex w-full cursor-not-allowed items-center rounded-lg px-2 py-1 text-sm opacity-50'>
						<div className='text-sm/6'>No options found</div>
					</ComboboxOption>
				)}
			</ComboboxOptions>
		</Combobox>
	)
}
