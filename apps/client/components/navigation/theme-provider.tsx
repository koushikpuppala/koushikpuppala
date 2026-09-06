'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'dark' | 'light'

type ThemeContextValue = {
	theme: Theme
	toggleTheme: () => void
	setTheme: (theme: Theme) => void
	mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = 'kp-theme-preference'

export type ThemeProviderProps = {
	children: ReactNode
	defaultTheme?: Theme
}

/**
 * ThemeProvider
 * Centralized theme provider supporting the dark-first Signal aesthetic with light mode support.
 */
export const ThemeProvider = ({ children, defaultTheme = 'dark' }: ThemeProviderProps) => {
	const [theme, setThemeState] = useState<Theme>(defaultTheme)
	const [mounted, setMounted] = useState(false)

	const applyTheme = useCallback((targetTheme: Theme) => {
		const root = document.documentElement
		if (targetTheme === 'dark') {
			root.classList.add('dark')
			root.classList.remove('light')
			root.setAttribute('data-theme', 'dark')
			root.style.colorScheme = 'dark'
		} else {
			root.classList.add('light')
			root.classList.remove('dark')
			root.setAttribute('data-theme', 'light')
			root.style.colorScheme = 'light'
		}
	}, [])

	useEffect(() => {
		setMounted(true)
		try {
			const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
			if (stored === 'light' || stored === 'dark') {
				setThemeState(stored)
				applyTheme(stored)
				return
			}
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			const initial: Theme = prefersDark ? 'dark' : 'light'
			setThemeState(initial)
			applyTheme(initial)
		} catch {
			applyTheme(defaultTheme)
		}
	}, [applyTheme, defaultTheme])

	const setTheme = useCallback(
		(newTheme: Theme) => {
			setThemeState(newTheme)
			applyTheme(newTheme)
			try {
				localStorage.setItem(THEME_STORAGE_KEY, newTheme)
			} catch {
				// Fallback if storage unavailable
			}
		},
		[applyTheme],
	)

	const toggleTheme = useCallback(() => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}, [theme, setTheme])

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}
