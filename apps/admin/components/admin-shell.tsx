'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
	Activity,
	BookOpen,
	Briefcase,
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
	Settings,
	Share2,
	Sparkles,
	Sun,
	Users,
	Wrench,
	X,
	Zap,
} from '@/components/icons'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

type NavSection = {
	group: string | null
	items: {
		href: string
		label: string
		icon: React.ComponentType<{ className?: string }>
	}[]
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

	useEffect(() => {
		if (!loading) {
			if (!user && pathname !== '/login') {
				router.replace('/login')
			} else if (user && pathname === '/login') {
				router.replace('/')
			}
		}
	}, [user, loading, pathname, router])

	if (pathname === '/login') {
		return <main className='bg-background text-foreground min-h-screen'>{children}</main>
	}

	if (loading || !user) {
		return (
			<div className='bg-background text-foreground flex min-h-screen items-center justify-center'>
				<div className='flex flex-col items-center gap-3'>
					<div className='bg-signal grid size-10 animate-pulse place-items-center rounded-2xl font-mono text-sm font-bold text-white'>
						KP
					</div>
					<p className='text-muted-foreground font-mono text-xs'>Authenticating Content Studio…</p>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-background text-foreground flex min-h-screen'>
			{/* Desktop Sidebar */}
			<aside className='border-border bg-sidebar sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex'>
				<div className='border-sidebar-border flex h-16 shrink-0 items-center justify-between border-b px-5'>
					<Link href='/' className='flex items-center gap-2.5'>
						<span className='bg-signal text-signal-foreground grid size-8 place-items-center rounded-lg font-mono text-xs font-bold'>
							KP
						</span>
						<div>
							<span className='font-display block text-sm font-bold tracking-tight'>
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
												'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
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

				{/* Sidebar Footer User Info */}
				{/* <div className='border-sidebar-border shrink-0 border-t p-3'>
					<div className='border-border/80 bg-surface/50 flex items-center justify-between rounded-xl border p-2.5'>
						<div className='flex min-w-0 items-center gap-2'>
							<div className='bg-signal/20 text-signal-ink grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-bold'>
								{user?.displayName?.[0] || 'K'}
							</div>
							<div className='min-w-0 flex-1'>
								<p className='text-foreground truncate font-sans text-xs font-medium'>
									{user?.displayName || 'Koushik Puppala'}
								</p>
								<p className='text-signal-ink truncate font-mono text-[0.5625rem] uppercase'>
									{user?.role || 'ADMIN'}
								</p>
							</div>
						</div>
						<button
							type='button'
							onClick={() => logout()}
							title='Sign out'
							className='text-muted-foreground hover:bg-destructive/15 hover:text-destructive cursor-pointer rounded-lg p-1 transition-colors'>
							<LogOut className='size-4' />
						</button>
					</div>
				</div> */}
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
														'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
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
								className='text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-lg p-2 text-xs'>
								<LogOut className='size-4' />
								<span>Sign out</span>
							</button>
						</div>
					</aside>
				</div>
			)}

			{/* Main Content Area */}
			<div className='flex min-w-0 flex-1 flex-col'>
				{/* Top Header */}
				<header className='border-border bg-background/90 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6'>
					<div className='flex items-center gap-3'>
						<button
							type='button'
							onClick={() => setMobileOpen(true)}
							className='text-muted-foreground hover:bg-accent rounded-lg p-1.5 lg:hidden'>
							<Menu className='size-5' />
						</button>

						{/* API Connection Telemetry Badge */}
						<div className='border-border bg-surface text-muted-foreground hidden items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs sm:flex'>
							<span className='bg-success size-2 animate-pulse rounded-full' />
							<span>API Connected</span>
							<span className='text-[0.625rem] opacity-60'>v1</span>
						</div>
					</div>

					<div className='flex items-center gap-2.5'>
						{/* Public Website External Link */}
						<a
							href='https://koushikpuppala.com'
							target='_blank'
							rel='noopener noreferrer'
							className='border-border bg-surface text-muted-foreground hover:border-signal/50 hover:text-foreground hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors sm:inline-flex'>
							<span>Live Site</span>
							<ExternalLink className='size-3' />
						</a>

						{/* Dark / Light Mode Toggle */}
						<button
							type='button'
							onClick={toggleTheme}
							title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
							className='border-border bg-surface text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border p-2 transition-colors'>
							{theme === 'dark' ? <Sun className='size-4' /> : <Moon className='size-4' />}
						</button>

						{/* User Menu */}
						<div className='relative'>
							<button
								type='button'
								onClick={() => setUserMenuOpen(prev => !prev)}
								className='border-border bg-surface text-foreground hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors'>
								<span className='bg-signal grid size-6 place-items-center rounded-full font-mono text-[0.625rem] font-bold text-white'>
									{user?.displayName?.[0] || 'K'}
								</span>
								<span className='hidden max-w-[120px] truncate font-medium sm:inline'>
									{user?.displayName || 'Koushik'}
								</span>
							</button>

							{userMenuOpen && (
								<div className='border-border bg-surface absolute right-0 z-50 mt-2 w-48 rounded-xl border p-1.5 font-mono text-xs shadow-xl'>
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

				{/* Page Body */}
				<main className='mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8'>{children}</main>
			</div>
		</div>
	)
}
