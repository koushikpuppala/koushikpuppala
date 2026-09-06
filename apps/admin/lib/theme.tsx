'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextType = {
	theme: Theme
	toggleTheme: () => void
	setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
	theme: 'dark',
	toggleTheme: () => {},
	setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('dark')

	useEffect(() => {
		const stored = localStorage.getItem('kp.admin.theme') as Theme | null
		if (stored === 'light' || stored === 'dark') {
			setThemeState(stored)
			document.documentElement.classList.toggle('dark', stored === 'dark')
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			const initial = prefersDark ? 'dark' : 'light'
			setThemeState(initial)
			document.documentElement.classList.toggle('dark', initial === 'dark')
		}
	}, [])

	function setTheme(t: Theme) {
		setThemeState(t)
		localStorage.setItem('kp.admin.theme', t)
		document.documentElement.classList.toggle('dark', t === 'dark')
	}

	function toggleTheme() {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	return useContext(ThemeContext)
}
