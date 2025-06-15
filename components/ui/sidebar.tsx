'use client'

import { Animation } from '.'
import { classNames } from '@import/utils'
import { SidebarLinkProps, SidebarProps } from '@import/types'
import { TbMenu2, TbX } from 'react-icons/tb'
import { SidebarProvider, useSidebar } from '@import/contexts'
import Link from 'next/link'

export const Sidebar = ({ children, open, setOpen, animate }: SidebarProps) => {
	return (
		<SidebarProvider open={open} setOpen={setOpen} animate={animate}>
			{children}
		</SidebarProvider>
	)
}

export const SidebarBody = (props: React.ComponentProps<typeof Animation.div>) => {
	return (
		<>
			<DesktopSidebar {...props} />
			<MobileSidebar {...(props as React.ComponentProps<'div'>)} />
		</>
	)
}

export const DesktopSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof Animation.div>) => {
	const { open, setOpen, animate } = useSidebar()
	return (
		<Animation.div
			className={classNames(
				'hidden h-full w-[300px] shrink-0 bg-neutral-100 px-4 py-4 md:flex md:flex-col dark:bg-neutral-800',
				className,
			)}
			animate={{
				width: animate ? (open ? '300px' : '60px') : '300px',
			}}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			{...props}>
			{children}
		</Animation.div>
	)
}

export const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
	const { open, setOpen } = useSidebar()
	return (
		<div
			className={classNames(
				'flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 md:hidden dark:bg-neutral-800',
			)}
			{...props}>
			<div className='z-20 flex w-full justify-end'>
				<TbMenu2
					className='text-neutral-800 dark:text-neutral-200'
					onClick={() => setOpen(!open)}
				/>
			</div>
			<Animation.AnimatePresence>
				{open && (
					<Animation.div
						initial={{ x: '-100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '-100%', opacity: 0 }}
						transition={{
							duration: 0.3,
							ease: 'easeInOut',
						}}
						className={classNames(
							'fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-white p-10 dark:bg-neutral-900',
							className,
						)}>
						<div
							className='absolute top-10 right-10 z-50 text-neutral-800 dark:text-neutral-200'
							onClick={() => setOpen(!open)}>
							<TbX />
						</div>
						{children}
					</Animation.div>
				)}
			</Animation.AnimatePresence>
		</div>
	)
}

export const SidebarLink = ({ link, className, ...props }: SidebarLinkProps) => {
	const { open, animate } = useSidebar()
	return (
		<Link
			href={link.href}
			className={classNames('group/sidebar flex items-center justify-start gap-2 py-2', className)}
			{...props}>
			{link.icon}

			<Animation.span
				animate={{
					display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
					opacity: animate ? (open ? 1 : 0) : 1,
				}}
				className='!m-0 inline-block !p-0 text-sm whitespace-pre text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200'>
				{link.label}
			</Animation.span>
		</Link>
	)
}
