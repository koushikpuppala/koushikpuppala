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

	// Read the saved theme after mount; localStorage does not exist during server rendering. Without a saved choice the theme stays dark.
	useEffect(() => {
		const stored = localStorage.getItem('kp.admin.theme') as Theme | null
		if (stored === 'light' || stored === 'dark') {
			setThemeState(stored)
			document.documentElement.classList.toggle('dark', stored === 'dark')
		} else {
			document.documentElement.classList.add('dark')
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
