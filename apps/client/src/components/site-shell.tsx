'use client'

import type { SiteShellProps } from 'types/components/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SiteHeader } from 'components/shell/site-header'
import dynamic from 'next/dynamic'
import { SiteFooter } from 'components/shell/site-footer'

// Both overlays start closed, so their code loads on first use instead of with the page.
const MobileMenu = dynamic(
	() => import('components/shell/mobile-menu').then(mod => mod.MobileMenu),
	{
		ssr: false,
	},
)
const QuickPalette = dynamic(
	() => import('components/shell/quick-palette').then(mod => mod.QuickPalette),
	{ ssr: false },
)

export const SiteShell = ({ children, socials = [] }: SiteShellProps) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [paletteOpen, setPaletteOpen] = useState(false)
	// Stay mounted after the first open so the close animation can still play.
	const [menuUsed, setMenuUsed] = useState(false)
	const [paletteUsed, setPaletteUsed] = useState(false)

	useEffect(() => {
		if (menuOpen) setMenuUsed(true)
	}, [menuOpen])

	useEffect(() => {
		if (paletteOpen) setPaletteUsed(true)
	}, [paletteOpen])

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
			{menuUsed ? (
				<MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} socials={socials} />
			) : null}
			{paletteUsed ? (
				<QuickPalette open={paletteOpen} onOpenChange={setPaletteOpen} socials={socials} />
			) : null}
			<main id='main' className='flex-1'>
				{children}
			</main>
			<SiteFooter socials={socials} />
		</div>
	)
}
