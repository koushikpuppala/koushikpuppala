'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion, EASING } from 'ui/motion'
import { classNames } from '../../lib/utils'
import { BrandGlyph } from 'ui/brand'

export interface QuickNavItem {
	id: string
	title: string
	category: 'Navigation' | 'External'
	href: string
	icon?: string
	isExternal?: boolean
}

const QUICK_ITEMS: QuickNavItem[] = [
	{ id: 'home', title: 'Home', category: 'Navigation', href: '/' },
	{ id: 'about', title: 'About Biography', category: 'Navigation', href: '/about' },
	{ id: 'experience', title: 'Work Experience', category: 'Navigation', href: '/experience' },
	{
		id: 'projects',
		title: 'Selected Projects & Case Studies',
		category: 'Navigation',
		href: '/projects',
	},
	{
		id: 'skills',
		title: 'Technical Competencies & Stack',
		category: 'Navigation',
		href: '/skills',
	},
	{
		id: 'services',
		title: 'Technical Services & Advisory',
		category: 'Navigation',
		href: '/services',
	},
	{
		id: 'education',
		title: 'Education & Certifications',
		category: 'Navigation',
		href: '/education',
	},
	{ id: 'contact', title: 'Contact & Inquiries', category: 'Navigation', href: '/contact' },
	{ id: 'resume', title: 'Download Authoritative Resume', category: 'Navigation', href: '/resume' },
	{
		id: 'github',
		title: 'GitHub — @koushikpuppala',
		category: 'External',
		href: 'https://github.com/koushikpuppala',
		isExternal: true,
	},
	{
		id: 'linkedin',
		title: 'LinkedIn — /in/koushikpuppala',
		category: 'External',
		href: 'https://www.linkedin.com/in/koushikpuppala',
		isExternal: true,
	},
	{
		id: 'twitter',
		title: 'X (Twitter) — @puppala_koushik',
		category: 'External',
		href: 'https://twitter.com/puppala_koushik',
		isExternal: true,
	},
	{
		id: 'discord',
		title: 'Discord Community',
		category: 'External',
		href: 'https://discord.gg/MsJ99j5Bcv',
		isExternal: true,
	},
]

export interface QuickNavigationProps {
	isOpen: boolean
	onClose: () => void
}

/**
 * QuickNavigation
 * Lightweight, accessible command palette activated via Cmd/Ctrl + K for instant navigation.
 */
export const QuickNavigation = ({ isOpen, onClose }: QuickNavigationProps) => {
	const router = useRouter()
	const shouldReduceMotion = useReducedMotion()
	const [query, setQuery] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)

	const filteredItems = QUICK_ITEMS.filter(
		item =>
			item.title.toLowerCase().includes(query.toLowerCase()) ||
			item.category.toLowerCase().includes(query.toLowerCase()),
	)

	const navigateTo = useCallback(
		(item: QuickNavItem) => {
			onClose()
			if (item.isExternal) {
				window.open(item.href, '_blank', 'noopener,noreferrer')
			} else {
				router.push(item.href)
			}
		},
		[onClose, router],
	)

	useEffect(() => {
		if (isOpen) {
			setQuery('')
			setSelectedIndex(0)
			setTimeout(() => {
				inputRef.current?.focus()
			}, 50)
		}
	}, [isOpen])

	// Keyboard Navigation within Palette
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault()
				onClose()
			} else if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1))
			} else if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1))
			} else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
				e.preventDefault()
				navigateTo(filteredItems[selectedIndex])
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, filteredItems, selectedIndex, onClose, navigateTo])

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6'
			role='dialog'
			aria-modal='true'
			aria-label='Quick Navigation Command Palette'>
			{/* Backdrop Overlay */}
			<motion.div
				initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
				transition={{ duration: 0.2 }}
				className='fixed inset-0 bg-background/80 backdrop-blur-sm'
				onClick={onClose}
				aria-hidden='true'
			/>

			{/* Modal Surface */}
			<motion.div
				initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: -8 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
				transition={{ duration: 0.2, ease: EASING.expoOut }}
				className='relative w-full max-w-lg rounded-xl border border-border bg-surface-card shadow-[0_16px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10'>
				{/* Search Input Bar */}
				<div className='flex items-center border-b border-border px-4 py-3 gap-3 bg-surface/40'>
					<BrandGlyph size={22} className='text-signal' />
					<input
						ref={inputRef}
						type='text'
						value={query}
						onChange={e => {
							setQuery(e.target.value)
							setSelectedIndex(0)
						}}
						placeholder='Type a command or jump to page...'
						className='w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground outline-none'
						aria-label='Search commands and pages'
					/>
					<kbd className='hidden sm:inline-flex items-center rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
						ESC
					</kbd>
				</div>

				{/* Results List */}
				<div className='max-h-80 overflow-y-auto p-2 divide-y divide-border/20'>
					{filteredItems.length === 0 ? (
						<div className='p-6 text-center text-sm font-sans text-muted-foreground'>
							No matching commands or pages found.
						</div>
					) : (
						filteredItems.map((item, index) => {
							const isSelected = index === selectedIndex

							return (
								<button
									key={item.id}
									type='button'
									onClick={() => navigateTo(item)}
									onMouseEnter={() => setSelectedIndex(index)}
									className={classNames(
										'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors',
										isSelected
											? 'bg-signal-soft/80 text-foreground border border-signal/30'
											: 'text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent',
									)}>
									<div className='flex items-center gap-2.5'>
										<span
											className={classNames(
												'h-1.5 w-1.5 rounded-full shrink-0',
												item.category === 'Navigation' ? 'bg-signal' : 'bg-status-live',
											)}
										/>
										<span className='font-sans text-sm font-medium'>{item.title}</span>
									</div>

									<div className='flex items-center gap-2'>
										<span className='font-mono text-[10px] uppercase tracking-wider text-muted-foreground'>
											{item.category}
										</span>
										{item.isExternal && (
											<svg
												width='12'
												height='12'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
												aria-hidden='true'
												className='text-muted-foreground'>
												<path d='M15 3h6v6' />
												<path d='M10 14 21 3' />
												<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
											</svg>
										)}
									</div>
								</button>
							)
						})
					)}
				</div>

				{/* Palette Footer */}
				<div className='flex items-center justify-between border-t border-border bg-surface/30 px-4 py-2 font-mono text-[10px] text-muted-foreground'>
					<div className='flex items-center gap-3'>
						<span>↑↓ to navigate</span>
						<span>↵ to select</span>
					</div>
					<span>QUICK NAV {'//'} SIGNAL</span>
				</div>
			</motion.div>
		</div>
	)
}
