'use client'

import { useTheme } from './theme-provider'
import { classNames } from '../../lib/utils'

export interface ThemeToggleProps {
	className?: string
	compact?: boolean
}

/**
 * ThemeToggle
 * Precision technical button toggling between dark-first and light mode.
 */
export const ThemeToggle = ({ className, compact = false }: ThemeToggleProps) => {
	const { theme, toggleTheme, mounted } = useTheme()

	if (!mounted) {
		return (
			<div
				className={classNames(
					'h-8 w-8 rounded-full border border-border/40 bg-surface/50 animate-pulse',
					className,
				)}
				aria-hidden='true'
			/>
		)
	}

	const isDark = theme === 'dark'

	return (
		<button
			type='button'
			onClick={toggleTheme}
			aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
			title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
			className={classNames(
				'group relative inline-flex items-center justify-center rounded-full border border-border bg-surface/60 text-muted-foreground transition-all duration-200',
				'hover:border-signal/40 hover:text-foreground hover:bg-surface',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				compact ? 'h-8 w-8' : 'h-8 px-2.5 gap-1.5',
				className,
			)}>
			{isDark ? (
				// Sun Icon for Dark Mode
				<svg
					width='14'
					height='14'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					aria-hidden='true'
					className='transition-transform duration-300 group-hover:rotate-45 group-hover:text-signal'>
					<circle cx='12' cy='12' r='4' />
					<path d='M12 2v2' />
					<path d='M12 20v2' />
					<path d='m4.93 4.93 1.41 1.41' />
					<path d='m17.66 17.66 1.41 1.41' />
					<path d='M2 12h2' />
					<path d='M20 12h2' />
					<path d='m6.34 17.66-1.41 1.41' />
					<path d='m19.07 4.93-1.41 1.41' />
				</svg>
			) : (
				// Moon Icon for Light Mode
				<svg
					width='14'
					height='14'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					aria-hidden='true'
					className='transition-transform duration-300 group-hover:-rotate-12 group-hover:text-signal'>
					<path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
				</svg>
			)}

			{!compact && (
				<span className='font-mono text-[11px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors'>
					{isDark ? 'DARK' : 'LIGHT'}
				</span>
			)}
		</button>
	)
}
