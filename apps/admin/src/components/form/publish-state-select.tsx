'use client'

import type { SelectOption } from 'types/components'
import type { PublishState, PublishStateSelectProps } from 'types/components/admin'
import { Select } from 'ui/select'
import { classNames } from 'utils/classNames'

const OPTIONS: SelectOption<PublishState>[] = [
	{ label: 'DRAFT', value: 'DRAFT' },
	{ label: 'PUBLISHED', value: 'PUBLISHED' },
]

export const PublishStateSelect = ({ id, value, onChange, className }: PublishStateSelectProps) => (
	<Select
		id={id}
		value={value ?? 'DRAFT'}
		onChange={onChange}
		options={OPTIONS}
		className={classNames('font-mono', className)}
	/>
)
