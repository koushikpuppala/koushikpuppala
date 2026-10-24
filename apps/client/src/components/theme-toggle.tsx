'use client'

import type { ThemeToggleProps } from 'types/components/client'
import { Moon, Sun } from 'components/icons'
import { classNames } from 'utils/classNames'

const STORAGE_KEY = 'theme'

const toggleTheme = () => {
	const root = document.documentElement
	const dark = !root.classList.contains('dark')

	root.classList.toggle('dark', dark)
	root.style.colorScheme = dark ? 'dark' : 'light'

	try {
		localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
	} catch {}
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
	return (
		<button
			type='button'
			onClick={toggleTheme}
			aria-label='Toggle light and dark theme'
			title='Toggle theme'
			className={classNames(
				'group text-muted-foreground hover:bg-accent hover:text-foreground grid size-9 place-items-center rounded-lg transition-colors',
				className,
			)}>
			<Sun className='hidden size-4 transition-transform duration-300 group-hover:rotate-45 dark:block' />
			<Moon className='size-4 transition-transform duration-300 group-hover:-rotate-12 dark:hidden' />
		</button>
	)
}
