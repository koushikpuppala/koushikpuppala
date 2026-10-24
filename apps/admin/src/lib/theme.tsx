'use client'

import type { ChildrenProps } from 'types/components'
import type { Theme, ThemeContextValue } from 'types/components/admin'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext<ThemeContextValue>({
	theme: 'dark',
	toggleTheme: () => {},
	setTheme: () => {},
})

export const ThemeProvider = ({ children }: ChildrenProps) => {
	const [theme, setThemeState] = useState<Theme>('dark')

	// Read the saved theme after mount; localStorage and matchMedia do not exist during server rendering.
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

	const setTheme = (t: Theme) => {
		setThemeState(t)
		localStorage.setItem('kp.admin.theme', t)
		document.documentElement.classList.toggle('dark', t === 'dark')
	}

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	return useContext(ThemeContext)
}
