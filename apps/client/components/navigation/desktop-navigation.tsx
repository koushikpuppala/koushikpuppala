'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'ui/motion'
import { classNames } from '../../lib/utils'

export interface NavItem {
	label: string
	href: string
}

export const NAV_ITEMS: NavItem[] = [
	{ label: 'About', href: '/about' },
	{ label: 'Experience', href: '/experience' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Skills', href: '/skills' },
	{ label: 'Education', href: '/education' },
	{ label: 'Contact', href: '/contact' },
]

export interface DesktopNavigationProps {
	className?: string
	isScrolled?: boolean
}

/**
 * DesktopNavigation
 * Horizontal navigation with sliding active route indicator and subtle Signal accent.
 */
export const DesktopNavigation = ({ className, isScrolled = false }: DesktopNavigationProps) => {
	const pathname = usePathname()
	const shouldReduceMotion = useReducedMotion()

	return (
		<nav
			aria-label='Primary Navigation'
			className={classNames('hidden lg:flex items-center gap-1', className)}>
			{NAV_ITEMS.map(item => {
				const isActive =
					item.href === '/'
						? pathname === '/'
						: pathname === item.href || pathname.startsWith(`${item.href}/`)

				return (
					<Link
						key={item.href}
						href={item.href}
						aria-current={isActive ? 'page' : undefined}
						className={classNames(
							'relative px-3.5 py-1.5 rounded-full font-sans text-xs sm:text-sm transition-all duration-200',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background',
							isActive
								? 'bg-surface-strong/90 text-foreground font-medium border border-border shadow-sm'
								: 'text-muted-foreground hover:text-foreground hover:bg-surface/50',
							isScrolled ? 'text-xs' : 'text-sm',
						)}>
						{item.label}
						{isActive &&
							(shouldReduceMotion ? (
								<span
									className='absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-signal shadow-[0_0_6px_rgba(255,51,102,0.8)]'
									aria-hidden='true'
								/>
							) : (
								<motion.span
									layoutId='activeNavIndicator'
									transition={{ type: 'spring', stiffness: 400, damping: 32 }}
									className='absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-signal shadow-[0_0_6px_rgba(255,51,102,0.8)]'
									aria-hidden='true'
								/>
							))}
					</Link>
				)
			})}
		</nav>
	)
}
