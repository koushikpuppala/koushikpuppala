'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'ui/motion'
import { classNames } from '../../lib/utils'
import { ScrollProgress } from './scroll-progress'
import { HeaderLogo } from './header-logo'
import { DesktopNavigation } from './desktop-navigation'
import { ResumeCta } from './resume-cta'
import { ThemeToggle } from './theme-toggle'
import { MobileMenu } from './mobile-menu'
import type { PortfolioSocial } from '../../lib/social-data'

const QuickNavigation = dynamic(
	() => import('./quick-navigation').then(mod => mod.QuickNavigation),
	{ ssr: false },
)

export interface PublicHeaderProps {
	className?: string
	socials?: PortfolioSocial[]
}

/**
 * PublicHeader
 * Floating-on-scroll header reproducing the Lovable Signal aesthetic.
 * Seamlessly transitions from transparent editorial header into a compact floating navigation rail.
 */
export const PublicHeader = ({ className, socials }: PublicHeaderProps) => {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isQuickNavOpen, setIsQuickNavOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	// Scroll Detection with passive listener & RAF (Zero-churn dependency)
	useEffect(() => {
		let ticking = false

		const handleScroll = () => {
			const isPast = window.scrollY > 30
			setIsScrolled(prev => (prev !== isPast ? isPast : prev))
			ticking = false
		}

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(handleScroll)
				ticking = true
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		handleScroll()

		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	}, [])

	// Global Keyboard Shortcut: Cmd/Ctrl + K to open Quick Navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				setIsQuickNavOpen(prev => !prev)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<>
			{/* Subtle Scroll Progress Indicator */}
			<ScrollProgress />

			{/* Main Header Container */}
			<header
				className={classNames(
					'fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none',
					isScrolled ? 'pt-2.5 px-3 sm:pt-3 sm:px-6' : 'pt-0 px-0',
					className,
				)}>
				<div
					className={classNames(
						'pointer-events-auto mx-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between',
						isScrolled
							? 'h-14 max-w-[1240px] rounded-full border border-border-strong/80 bg-surface/85 backdrop-blur-md px-3.5 sm:px-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
							: 'h-20 w-full bg-transparent border-b border-border/30 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16',
					)}>
					{/* Left: Brand Logo */}
					<div className='flex items-center gap-6'>
						<HeaderLogo isScrolled={isScrolled} />
					</div>

					{/* Center: Desktop Navigation */}
					<DesktopNavigation isScrolled={isScrolled} />

					{/* Right: Controls & Actions */}
					<div className='flex items-center gap-2 sm:gap-3'>
						{/* Quick Navigation Trigger Button */}
						<button
							type='button'
							onClick={() => setIsQuickNavOpen(true)}
							aria-label='Open Quick Navigation command palette (Cmd+K)'
							title='Quick Navigation (Cmd+K)'
							className={classNames(
								'hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-2.5 py-1 text-xs text-muted-foreground transition-all duration-200',
								'hover:border-signal/40 hover:text-foreground hover:bg-surface',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background',
								isScrolled ? 'h-8 text-[11px]' : 'h-8.5',
							)}>
							<svg
								width='13'
								height='13'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								aria-hidden='true'
								className='text-muted-foreground'>
								<circle cx='11' cy='11' r='8' />
								<path d='m21 21-4.3-4.3' />
							</svg>
							<span className='font-sans hidden md:inline'>Search</span>
							<kbd className='font-mono text-[10px] text-muted-foreground/80 bg-surface-strong/60 px-1 py-0.5 rounded border border-border/60'>
								⌘K
							</kbd>
						</button>

						{/* Theme Toggle Button */}
						<ThemeToggle compact={isScrolled} />

						{/* Resume CTA (Desktop) */}
						<div className='hidden sm:block'>
							<ResumeCta compact={isScrolled} />
						</div>

						{/* Mobile Hamburger Menu Button */}
						<button
							type='button'
							onClick={() => setIsMobileMenuOpen(true)}
							aria-label='Open navigation menu'
							className='inline-flex lg:hidden h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
							<svg
								width='18'
								height='18'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								aria-hidden='true'>
								<line x1='4' y1='6' x2='20' y2='6' />
								<line x1='8' y1='12' x2='20' y2='12' />
								<line x1='12' y1='18' x2='20' y2='18' />
							</svg>
						</button>
					</div>
				</div>
			</header>

			{/* Quick Navigation Command Palette Modal */}
			<AnimatePresence>
				{isQuickNavOpen && (
					<QuickNavigation
						key='quick-nav'
						isOpen={isQuickNavOpen}
						onClose={() => setIsQuickNavOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Full-Screen Mobile Navigation Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<MobileMenu
						key='mobile-menu'
						isOpen={isMobileMenuOpen}
						onClose={() => setIsMobileMenuOpen(false)}
						socials={socials}
					/>
				)}
			</AnimatePresence>
		</>
	)
}
