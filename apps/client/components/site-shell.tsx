'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import {
	ArrowUpRight,
	CommandIcon,
	Github,
	Linkedin,
	Mail,
	Search,
	Twitter,
	X,
} from '@/components/icons'
import { LogoGlyph, LogoLockup } from '@/components/brand/logo'
import { ThemeComparator, ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { PulseDot, ScrollProgress } from '@/components/primitives'
import { useTheme } from '@/lib/theme'
import { fallbackSocials } from '@/lib/api-fallback'
import type { Social } from '@/lib/api-types'
import { cn } from '@/lib/utils'

export const navItems = [
	{ href: '/about', label: 'About' },
	{ href: '/experience', label: 'Experience' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/services', label: 'Skills' },
	{ href: '/education', label: 'Education' },
	{ href: '/contact', label: 'Contact' },
] as const

/** Nav + standalone destinations used by menu and palette. */
const allDestinations = [
	{ href: '/', label: 'Home' },
	...navItems,
	{ href: '/resume', label: 'Resume' },
]

export const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
	github: Github,
	linkedin: Linkedin,
	twitter: Twitter,
	mail: Mail,
}

/* -------------------------------------------------------------------------- */

function Wordmark({ compact = false }: { compact?: boolean }) {
	return (
		<Link
			href='/'
			className='group flex items-center gap-2.5 focus-visible:outline-none'
			aria-label='Koushik Puppala — home'>
			<LogoLockup showText={!compact} />
		</Link>
	)
}

function useScrolled(threshold = 12) {
	const [scrolled, setScrolled] = useState(false)
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > threshold)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [threshold])
	return scrolled
}

/* ------------------------------------------------------------------ header */

function SiteHeader({
	onOpenMenu,
	onOpenPalette,
}: {
	onOpenMenu: () => void
	onOpenPalette: () => void
}) {
	const scrolled = useScrolled()
	const pathname = usePathname()

	return (
		<header className='fixed inset-x-0 top-0 z-50'>
			<ScrollProgress
				className={cn(
					'absolute inset-x-0 top-0 transition-opacity duration-500',
					scrolled ? 'opacity-100' : 'opacity-0',
				)}
			/>
			<div
				className={cn(
					'container-page transition-[padding] duration-500 ease-[var(--ease-out-expo)]',
					scrolled ? 'pt-2.5' : 'pt-0',
				)}>
				{/* The bar detaches into a floating rail once the page scrolls. */}
				<div
					className={cn(
						'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border transition-[height,background-color,border-color,border-radius,padding,box-shadow] duration-500 ease-[var(--ease-out-expo)]',
						scrolled
							? 'h-15 rounded-2xl border-border bg-background/72 px-3 shadow-[var(--shadow-lift)] backdrop-blur-xl backdrop-saturate-150 sm:px-4'
							: 'h-20 rounded-none border-transparent px-0',
					)}>
					<div className='flex min-w-0 items-center gap-6 xl:gap-8'>
						<Wordmark compact={scrolled} />
						<nav aria-label='Primary' className='hidden items-center gap-0.5 lg:flex'>
							{navItems.map(item => {
								const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
								return (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											'relative rounded-full px-3 py-2 text-[0.8125rem] transition-colors duration-300',
											active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
										)}>
										{active ? (
											<motion.span
												layoutId='nav-active'
												className='absolute inset-0 -z-10 rounded-full bg-accent'
												transition={{ type: 'spring', stiffness: 400, damping: 34 }}
											/>
										) : null}
										{item.label}
									</Link>
								)
							})}
						</nav>
					</div>

					<div className='flex items-center gap-1.5'>
						<button
							type='button'
							onClick={onOpenPalette}
							aria-label='Open quick navigation'
							className='hidden items-center gap-2 rounded-lg border border-border bg-surface/60 py-1.5 pr-2 pl-3 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground xl:flex'>
							<span>Jump to…</span>
							<kbd className='flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[0.625rem]'>
								<CommandIcon className='size-2.5' />K
							</kbd>
						</button>
						<ThemeToggle />
						<Button asChild size='sm' variant='signal' className='group hidden sm:inline-flex'>
							<Link href='/resume'>
								Resume
								<ArrowUpRight className='arrow-slide size-3.5' />
							</Link>
						</Button>
						<button
							type='button'
							onClick={onOpenMenu}
							aria-label='Open navigation menu'
							className='group grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent lg:hidden'>
							<span className='flex w-4.5 flex-col gap-[5px]'>
								<span className='h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-0.5' />
								<span className='h-px w-full bg-current' />
								<span className='h-px w-2/3 bg-current transition-all duration-300 group-hover:w-full' />
							</span>
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}

/* ------------------------------------------------------------- mobile menu */

function MobileMenu({
	open,
	onClose,
	socials,
}: {
	open: boolean
	onClose: () => void
	socials: Social[]
}) {
	useEffect(() => {
		if (!open) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKey)
		return () => {
			document.body.style.overflow = previous
			window.removeEventListener('keydown', onKey)
		}
	}, [open, onClose])

	const pathname = usePathname()

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					key='mobile-menu'
					role='dialog'
					aria-modal='true'
					aria-label='Site navigation'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					className='fixed inset-0 z-[60] flex flex-col bg-background lg:hidden'>
					<div className='grid-fine pointer-events-none absolute inset-0 opacity-70' aria-hidden />
					<div
						className='pointer-events-none absolute -top-24 -right-20 size-[26rem] rounded-full opacity-50 blur-3xl'
						style={{ background: 'var(--glow-signal)' }}
						aria-hidden
					/>

					<div className='relative container-page flex h-20 shrink-0 items-center justify-between'>
						<Wordmark />
						<button
							type='button'
							onClick={onClose}
							aria-label='Close navigation menu'
							className='grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent'>
							<X className='size-5' />
						</button>
					</div>

					<nav aria-label='Mobile' className='relative container-page flex-1 overflow-y-auto py-4'>
						<ul className='flex flex-col'>
							{allDestinations.map((item, i) => {
								const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
								return (
									<motion.li
										key={item.href}
										initial={{ opacity: 0, y: 18 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.06 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
										className='border-b border-border last:border-none'>
										<Link
											href={item.href}
											onClick={onClose}
											className='group flex items-baseline justify-between gap-4 py-4'
											data-active={active ? 'true' : undefined}>
											<span className='font-display text-[2rem] leading-none font-semibold tracking-tight text-foreground/85 transition-colors group-hover:text-foreground group-data-[active=true]:text-foreground'>
												{item.label}
											</span>
											<span className='font-mono text-[0.625rem] text-muted-foreground'>
												{String(i + 1).padStart(2, '0')}
											</span>
										</Link>
									</motion.li>
								)
							})}
						</ul>
					</nav>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.35, duration: 0.4 }}
						className='relative container-page shrink-0 border-t border-border py-6'>
						<div className='flex flex-wrap items-center justify-between gap-4'>
							<div className='flex items-center gap-2'>
								{socials.map(social => {
									const Icon = socialIcons[social.platform] ?? ArrowUpRight
									return (
										<a
											key={social.id}
											href={social.url}
											target='_blank'
											rel='noreferrer noopener'
											aria-label={social.label}
											className='grid size-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground'>
											<Icon className='size-4' />
										</a>
									)
								})}
							</div>
							<div className='flex items-center gap-2'>
								<ThemeToggle />
								<Button asChild size='lg'>
									<Link href='/contact' onClick={onClose}>
										Get in touch
									</Link>
								</Button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

/* ---------------------------------------------------------- quick palette */

function QuickPalette({
	open,
	onOpenChange,
	socials,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	socials: Social[]
}) {
	const router = useRouter()
	const { theme, palette, toggle, togglePalette } = useTheme()
	const [query, setQuery] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (open) {
			setQuery('')
			setSelectedIndex(0)
			setTimeout(() => inputRef.current?.focus(), 50)
			const previous = document.body.style.overflow
			document.body.style.overflow = 'hidden'
			return () => {
				document.body.style.overflow = previous
			}
		}
	}, [open])

	const filteredPages = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return allDestinations
		return allDestinations.filter(item => item.label.toLowerCase().includes(q))
	}, [query])

	const filteredSocials = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return socials
		return socials.filter(
			s => s.label.toLowerCase().includes(q) || s.handle?.toLowerCase().includes(q),
		)
	}, [query, socials])

	const totalItems = filteredPages.length + filteredSocials.length + 2

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault()
			onOpenChange(false)
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelectedIndex(prev => (prev + 1) % totalItems)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems)
		} else if (e.key === 'Enter') {
			e.preventDefault()
			if (selectedIndex < filteredPages.length) {
				const page = filteredPages[selectedIndex]
				if (page) {
					onOpenChange(false)
					router.push(page.href)
				}
			} else if (selectedIndex < filteredPages.length + filteredSocials.length) {
				const social = filteredSocials[selectedIndex - filteredPages.length]
				if (social) {
					onOpenChange(false)
					window.open(social.url, '_blank', 'noopener,noreferrer')
				}
			} else if (selectedIndex === filteredPages.length + filteredSocials.length) {
				toggle()
				onOpenChange(false)
			} else {
				togglePalette()
				onOpenChange(false)
			}
		}
	}

	if (!open) return null

	return (
		<div className='fixed inset-0 z-[70] flex items-start justify-center pt-20 sm:pt-28 px-4'>
			<button
				type='button'
				aria-label='Close quick navigation'
				className='fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity cursor-default'
				onClick={() => onOpenChange(false)}
				tabIndex={-1}
			/>
			<div
				role='dialog'
				aria-modal='true'
				aria-label='Quick navigation'
				className='relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-lift)]'
				onKeyDown={handleKeyDown}>
				<div className='flex items-center border-b border-border px-4'>
					<Search className='size-4 shrink-0 text-muted-foreground opacity-60' />
					<input
						ref={inputRef}
						value={query}
						onChange={e => {
							setQuery(e.target.value)
							setSelectedIndex(0)
						}}
						placeholder='Jump to a page, or search…'
						className='h-12 w-full bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground'
					/>
					<kbd className='rounded border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground'>
						ESC
					</kbd>
				</div>

				<div className='max-h-80 overflow-y-auto p-2'>
					{filteredPages.length === 0 && filteredSocials.length === 0 && query.trim() ? (
						<p className='py-6 text-center text-sm text-muted-foreground'>
							No matches found for &ldquo;{query}&rdquo;.
						</p>
					) : null}

					{filteredPages.length > 0 ? (
						<div className='mb-2'>
							<p className='px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground uppercase tracking-wider'>
								Pages
							</p>
							{filteredPages.map((page, i) => {
								const isSelected = selectedIndex === i
								return (
									<button
										key={page.href}
										type='button'
										onClick={() => {
											onOpenChange(false)
											router.push(page.href)
										}}
										onMouseEnter={() => setSelectedIndex(i)}
										className={cn(
											'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors',
											isSelected
												? 'bg-accent text-accent-foreground'
												: 'text-foreground/80 hover:bg-accent/60',
										)}>
										<span>{page.label}</span>
										<span className='font-mono text-xs text-muted-foreground'>{page.href}</span>
									</button>
								)
							})}
						</div>
					) : null}

					{filteredSocials.length > 0 ? (
						<div className='mb-2'>
							<p className='px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground uppercase tracking-wider'>
								Elsewhere
							</p>
							{filteredSocials.map((social, i) => {
								const currentIdx = filteredPages.length + i
								const isSelected = selectedIndex === currentIdx
								return (
									<button
										key={social.id}
										type='button'
										onClick={() => {
											onOpenChange(false)
											window.open(social.url, '_blank', 'noopener,noreferrer')
										}}
										onMouseEnter={() => setSelectedIndex(currentIdx)}
										className={cn(
											'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors',
											isSelected
												? 'bg-accent text-accent-foreground'
												: 'text-foreground/80 hover:bg-accent/60',
										)}>
										<span>{social.label}</span>
										<span className='font-mono text-xs text-muted-foreground'>
											{social.handle ?? ''}
										</span>
									</button>
								)
							})}
						</div>
					) : null}

					<div>
						<p className='px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground uppercase tracking-wider'>
							Preferences
						</p>
						<button
							type='button'
							onClick={() => {
								toggle()
								onOpenChange(false)
							}}
							onMouseEnter={() => setSelectedIndex(filteredPages.length + filteredSocials.length)}
							className={cn(
								'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors',
								selectedIndex === filteredPages.length + filteredSocials.length
									? 'bg-accent text-accent-foreground'
									: 'text-foreground/80 hover:bg-accent/60',
							)}>
							<span>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
							<span className='font-mono text-xs text-muted-foreground'>Mode</span>
						</button>
						<button
							type='button'
							onClick={() => {
								togglePalette()
								onOpenChange(false)
							}}
							onMouseEnter={() =>
								setSelectedIndex(filteredPages.length + filteredSocials.length + 1)
							}
							className={cn(
								'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors',
								selectedIndex === filteredPages.length + filteredSocials.length + 1
									? 'bg-accent text-accent-foreground'
									: 'text-foreground/80 hover:bg-accent/60',
							)}>
							<span>
								Switch to {palette === 'new' ? 'Classic (Old)' : 'Portfolio Weaver (New)'} palette
							</span>
							<span className='font-mono text-xs text-muted-foreground'>Palette</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

/* ------------------------------------------------------------------ footer */

function SiteFooter({ socials }: { socials: Social[] }) {
	return (
		<footer className='relative overflow-hidden border-t border-border bg-surface/50'>
			<div className='grid-fine pointer-events-none absolute inset-0 opacity-40' aria-hidden />
			<LogoGlyph
				className='mark-watermark opacity-[0.07] saturate-[0.6] absolute -right-16 -bottom-24 hidden size-[30rem] lg:block'
				strokeWidth={2}
				aria-hidden
			/>
			<div className='relative container-page py-16 md:py-20'>
				<div className='grid gap-12 lg:grid-cols-[1.3fr_2fr]'>
					<div className='max-w-sm space-y-5'>
						<Wordmark />
						<p className='text-sm leading-relaxed text-muted-foreground'>
							Full Stack Developer building end-to-end web features with React, Next.js, Node.js and
							PostgreSQL — with a bias for performance and clean architecture.
						</p>
						<p className='flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-tight text-muted-foreground'>
							<PulseDot />
							Open to conversations
						</p>
					</div>

					<div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
						<div>
							<p className='text-eyebrow mb-4'>Explore</p>
							<ul className='space-y-2.5 text-sm'>
								{navItems.map(item => (
									<li key={item.href}>
										<Link
											href={item.href}
											className='link-underline text-muted-foreground transition-colors hover:text-foreground'>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className='text-eyebrow mb-4'>Elsewhere</p>
							<ul className='space-y-2.5 text-sm'>
								{socials.map(social => (
									<li key={social.id}>
										<a
											href={social.url}
											target='_blank'
											rel='noreferrer noopener'
											className='link-underline text-muted-foreground transition-colors hover:text-foreground'>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className='text-eyebrow mb-4'>Direct</p>
							<ul className='space-y-2.5 text-sm'>
								<li>
									<Link
										href='/contact'
										className='link-underline text-muted-foreground transition-colors hover:text-foreground'>
										Contact form
									</Link>
								</li>
								<li>
									<Link
										href='/resume'
										className='link-underline text-muted-foreground transition-colors hover:text-foreground'>
										Resume
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className='relative border-t border-border'>
				<div className='container-page flex flex-col gap-2 py-5 font-mono text-[0.6875rem] tracking-tight text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
					<span>© 2026 Koushik Puppala</span>
					<span className='flex items-center gap-4'>
						<span>India</span>
						<span aria-hidden className='text-signal-ink'>
							{'//'}
						</span>
						<span>koushikpuppala.com</span>
					</span>
				</div>
			</div>
		</footer>
	)
}

/* ------------------------------------------------------------------- shell */

export function SiteShell({
	children,
	socials = fallbackSocials,
}: {
	children: ReactNode
	socials?: Social[]
}) {
	const [menuOpen, setMenuOpen] = useState(false)
	const [paletteOpen, setPaletteOpen] = useState(false)

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setPaletteOpen(v => !v)
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [])

	return (
		<div className='flex min-h-screen flex-col'>
			<a
				href='#main'
				className='sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background'>
				Skip to content
			</a>
			<SiteHeader onOpenMenu={() => setMenuOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />
			<MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} socials={socials} />
			<QuickPalette open={paletteOpen} onOpenChange={setPaletteOpen} socials={socials} />
			<main id='main' className='flex-1'>
				{children}
			</main>
			<SiteFooter socials={socials} />
			<ThemeComparator />
		</div>
	)
}
