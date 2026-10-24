'use client'

import type { SiteShellProps } from 'types/components/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SiteHeader } from 'components/shell/site-header'
import { MobileMenu } from 'components/shell/mobile-menu'
import { QuickPalette } from 'components/shell/quick-palette'
import { SiteFooter } from 'components/shell/site-footer'

export const SiteShell = ({ children, socials = [] }: SiteShellProps) => {
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
			<Link
				href='#main'
				className='focus:bg-foreground focus:text-background sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-70 focus:rounded-lg focus:px-4 focus:py-2'>
				Skip to content
			</Link>
			<SiteHeader onOpenMenu={() => setMenuOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />
			<MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} socials={socials} />
			<QuickPalette open={paletteOpen} onOpenChange={setPaletteOpen} socials={socials} />
			<main id='main' className='flex-1'>
				{children}
			</main>
			<SiteFooter socials={socials} />
		</div>
	)
}
