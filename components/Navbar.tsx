'use client'

import {
	HiHome,
	HiUser,
	HiViewColumns,
	HiRectangleGroup,
	HiChatBubbleBottomCenterText,
	HiEnvelope,
} from 'react-icons/hi2'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { fadeIn } from '@import/actions'

export const data = [
	{ name: 'home', path: '/', icon: HiHome },
	{ name: 'about', path: '/about', icon: HiUser },
	{ name: 'services', path: '/services', icon: HiRectangleGroup },
	{ name: 'work', path: '/work', icon: HiViewColumns },
	{
		name: 'testimonials',
		path: '/testimonials',
		icon: HiChatBubbleBottomCenterText,
	},
	{
		name: 'contact',
		path: '/contact',
		icon: HiEnvelope,
	},
]

const NavbarComponent = () => {
	const pathname = usePathname()

	return (
		<>
			<motion.nav
				variants={fadeIn('up', 0.1)}
				initial='hidden'
				animate='show'
				exit='hidden'
				className='fixed bottom-0 top-0 z-10 mt-auto flex h-max w-full flex-col items-center gap-y-4 lg:hidden'>
				<LinkComponent pathname={pathname} />
			</motion.nav>
			<motion.nav
				variants={fadeIn('left', 0.1)}
				initial='hidden'
				animate='show'
				exit='hidden'
				className='fixed bottom-0 right-8 top-0 z-10 mt-auto hidden h-screen w-14 max-w-md flex-col items-center justify-center gap-y-4 lg:flex'>
				<LinkComponent pathname={pathname} />
			</motion.nav>
		</>
	)
}

const LinkComponent = ({ pathname }: { pathname: string }) => {
	return (
		<div className='flex h-14 w-full items-center justify-between gap-y-10 bg-white/10 px-4 py-6 text-3xl backdrop-blur-sm sm:px-24 md:px-48 lg:h-max lg:flex-col lg:justify-center lg:rounded-full lg:px-0 lg:py-8 lg:text-xl'>
			{data.map((link, index) => {
				return (
					<Link
						className={`${
							link.path === pathname && 'text-accent'
						} group relative flex items-center transition-all duration-300 hover:text-accent`}
						href={link.path}
						key={index}>
						<span className='sr-only'>{link.name}</span>
						<div className='absolute right-0 hidden pr-12 lg:group-hover:flex'>
							<div className='relative flex items-center rounded bg-white p-2 text-primary'>
								<div className='text-xs font-semibold capitalize leading-none'>{link.name}</div>
								<div className='absolute -right-2 border-y-4 border-l-4 border-r-0 border-solid border-y-transparent border-l-white' />
							</div>
						</div>
						<link.icon className='w-5 lg:w-10' />
					</Link>
				)
			})}
		</div>
	)
}

export default NavbarComponent
