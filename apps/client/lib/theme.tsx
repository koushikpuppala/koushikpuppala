'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark'
export type ThemePalette = 'new' | 'old'

type ThemeContextType = {
	theme: ThemeMode
	palette: ThemePalette
	toggle: () => void
	togglePalette: () => void
	setTheme: (t: ThemeMode) => void
	setPalette: (p: ThemePalette) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

/**
 * The document class and data-palette attribute are applied before first paint by the
 * bootstrap script in `app/layout.tsx`; this provider mirrors and mutates that state.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<ThemeMode>('dark')
	const [palette, setPalette] = useState<ThemePalette>('new')
	const [ready, setReady] = useState(false)

	useEffect(() => {
		const root = document.documentElement
		const isDark = root.classList.contains('dark')
		const currentPalette = (root.getAttribute('data-palette') as ThemePalette) || 'new'
		setTheme(isDark ? 'dark' : 'light')
		setPalette(currentPalette === 'old' ? 'old' : 'new')
		setReady(true)
	}, [])

	useEffect(() => {
		if (!ready) return
		const root = document.documentElement
		root.classList.toggle('dark', theme === 'dark')
		root.style.colorScheme = theme
		root.setAttribute('data-palette', palette)
		try {
			window.localStorage.setItem('kp.theme', theme)
			window.localStorage.setItem('kp.palette', palette)
		} catch {
			/* storage can be unavailable in private modes */
		}
	}, [theme, palette, ready])

	const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])
	const togglePalette = useCallback(() => setPalette(p => (p === 'new' ? 'old' : 'new')), [])

	return (
		<ThemeContext.Provider value={{ theme, palette, toggle, togglePalette, setTheme, setPalette }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}
