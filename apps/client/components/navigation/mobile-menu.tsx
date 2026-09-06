'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { classNames } from '../../lib/utils'
import { BrandGlyph, AmbientBloom } from 'ui/brand'
import { FineGrid } from 'ui/background'
import { ThemeToggle } from './theme-toggle'
import { EASING } from 'ui/motion'
import { AUTHORITATIVE_SOCIALS, type PortfolioSocial } from '../../lib/social-data'

export type MobileMenuProps = {
	isOpen: boolean
	onClose: () => void
	socials?: PortfolioSocial[]
}

const MOBILE_NAV_ITEMS = [
	{ index: '01', label: 'Home', href: '/' },
	{ index: '02', label: 'About', href: '/about' },
	{ index: '03', label: 'Experience', href: '/experience' },
	{ index: '04', label: 'Projects', href: '/projects' },
	{ index: '05', label: 'Skills', href: '/skills' },
	{ index: '06', label: 'Education', href: '/education' },
	{ index: '07', label: 'Contact', href: '/contact' },
	{ index: '08', label: 'Resume', href: '/resume' },
]

/**
 * MobileMenu
 * Full-screen mobile navigation overlay with sequential entrance, technical numbering, and scroll locking.
 */
export const MobileMenu = ({ isOpen, onClose, socials }: MobileMenuProps) => {
	const pathname = usePathname()
	const shouldReduceMotion = useReducedMotion()
	const activeSocials = socials && socials.length > 0 ? socials : AUTHORITATIVE_SOCIALS

	// Body Scroll Locking
	useEffect(() => {
		if (isOpen) {
			const originalOverflow = document.body.style.overflow
			document.body.style.overflow = 'hidden'
			return () => {
				document.body.style.overflow = originalOverflow
			}
		}
	}, [isOpen])

	// Escape key to close
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault()
				onClose()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<motion.div
			role='dialog'
			aria-modal='true'
			aria-label='Mobile Navigation Menu'
			initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
			transition={{ duration: 0.25, ease: EASING.expoOut }}
			className='fixed inset-0 z-50 overflow-y-auto bg-background/98 backdrop-blur-xl p-5 sm:p-8 select-none'>
			{/* Technical Background Motifs */}
			<FineGrid mask='radial' opacity={0.3} />
			<AmbientBloom size='lg' position='top-right' intensity='normal' />

			<div className='relative z-10 flex min-h-full flex-col justify-between gap-6'>
				{/* Top Bar: Logo & Close Button */}
				<div className='flex items-center justify-between border-b border-border/50 pb-4'>
					<div className='flex items-center gap-3'>
						<BrandGlyph size={28} />
						<div className='flex flex-col'>
							<span className='font-display font-medium text-sm tracking-tight text-foreground'>
								KOUSHIK PUPPALA
							</span>
							<span className='font-mono text-[9px] uppercase tracking-widest text-muted-foreground'>
								NAVIGATION {'//'} V6
							</span>
						</div>
					</div>

					<div className='flex items-center gap-3'>
						<ThemeToggle compact />

						<button
							type='button'
							onClick={onClose}
							aria-label='Close navigation menu'
							className='inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
							<svg
								width='16'
								height='16'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								aria-hidden='true'>
								<line x1='18' y1='6' x2='6' y2='18' />
								<line x1='6' y1='6' x2='18' y2='18' />
							</svg>
						</button>
					</div>
				</div>

				{/* Middle: Numbered Navigation Items */}
				<nav
					aria-label='Mobile Navigation'
					className='my-auto py-4 sm:py-6 flex flex-col gap-1.5 sm:gap-2'>
					{MOBILE_NAV_ITEMS.map((item, idx) => {
						const isActive =
							item.href === '/'
								? pathname === '/'
								: pathname === item.href || pathname.startsWith(`${item.href}/`)

						const content = (
							<Link
								href={item.href}
								onClick={onClose}
								aria-current={isActive ? 'page' : undefined}
								className={classNames(
									'group flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal',
									isActive
										? 'bg-signal-soft/80 text-foreground font-semibold border border-signal/30'
										: 'text-muted-foreground hover:text-foreground hover:bg-surface/50',
								)}>
								<div className='flex items-baseline gap-4'>
									<span
										className={classNames(
											'font-mono text-xs font-normal tracking-wider',
											isActive ? 'text-signal' : 'text-muted-foreground/60',
										)}>
										{item.index}
									</span>
									<span className='font-display text-xl sm:text-2xl md:text-3xl tracking-tight'>
										{item.label}
									</span>
								</div>

								{isActive && (
									<span className='h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_rgba(255,51,102,0.8)]' />
								)}
							</Link>
						)

						if (shouldReduceMotion) {
							return <div key={item.href}>{content}</div>
						}

						return (
							<motion.div
								key={item.href}
								initial={{ opacity: 0, x: -16 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.35,
									delay: idx * 0.04,
									ease: EASING.expoOut,
								}}>
								{content}
							</motion.div>
						)
					})}
				</nav>

				{/* Bottom Bar: Social Links & Status */}
				<div className='border-t border-border/50 pt-4 flex flex-col gap-4'>
					<div className='flex flex-wrap items-center justify-between gap-4'>
						<div className='flex items-center gap-4'>
							{activeSocials.map(s => (
								<a
									key={s.id}
									href={s.url}
									target='_blank'
									rel='noopener noreferrer'
									className='font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal py-1'>
									{s.label}
								</a>
							))}
						</div>

						<div className='inline-flex items-center gap-2'>
							<span className='h-1.5 w-1.5 rounded-full bg-status-live animate-pulse' />
							<span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground'>
								AVAILABLE FOR HIRE
							</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
