'use client'

import type { ChildrenProps } from 'types/components'
import { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from 'lib/auth'
import { TopBar } from './top-bar'
import { Sidebar } from './sidebar'
import { MobileNav } from './mobile-nav'
import { StudioBoot } from './studio-boot'
import { CommandPalette } from './command-palette'
import { useAuthRedirect, useCommandShortcut } from 'lib/use-shell-effects'

export const AdminShell = ({ children }: ChildrenProps) => {
	const pathname = usePathname()
	const { user, loading, stage, logout } = useAuth()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [paletteOpen, setPaletteOpen] = useState(false)
	const togglePalette = useCallback(() => setPaletteOpen(prev => !prev), [])

	useCommandShortcut(togglePalette)
	useAuthRedirect(user, loading, pathname)

	if (pathname === '/login')
		return <main className='bg-background text-foreground min-h-screen'>{children}</main>

	if (loading || !user) return <StudioBoot stage={stage} />

	return (
		<div className='bg-background text-foreground flex h-screen w-screen overflow-hidden'>
			<Sidebar pathname={pathname} />

			{mobileOpen && (
				<MobileNav pathname={pathname} onClose={() => setMobileOpen(false)} onSignOut={logout} />
			)}

			<div className='flex h-full min-w-0 flex-1 flex-col overflow-hidden'>
				<TopBar
					pathname={pathname}
					menuOpen={mobileOpen}
					onOpenMenu={() => setMobileOpen(true)}
					onOpenPalette={() => setPaletteOpen(true)}
				/>

				<main
					// biome-ignore lint/a11y/noNoninteractiveTabindex: focusable scroll container (WCAG 2.1.1)
					tabIndex={0}
					className='focus-ring:ring-signal/40 focus-ring:ring-2 focus-ring:ring-inset relative mx-auto w-full max-w-7xl flex-1 overflow-y-auto p-4 outline-none sm:p-6 lg:p-8'>
					{children}
				</main>
			</div>

			<CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
		</div>
	)
}
