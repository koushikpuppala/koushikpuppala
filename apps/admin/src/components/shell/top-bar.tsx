'use client'

import type { TopBarProps } from 'types/components/admin'
import Link from 'next/link'
import { useAuth } from 'lib/auth'
import { useTheme } from 'lib/theme'
import { UserMenu } from 'components/shell/user-menu'
import { classNames } from 'utils/classNames'
import { SITE_URL } from 'constants/site-url'
import { breadcrumbsFor } from 'lib/navigation'
import { ChevronRight, ExternalLink, Menu, Moon, Search, Sun } from 'components/icons'

export const TopBar = ({ pathname, menuOpen, onOpenMenu, onOpenPalette }: TopBarProps) => {
	const { user, logout } = useAuth()
	const { theme, toggleTheme } = useTheme()
	const crumbs = breadcrumbsFor(pathname)

	return (
		<header className='border-border bg-background/90 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6'>
			<div className='flex min-w-0 items-center gap-3'>
				<button
					type='button'
					onClick={onOpenMenu}
					aria-label='Open navigation'
					aria-expanded={menuOpen}
					className='text-muted-foreground hover:bg-accent rounded-lg p-1.5 lg:hidden'>
					<Menu className='size-5' />
				</button>

				<nav
					aria-label='Breadcrumb'
					className='text-muted-foreground hidden items-center gap-1.5 truncate font-mono text-xs sm:flex'>
					{crumbs.map((crumb, index) => (
						<div key={`${index}-${crumb}`} className='flex items-center gap-1.5 truncate'>
							{index > 0 && <ChevronRight className='text-muted-foreground/50 size-3 shrink-0' />}
							<span
								className={classNames(
									index === crumbs.length - 1 && 'text-foreground font-medium',
								)}>
								{crumb}
							</span>
						</div>
					))}
				</nav>

				<button
					type='button'
					onClick={onOpenPalette}
					className='border-border bg-surface text-muted-foreground hover:border-signal/50 hover:text-foreground ml-1 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-colors'>
					<Search className='text-muted-foreground size-3.5' />
					<span className='hidden md:inline'>Search commands…</span>
					<kbd className='border-border bg-surface-strong text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[0.625rem]'>
						⌘K
					</kbd>
				</button>
			</div>

			<div className='flex shrink-0 items-center gap-2.5'>
				<div className='border-border bg-surface text-muted-foreground hidden items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs md:flex'>
					<span className='bg-success size-2 animate-pulse rounded-full' />
					<span>API Connected</span>
					<span className='text-[0.625rem] opacity-60'>v1</span>
				</div>

				<Link
					href={SITE_URL}
					target='_blank'
					rel='noopener noreferrer'
					className='border-border bg-surface text-muted-foreground hover:border-signal/50 hover:text-foreground hidden items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-xs transition-colors sm:inline-flex'>
					<span>Live Site</span>
					<ExternalLink className='size-3' />
				</Link>

				<button
					type='button'
					onClick={toggleTheme}
					title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
					aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
					className='border-border bg-surface text-muted-foreground hover:text-foreground focus-ring:ring-ring focus-ring:ring-2 cursor-pointer rounded-xl border p-2 transition-colors outline-none'>
					{theme === 'dark' ? <Sun className='size-4' /> : <Moon className='size-4' />}
				</button>

				<UserMenu user={user} onSignOut={logout} />
			</div>
		</header>
	)
}
