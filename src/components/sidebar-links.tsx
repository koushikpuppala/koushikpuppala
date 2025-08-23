import type { LinkProps } from 'types/components'

import {
	HiOutlineBriefcase,
	HiOutlineDocument,
	HiOutlineEnvelopeOpen,
	HiOutlineFolder,
	HiOutlineHome,
	HiOutlineServerStack,
	HiOutlineUser,
	HiOutlineUsers,
} from 'react-icons/hi2'
import { PiMetaLogo } from 'react-icons/pi'
import { TbBrandTabler, TbLogs } from 'react-icons/tb'

export const SIDEBAR_LINKS: LinkProps[] = [
	{
		label: 'Dashboard',
		href: '/admin',
		icon: <TbBrandTabler className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Home',
		href: '/admin/home',
		icon: <HiOutlineHome className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'About',
		href: '/admin/about',
		icon: <HiOutlineUser className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Experience',
		href: '/admin/experience',
		icon: <HiOutlineBriefcase className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Projects',
		href: '/admin/projects',
		icon: <HiOutlineFolder className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Resume',
		href: '/admin/resume',
		icon: <HiOutlineDocument className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Metadata',
		href: '/admin/metadata',
		icon: <PiMetaLogo className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Contact Us',
		href: '/admin/contact',
		icon: <HiOutlineEnvelopeOpen className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Users',
		href: '/admin/users',
		icon: <HiOutlineUsers className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Sessions',
		href: '/admin/sessions',
		icon: <HiOutlineServerStack className='size-5 shrink-0 text-neutral-200' />,
	},
	{
		label: 'Logs',
		href: '/admin/logs',
		icon: <TbLogs className='size-5 shrink-0 text-neutral-200' />,
	},
]
