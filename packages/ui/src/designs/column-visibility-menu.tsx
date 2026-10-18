'use client'

import type { ColumnVisibilityMenuProps } from 'types/components'
import { FaCheck } from 'react-icons/fa6'
import { CiViewList } from 'react-icons/ci'
import { classNames } from 'utils/classNames'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { CONTROL, ICON, OPTION, PANEL } from './data-table-styles'

export const ColumnVisibilityMenu = ({ columns, hidden }: ColumnVisibilityMenuProps) => (
	<Menu as='div' className={classNames({ hidden })}>
		<MenuButton
			aria-label='Columns Visibility'
			className={classNames(
				CONTROL,
				'relative flex cursor-pointer items-center justify-center p-0.5 whitespace-nowrap',
			)}>
			<CiViewList className={classNames(ICON, 'size-8')} aria-hidden='true' />
		</MenuButton>
		<MenuItems transition={true} anchor='bottom end' className={PANEL}>
			{columns.map(column => (
				<MenuItem key={column.id}>
					<button type='button' className={OPTION} onClick={column.toggle}>
						<FaCheck className={classNames('mr-2 size-3', { invisible: !column.visible })} />
						<span className='text-sm/6'>{column.label}</span>
					</button>
				</MenuItem>
			))}
		</MenuItems>
	</Menu>
)
