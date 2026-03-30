'use client'

import { useState } from 'react'
import { useAuthContext } from 'contexts'
import { SIDEBAR_LINKS } from './sidebar-links'
import { IoLogOutOutline } from 'react-icons/io5'
import { SidebarBody, SidebarButton, SidebarLink, SidebarLogo } from './ui'

export const Sidebar = () => {
	const [open, setOpen] = useState(false)

	const { logout } = useAuthContext()

	return (
		<SidebarBody
			open={open}
			setOpen={setOpen}
			className='justify-between gap-10 rounded-md shadow-lg'>
			<div className='relative flex flex-1 flex-col gap-4 overflow-hidden'>
				<SidebarLogo open={open} />
				<div className='mb-12 flex flex-col gap-2 overflow-hidden overflow-y-auto'>
					{SIDEBAR_LINKS.map(link => (
						<SidebarLink key={link.href} link={link} />
					))}
				</div>
				<div className='absolute bottom-0 flex w-full flex-1 flex-col-reverse rounded-lg border-t border-neutral-100/5 text-[#c52917]'>
					<SidebarButton
						label='Logout'
						onClick={logout}
						icon={<IoLogOutOutline className='size-5 shrink-0 rotate-180' />}
					/>
				</div>
			</div>
		</SidebarBody>
	)
}
