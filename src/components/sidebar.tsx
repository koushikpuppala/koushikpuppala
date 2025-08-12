'use client'
import React, { useState } from 'react'
import { SidebarBody, SidebarButton, SidebarLink } from './ui'
import { TbArrowLeft, TbBrandTabler, TbSettings, TbUserBolt } from 'react-icons/tb'
import { motion } from 'motion/react'
import { IoLogOutOutline } from 'react-icons/io5'
import { useAuth } from 'contexts'
import Link from 'next/link'

export function SidebarDemo() {
	const links = [
		{
			label: 'Dashboard',
			href: '/admin',
			icon: <TbBrandTabler className='size-5 shrink-0 text-neutral-200' />,
		},
		{
			label: 'Profile',
			href: '#',
			icon: <TbUserBolt className='size-5 shrink-0 text-neutral-200' />,
		},
		{
			label: 'Settings',
			href: '#',
			icon: <TbSettings className='size-5 shrink-0 text-neutral-200' />,
		},
		{
			label: 'Logout',
			href: '#',
			icon: <TbArrowLeft className='size-5 shrink-0 text-neutral-200' />,
		},
	]
	const [open, setOpen] = useState(false)
	const { logout } = useAuth()

	return (
		<SidebarBody
			open={open}
			setOpen={setOpen}
			className='justify-between gap-10 rounded border-gray-500 shadow-lg md:border-e'>
			<div className='relative flex flex-1 flex-col gap-4 overflow-hidden'>
				{open ? <LogoComponent /> : <LogoIcon />}
				<div className='mb-12 flex flex-col gap-2 overflow-hidden overflow-y-auto'>
					{links.map((link, index) => (
						<SidebarLink key={index} link={link} />
					))}
				</div>
				<div className='absolute bottom-0 flex w-full flex-1 flex-col-reverse rounded-lg border-t border-gray-200'>
					<SidebarButton
						label='Logout'
						onClick={logout}
						icon={<IoLogOutOutline className='size-5 flex-shrink-0 rotate-180 text-neutral-200' />}
					/>
				</div>
			</div>
		</SidebarBody>
	)
}

export const LogoComponent = () => {
	return (
		<Link
			href='#'
			className='relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black'>
			<div className='h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white' />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='font-medium whitespace-pre text-black dark:text-white'>
				Acet Labs
			</motion.span>
		</Link>
	)
}
export const LogoIcon = () => {
	return (
		<Link
			href='#'
			className='relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black'>
			<div className='h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white' />
		</Link>
	)
}
