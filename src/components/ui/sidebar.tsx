'use client'

import type { SidebarLinkProps } from 'types/components'
import type { SidebarButtonProps, SidebarBodyProps } from 'types/contexts'

import Link from 'next/link'
import { Animation } from '.'
import Image from 'next/image'
import { Logo } from 'assets/svg'
import { classNames } from 'utils/classNames'
import { usePathname } from 'next/navigation'
import { TbMenu2, TbX } from 'react-icons/tb'
import { SidebarProvider, useSidebar } from 'contexts'

const SidebarBody = ({ open, setOpen, animate, ...props }: SidebarBodyProps) => {
	return (
		<SidebarProvider open={open} setOpen={setOpen} animate={animate}>
			<DesktopSidebar {...props} />
			<MobileSidebar {...(props as React.ComponentProps<'div'>)} />
		</SidebarProvider>
	)
}

const SidebarButton = ({ label, icon, className, ...props }: SidebarButtonProps) => {
	return (
		<button
			className={classNames(
				className,
				'group/sidebar flex cursor-pointer items-center justify-start gap-2 rounded-lg bg-neutral-100/0 px-1.5 py-2 hover:bg-neutral-100/5',
			)}
			{...props}>
			{icon}
			<span className='!m-0 inline-block !p-0 text-sm whitespace-pre transition duration-150 group-hover/sidebar:translate-x-1'>
				{label}
			</span>
		</button>
	)
}

const DesktopSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof Animation.div>) => {
	const { open, setOpen, animate } = useSidebar()

	return (
		<Animation.div
			className={classNames(
				'hidden h-full w-72 flex-shrink-0 rounded-md bg-neutral-900 px-3.5 py-4 lg:flex lg:flex-col',
				className,
			)}
			animate={{
				width: animate ? (open ? '288px' : '60px') : '288px',
			}}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			{...props}>
			{children}
		</Animation.div>
	)
}

const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
	const { open, setOpen } = useSidebar()

	return (
		<div
			className={classNames(
				'flex h-12 w-full flex-row items-center justify-between rounded-md bg-neutral-900 px-4 py-4 lg:hidden',
			)}
			{...props}>
			<div className='z-20 flex w-full justify-end'>
				<TbMenu2
					className='size-5 flex-shrink-0 cursor-pointer text-neutral-200'
					onClick={() => setOpen(!open)}
				/>
			</div>
			<Animation.AnimatePresence>
				{open && (
					<Animation.div
						initial={{ x: '-100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '-100%', opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className={classNames(
							'fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-neutral-900 px-4 py-4',
							className,
						)}>
						<div className='absolute top-5 right-5 z-50' onClick={() => setOpen(!open)}>
							<TbX className='size-5 flex-shrink-0 cursor-pointer' />
						</div>
						{children}
					</Animation.div>
				)}
			</Animation.AnimatePresence>
		</div>
	)
}

const SidebarLink = ({ link, className, ...props }: SidebarLinkProps) => {
	const { open, animate } = useSidebar()
	const pathname = usePathname()

	return (
		<Link
			href={link.href}
			className={classNames(
				className,
				'group/sidebar flex items-center justify-start gap-2 rounded-lg bg-neutral-100/0 px-1.5 py-2 hover:bg-neutral-100/5',
				{ 'bg-neutral-100/10 hover:bg-neutral-100/10': pathname === link.href },
			)}
			{...props}>
			{link.icon}
			<Animation.span
				animate={{
					display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
					opacity: animate ? (open ? 1 : 0) : 1,
				}}
				className={classNames(
					{ hidden: !open },
					'!m-0 inline-block !p-0 text-sm whitespace-pre text-neutral-200 transition duration-150 group-hover/sidebar:translate-x-1',
				)}>
				{link.label}
			</Animation.span>
		</Link>
	)
}

const SidebarLogo = ({ open }: { open: boolean }) => {
	return (
		<div className='relative z-20 flex items-center justify-center space-x-2 py-1 text-sm font-normal'>
			<Image
				src={Logo}
				alt='Logo'
				priority={true}
				className={classNames('h-auto w-12 mix-blend-multiply', { 'px-0.5': !open })}
			/>
			<Animation.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className={classNames('font-medium whitespace-pre text-white', { hidden: !open })}>
				Admin Dashboard
			</Animation.span>
		</div>
	)
}

export { SidebarBody, SidebarButton, SidebarLink, SidebarLogo }
