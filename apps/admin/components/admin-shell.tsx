'use client'

import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
	Activity,
	BookOpen,
	Briefcase,
	ChevronRight,
	ExternalLink,
	FileText,
	FolderKanban,
	Gauge,
	Image as ImageIcon,
	Inbox,
	LayoutDashboard,
	LogOut,
	Menu,
	Moon,
	ScrollText,
	Search,
	Settings,
	Share2,
	Sparkles,
	Sun,
	Users,
	Wrench,
	X,
	Zap,
} from '@/components/icons'
import { CommandPalette } from '@/components/cms/command-palette'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

type NavItem = {
	href: string
	label: string
	icon: React.ComponentType<{ className?: string }>
}

type NavSection = {
	group: string | null
	items: NavItem[]
}

const adminNav: NavSection[] = [
	{
		group: null,
		items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }],
	},
	{
		group: 'Content Management',
		items: [
			{ href: '/content/home', label: 'Home Page', icon: Sparkles },
			{ href: '/content/about', label: 'About Page', icon: FileText },
			{ href: '/content/projects', label: 'Projects & Work', icon: FolderKanban },
			{ href: '/content/experience', label: 'Experience Timeline', icon: Briefcase },
			{ href: '/content/education', label: 'Education & Honors', icon: BookOpen },
			{ href: '/content/services', label: 'Services & Advisory', icon: Wrench },
			{ href: '/content/skills', label: 'Skills & Tech Stack', icon: Zap },
			{ href: '/content/resume', label: 'Resume Document', icon: ScrollText },
			{ href: '/content/social', label: 'Social Channels', icon: Share2 },
		],
	},
	{
		group: 'Operations',
		items: [
			{ href: '/media', label: 'Media Library', icon: ImageIcon },
			{ href: '/messages', label: 'Inquiries & Messages', icon: Inbox },
			{ href: '/audit-logs', label: 'Audit Logs', icon: Activity },
			{ href: '/api-metrics', label: 'API Telemetry', icon: Gauge },
			{ href: '/users', label: 'Users & Permissions', icon: Users },
		],
	},
	{
		group: 'Configuration',
		items: [{ href: '/settings', label: 'Site Metadata & SEO', icon: Settings }],
	},
]

export function AdminShell({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const router = useRouter()
	const { user, loading, logout } = useAuth()
	const { theme, toggleTheme } = useTheme()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const [cmdOpen, setCmdOpen] = useState(false)
	const userMenuRef = useRef<HTMLDivElement>(null)

	// Cmd+K global shortcut handler
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				setCmdOpen(prev => !prev)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	// Click outside user menu handler
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
				setUserMenuOpen(false)
			}
		}
		if (userMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [userMenuOpen])

	// Router auth check
	useEffect(() => {
		if (!loading) {
			if (!user && pathname !== '/login') {
				router.replace('/login')
			} else if (user && pathname === '/login') {
				router.replace('/')
			}
		}
	}, [user, loading, pathname, router])

	// Dynamic Breadcrumb calculation
	const breadcrumbs = useMemo(() => {
		if (pathname === '/') return ['Admin', 'Dashboard']
		for (const section of adminNav) {
			for (const item of section.items) {
				if (item.href !== '/' && pathname.startsWith(item.href)) {
					return ['Admin', section.group || 'Overview', item.label]
				}
			}
		}
		return ['Admin', 'Content Studio']
	}, [pathname])

	if (pathname === '/login') {
		return <main className='bg-background text-foreground min-h-screen'>{children}</main>
	}

	if (loading || !user) {
		return (
			<div className='bg-background text-foreground flex min-h-screen items-center justify-center'>
				<div className='flex flex-col items-center gap-3'>
					<div className='bg-signal grid size-10 animate-pulse place-items-center rounded-2xl font-mono text-sm font-bold text-white shadow-md'>
						KP
					</div>
					<p className='text-muted-foreground font-mono text-xs'>Authenticating Content Studio…</p>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-background text-foreground flex h-screen w-screen overflow-hidden'>
			{/* Desktop Sidebar (Fixed) */}
			<aside className='border-border bg-sidebar hidden h-full w-64 shrink-0 flex-col border-r lg:flex'>
				<div className='border-sidebar-border flex h-16 shrink-0 items-center justify-between border-b px-5'>
					<Link href='/' className='flex items-center gap-2.5 group'>
						<span className='bg-signal text-signal-foreground grid size-8 place-items-center rounded-lg font-mono text-xs font-bold transition-transform group-hover:scale-105'>
							KP
						</span>
						<div>
							<span className='font-display block text-sm font-bold tracking-tight text-foreground'>
								Content Studio
							</span>
							<span className='text-muted-foreground block font-mono text-[0.625rem]'>
								admin.koushikpuppala.com
							</span>
						</div>
					</Link>
				</div>

				<nav className='min-h-0 flex-1 scrollbar-none space-y-6 overflow-y-auto px-3 py-4'>
					{adminNav.map((section, idx) => (
						<div key={section.group ?? `group-${idx}`}>
							{section.group && (
								<p className='text-muted-foreground px-3 pb-2 font-mono text-[0.625rem] font-semibold tracking-wider uppercase'>
									{section.group}
								</p>
							)}
							<div className='space-y-1'>
								{section.items.map(item => {
									const Icon = item.icon
									const isActive =
										item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
									return (
										<Link
											key={item.href}
											href={item.href}
											className={cn(
												'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
												isActive
													? 'bg-signal/15 text-signal-ink font-semibold'
													: 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
											)}>
											<Icon
												className={cn(
													'size-4 shrink-0',
													isActive ? 'text-signal-ink' : 'text-muted-foreground',
												)}
											/>
											<span>{item.label}</span>
										</Link>
									)
								})}
							</div>
						</div>
					))}
				</nav>
			</aside>

			{/* Mobile Sidebar Overlay */}
			{mobileOpen && (
				<div className='fixed inset-0 z-50 lg:hidden'>
					<button
						type='button'
						aria-label='Close mobile navigation'
						className='bg-background/80 fixed inset-0 h-full w-full cursor-default border-0 backdrop-blur-sm'
						onClick={() => setMobileOpen(false)}
					/>
					<aside className='border-border bg-sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r p-4 shadow-2xl'>
						<div className='border-border flex shrink-0 items-center justify-between border-b pb-4'>
							<div className='flex items-center gap-2'>
								<span className='bg-signal text-signal-foreground grid size-7 place-items-center rounded-lg font-mono text-xs font-bold'>
									KP
								</span>
								<span className='font-display text-sm font-bold'>Content Studio</span>
							</div>
							<button
								type='button'
								onClick={() => setMobileOpen(false)}
								className='text-muted-foreground hover:bg-accent rounded-lg p-1'>
								<X className='size-5' />
							</button>
						</div>

						<nav className='min-h-0 flex-1 scrollbar-none space-y-5 overflow-y-auto py-4'>
							{adminNav.map((section, idx) => (
								<div key={section.group ?? `m-group-${idx}`}>
									{section.group && (
										<p className='text-muted-foreground px-2 pb-1 font-mono text-[0.625rem] font-semibold tracking-wider uppercase'>
											{section.group}
										</p>
									)}
									<div className='space-y-1'>
										{section.items.map(item => {
											const Icon = item.icon
											const isActive =
												item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
											return (
												<Link
													key={item.href}
													href={item.href}
													onClick={() => setMobileOpen(false)}
													className={cn(
														'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors',
														isActive
															? 'bg-signal/15 text-signal-ink font-semibold'
															: 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
													)}>
													<Icon className='size-4' />
													<span>{item.label}</span>
												</Link>
											)
										})}
									</div>
								</div>
							))}
						</nav>

						<div className='border-border shrink-0 border-t pt-3'>
							<button
								type='button'
								onClick={() => logout()}
								className='text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-xl p-2 text-xs cursor-pointer'>
								<LogOut className='size-4' />
								<span>Sign out</span>
							</button>
						</div>
					</aside>
				</div>
			)}

			{/* Main Content Area */}
			<div className='flex min-w-0 flex-1 flex-col h-full overflow-hidden'>
				{/* Top Header */}
				<header className='border-border bg-background/90 shrink-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6'>
					<div className='flex items-center gap-3 min-w-0'>
						<button
							type='button'
							onClick={() => setMobileOpen(true)}
							className='text-muted-foreground hover:bg-accent rounded-lg p-1.5 lg:hidden'>
							<Menu className='size-5' />
						</button>

						{/* Route Breadcrumbs */}
						<nav aria-label='Breadcrumb' className='hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted-foreground truncate'>
							{breadcrumbs.map((crumb, idx) => (
								<div key={`crumb-${idx}`} className='flex items-center gap-1.5 truncate'>
									{idx > 0 && <ChevronRight className='size-3 shrink-0 text-muted-foreground/50' />}
									<span className={cn(idx === breadcrumbs.length - 1 ? 'text-foreground font-medium' : '')}>
										{crumb}
									</span>
								</div>
							))}
						</nav>

						{/* Command Palette Trigger Button */}
						<button
							type='button'
							onClick={() => setCmdOpen(true)}
							className='border-border bg-surface text-muted-foreground hover:border-signal/50 hover:text-foreground flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-colors cursor-pointer ml-1'>
							<Search className='size-3.5 text-muted-foreground' />
							<span className='hidden md:inline'>Search commands…</span>
							<kbd className='rounded border border-border bg-surface-strong px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground'>
								⌘K
							</kbd>
						</button>
					</div>

					<div className='flex items-center gap-2.5 shrink-0'>
						{/* API Connection Telemetry Badge */}
						<div className='border-border bg-surface text-muted-foreground hidden items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs md:flex'>
							<span className='bg-success size-2 animate-pulse rounded-full' />
							<span>API Connected</span>
							<span className='text-[0.625rem] opacity-60'>v1</span>
						</div>

						{/* Public Website External Link */}
						<a
							href='https://koushikpuppala.com'
							target='_blank'
							rel='noopener noreferrer'
							className='border-border bg-surface text-muted-foreground hover:border-signal/50 hover:text-foreground hidden items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-xs transition-colors sm:inline-flex'>
							<span>Live Site</span>
							<ExternalLink className='size-3' />
						</a>

						{/* Dark / Light Mode Toggle */}
						<button
							type='button'
							onClick={toggleTheme}
							title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
							className='border-border bg-surface text-muted-foreground hover:text-foreground cursor-pointer rounded-xl border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
							{theme === 'dark' ? <Sun className='size-4' /> : <Moon className='size-4' />}
						</button>

						{/* User Menu */}
						<div className='relative' ref={userMenuRef}>
							<button
								type='button'
								onClick={() => setUserMenuOpen(prev => !prev)}
								aria-expanded={userMenuOpen}
								className='border-border bg-surface text-foreground hover:bg-accent flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
								<span className='bg-signal grid size-6 place-items-center rounded-full font-mono text-[0.625rem] font-bold text-white'>
									{user?.displayName?.[0] || 'K'}
								</span>
								<span className='hidden max-w-[120px] truncate font-medium sm:inline'>
									{user?.displayName || 'Koushik'}
								</span>
							</button>

							{userMenuOpen && (
								<div className='border-border bg-surface absolute right-0 z-50 mt-2 w-48 rounded-xl border p-1.5 font-mono text-xs shadow-xl animate-in fade-in-50 zoom-in-95 duration-100'>
									<div className='border-border mb-1 border-b px-2.5 py-2'>
										<p className='text-foreground truncate font-sans font-semibold'>
											{user?.displayName}
										</p>
										<p className='text-muted-foreground truncate text-[0.6875rem]'>{user?.email}</p>
									</div>
									<Link
										href='/settings'
										onClick={() => setUserMenuOpen(false)}
										className='text-foreground hover:bg-accent flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors'>
										<Settings className='text-muted-foreground size-3.5' />
										<span>Settings</span>
									</Link>
									<button
										type='button'
										onClick={() => {
											setUserMenuOpen(false)
											logout()
										}}
										className='text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors'>
										<LogOut className='size-3.5' />
										<span>Sign Out</span>
									</button>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* Page Body (Scrollable Main Area) */}
				<main className='mx-auto w-full max-w-7xl flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>{children}</main>
			</div>

			{/* Command Palette Modal */}
			<CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
		</div>
	)
}

