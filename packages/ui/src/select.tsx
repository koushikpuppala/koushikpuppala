'use client'

import type { SelectOption, SelectProps } from 'types/components'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { HiCheck, HiChevronDown } from 'react-icons/hi2'
import { classNames } from 'utils/classNames'

export const FIELD =
	'border-border bg-surface text-foreground focus-ring:ring-2 focus-ring:ring-signal/40 flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 text-left text-xs outline-none transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-50'

const PANEL =
	'border-foreground/10 bg-surface z-60 mt-1 max-h-64 overflow-y-auto scrollbar-none rounded-lg border p-1 shadow-2xl outline-none'

const OPTION =
	'group text-foreground data-focus:bg-foreground/10 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs select-none'

export const Select = <V extends string>({
	id,
	value,
	onChange,
	options,
	disabled,
	placeholder = 'Select…',
	className,
	'aria-label': ariaLabel,
}: SelectProps<V>) => {
	const selected = options.find(option => option.value === value)

	return (
		<Listbox
			value={selected ?? null}
			onChange={(option: SelectOption<V> | null) => option && onChange(option.value)}
			by='value'
			disabled={disabled}>
			<ListboxButton id={id} aria-label={ariaLabel} className={classNames(FIELD, className)}>
				<span className={classNames('truncate', !selected && 'text-muted-foreground')}>
					{selected?.label ?? placeholder}
				</span>
				<HiChevronDown className='text-foreground/60 size-4 shrink-0' aria-hidden='true' />
			</ListboxButton>
			<ListboxOptions
				anchor='bottom start'
				className={classNames(PANEL, 'w-(--button-width) min-w-28')}>
				{options.map(option => (
					<ListboxOption key={option.value} value={option} className={OPTION}>
						<HiCheck
							className='invisible size-3 shrink-0 group-data-selected:visible'
							aria-hidden='true'
						/>
						<span className='truncate'>{option.label}</span>
					</ListboxOption>
				))}
			</ListboxOptions>
		</Listbox>
	)
}
