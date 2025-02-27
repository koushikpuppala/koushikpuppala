'use client'

import Link from 'next/link'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { NavbarData } from '@import/constant'
import { usePathname } from 'next/navigation'
import { Animation } from '@import/components'
import { HiExclamationCircle, HiXMark } from 'react-icons/hi2'

const Navbar = () => {
	const pathname = usePathname()
	const [online, setOnline] = useState(true)

	useEffect(() => {
		setOnline(navigator.onLine)
	}, [pathname])

	if (pathname.includes('/studio')) return null

	return (
		<>
			<Animation.div
				direction='down'
				delay={0.05}
				className={classNames(
					{
						hidden: online,
						flex: !online,
					},
					'fixed z-50 w-full justify-center p-8 md:justify-end',
				)}>
				<div
					role='alert'
					className='bg-primary bg-opacity-75 rounded-xl border border-red-600 px-4 py-2 backdrop-blur-md'>
					<div className='flex items-center gap-4'>
						<span className='text-red-500'>
							<HiExclamationCircle size={32} />
						</span>

						<div className='flex-1'>
							<strong className='block font-medium text-red-500'>
								You are offline. Some features may not work.
							</strong>
						</div>

						<button
							className='text-gray-500 transition hover:text-gray-600'
							onClick={() => setOnline(false)}>
							<span className='sr-only'>Dismiss popup</span>
							<HiXMark />
						</button>
					</div>
				</div>
			</Animation.div>

			<Animation.nav
				direction='up'
				delay={0.1}
				className='fixed top-0 bottom-0 z-10 mt-auto flex h-max w-full flex-col items-center gap-y-4 lg:hidden'>
				<CustomLink pathname={pathname} />
			</Animation.nav>
			<Animation.nav
				direction='left'
				delay={0.1}
				className='fixed top-0 right-8 bottom-0 z-10 mt-auto hidden h-screen w-14 max-w-md flex-col items-center justify-center gap-y-4 lg:flex'>
				<CustomLink pathname={pathname} />
			</Animation.nav>
			<Animation.div
				direction='down'
				delay={0.1}
				className='bg-primary/50 lg:bg-primary/0 sticky right-0 left-0 z-10 p-2 text-center text-xs backdrop-blur-md lg:fixed lg:bottom-0 lg:p-4 lg:text-right lg:backdrop-blur-none'>
				Github ❤️{' '}
				<Link
					href='https://github.com/koushikpuppala/koushikpuppala'
					target='_blank'
					rel='noopener noreferrer'
					className='text-accent transition-all delay-100 ease-in-out hover:text-white/60'>
					Source Code
				</Link>
			</Animation.div>
		</>
	)
}

const CustomLink = ({ pathname }: { pathname: string }) => {
	return (
		<div className='flex h-14 w-full items-center justify-between gap-y-10 bg-white/10 px-4 py-6 text-3xl backdrop-blur-sm sm:px-24 md:px-48 lg:h-max lg:flex-col lg:justify-center lg:rounded-full lg:px-0 lg:py-8 lg:text-xl'>
			{NavbarData.map((link, index) => {
				return (
					<Link
						className={classNames(
							{
								'text-accent': link.href === pathname,
								'text-black lg:text-white dark:text-white':
									link.href !== pathname && pathname === '/resume',
							},
							'group hover:text-accent relative flex items-center transition-all duration-300 ease-in-out',
						)}
						href={link.href}
						key={index}>
						<span className='sr-only'>{link.name}</span>
						<div className='absolute right-0 hidden pr-12 lg:group-hover:flex'>
							<div className='text-primary relative flex items-center rounded bg-white p-2'>
								<div className='text-xs leading-none font-semibold capitalize'>{link.name}</div>
								<div className='absolute -right-2 border-y-4 border-r-0 border-l-4 border-solid border-y-transparent border-l-white' />
							</div>
						</div>
						<link.icon className='w-5 lg:w-10' />
					</Link>
				)
			})}
		</div>
	)
}

export default Navbar
