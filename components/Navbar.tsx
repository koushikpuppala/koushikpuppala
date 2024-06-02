'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavbarData } from '@import/constant'
import { MotionDiv, MotionNav } from '@import/components'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { HiExclamationCircle, HiXMark } from 'react-icons/hi2'

const NavbarComponent = () => {
	const pathname = usePathname()
	const [online, setOnline] = useState(true)

	useEffect(() => {
		setOnline(navigator.onLine)
	}, [pathname])

	if (pathname.includes('/studio')) return null

	return (
		<>
			<MotionDiv
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
					className='rounded-xl border border-red-600 bg-primary bg-opacity-75 px-4 py-2 backdrop-blur-md'>
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
			</MotionDiv>

			<MotionNav
				direction='up'
				delay={0.1}
				className='fixed bottom-0 top-0 z-10 mt-auto flex h-max w-full flex-col items-center gap-y-4 lg:hidden'>
				<LinkComponent pathname={pathname} />
			</MotionNav>
			<MotionNav
				direction='left'
				delay={0.1}
				className='fixed bottom-0 right-8 top-0 z-10 mt-auto hidden h-screen w-14 max-w-md flex-col items-center justify-center gap-y-4 lg:flex'>
				<LinkComponent pathname={pathname} />
			</MotionNav>
			<MotionDiv
				direction='down'
				delay={0.1}
				className='sticky left-0 right-0 z-10 p-2 text-center text-xs backdrop-blur-md lg:fixed lg:bottom-0 lg:p-4 lg:text-right lg:backdrop-blur-none'>
				Github ❤️{' '}
				<Link
					href='/github/koushikpuppala'
					target='_blank'
					rel='noopener noreferrer'
					className='text-accent transition-all delay-100 ease-in-out hover:text-white/60'>
					Source Code
				</Link>
			</MotionDiv>
		</>
	)
}

const LinkComponent = ({ pathname }: { pathname: string }) => {
	return (
		<div className='flex h-14 w-full items-center justify-between gap-y-10 bg-white/10 px-4 py-6 text-3xl backdrop-blur-sm sm:px-24 md:px-48 lg:h-max lg:flex-col lg:justify-center lg:rounded-full lg:px-0 lg:py-8 lg:text-xl'>
			{NavbarData.map((link, index) => {
				return (
					<Link
						className={classNames(
							{
								'text-accent': link.href === pathname,
								'text-black dark:text-white': link.href !== pathname && pathname === '/resume',
							},
							'group relative flex items-center transition-all duration-300 ease-in-out hover:text-accent',
						)}
						href={link.href}
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
