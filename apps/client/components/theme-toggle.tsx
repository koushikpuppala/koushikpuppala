'use client'

import { useState } from 'react'
import { Moon, Palette, Sun, X } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, palette, toggle, togglePalette } = useTheme()

	return (
		<div className={cn('flex items-center gap-1', className)}>
			{/* Palette switcher (New / Old) */}
			<button
				type='button'
				onClick={togglePalette}
				title={`Palette: ${palette === 'new' ? 'New (Portfolio Weaver)' : 'Old (Classic Signal)'} — click to compare`}
				aria-label={`Switch to ${palette === 'new' ? 'old' : 'new'} theme palette`}
				className='group inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-2 font-mono text-[0.6875rem] text-muted-foreground transition-all duration-300 hover:border-signal/50 hover:bg-surface hover:text-foreground'>
				<Palette className='size-3 text-signal-ink transition-transform duration-300 group-hover:rotate-45' />
				<span className='font-medium uppercase tracking-wider hidden min-[420px]:inline'>
					{palette === 'new' ? 'Weaver' : 'Classic'}
				</span>
				<span className='rounded bg-signal-soft px-1 py-0.5 font-mono text-[0.5625rem] text-signal-ink uppercase'>
					{palette === 'new' ? 'New' : 'Old'}
				</span>
			</button>

			{/* Light / Dark Mode toggle */}
			<Button
				variant='ghost'
				size='icon'
				className='size-8'
				onClick={toggle}
				aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
				title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
				{theme === 'dark' ? <Sun className='size-4' /> : <Moon className='size-4' />}
			</Button>
		</div>
	)
}

/**
 * Floating Theme Comparator Tool
 * Renders an accessible comparison dock at the bottom-right so the user
 * can compare all 4 combinations:
 * 1. New (Weaver) Dark
 * 2. New (Weaver) Light
 * 3. Old (Classic) Dark
 * 4. Old (Classic) Light
 */
export function ThemeComparator({ className }: { className?: string }) {
	const { theme, palette, setTheme, setPalette } = useTheme()
	const [minimized, setMinimized] = useState(false)

	if (minimized) {
		return (
			<button
				type='button'
				onClick={() => setMinimized(false)}
				aria-label='Open theme comparator'
				title='Open theme comparison tools'
				className={cn(
					'fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3.5 py-2 font-mono text-xs text-foreground shadow-lg backdrop-blur-md transition-all hover:border-signal/60 hover:shadow-xl',
					className,
				)}>
				<span className='size-2 rounded-full bg-signal animate-pulse' />
				<span>Compare Themes</span>
				<span className='rounded bg-signal-soft px-1.5 py-0.5 text-[0.625rem] text-signal-ink uppercase'>
					{palette} · {theme}
				</span>
			</button>
		)
	}

	return (
		<div
			className={cn(
				'fixed bottom-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-background/95 p-4 font-mono text-xs shadow-2xl backdrop-blur-xl transition-all',
				className,
			)}>
			<div className='flex items-center justify-between border-b border-border pb-2.5'>
				<div className='flex items-center gap-2'>
					<Palette className='size-3.5 text-signal-ink' />
					<span className='font-display font-semibold tracking-tight text-foreground'>
						Theme Comparator
					</span>
				</div>
				<button
					type='button'
					onClick={() => setMinimized(true)}
					className='rounded p-1 text-muted-foreground hover:bg-surface hover:text-foreground'
					aria-label='Minimize theme comparator'>
					<X className='size-3.5' />
				</button>
			</div>

			<div className='mt-3 space-y-3'>
				{/* Palette selector */}
				<div>
					<div className='flex items-center justify-between text-[0.6875rem] text-muted-foreground'>
						<span>PALETTE</span>
						<span className='text-signal-ink'>
							{palette === 'new' ? 'OKLCH Modern' : 'Classic Hex'}
						</span>
					</div>
					<div className='mt-1.5 grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-surface p-1'>
						<button
							type='button'
							onClick={() => setPalette('new')}
							className={cn(
								'flex flex-col items-center rounded-md py-1.5 px-2 text-[0.6875rem] transition-all',
								palette === 'new'
									? 'bg-background text-foreground shadow-sm font-semibold'
									: 'text-muted-foreground hover:text-foreground',
							)}>
							<span>New (Weaver)</span>
							<span className='text-[0.5625rem] opacity-75'>OKLCH Tone</span>
						</button>
						<button
							type='button'
							onClick={() => setPalette('old')}
							className={cn(
								'flex flex-col items-center rounded-md py-1.5 px-2 text-[0.6875rem] transition-all',
								palette === 'old'
									? 'bg-background text-foreground shadow-sm font-semibold'
									: 'text-muted-foreground hover:text-foreground',
							)}>
							<span>Old (Classic)</span>
							<span className='text-[0.5625rem] opacity-75'>#090a0c / Pink</span>
						</button>
					</div>
				</div>

				{/* Mode selector */}
				<div>
					<div className='flex items-center justify-between text-[0.6875rem] text-muted-foreground'>
						<span>COLOR MODE</span>
						<span className='text-foreground capitalize'>{theme}</span>
					</div>
					<div className='mt-1.5 grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-surface p-1'>
						<button
							type='button'
							onClick={() => setTheme('dark')}
							className={cn(
								'flex items-center justify-center gap-1.5 rounded-md py-1.5 px-2 text-[0.6875rem] transition-all',
								theme === 'dark'
									? 'bg-background text-foreground shadow-sm font-semibold'
									: 'text-muted-foreground hover:text-foreground',
							)}>
							<Moon className='size-3 text-signal-ink' />
							<span>Dark Mode</span>
						</button>
						<button
							type='button'
							onClick={() => setTheme('light')}
							className={cn(
								'flex items-center justify-center gap-1.5 rounded-md py-1.5 px-2 text-[0.6875rem] transition-all',
								theme === 'light'
									? 'bg-background text-foreground shadow-sm font-semibold'
									: 'text-muted-foreground hover:text-foreground',
							)}>
							<Sun className='size-3 text-signal-ink' />
							<span>Light Mode</span>
						</button>
					</div>
				</div>

				{/* Live Active Pill Indicator */}
				<div className='rounded-lg border border-border/80 bg-surface/50 px-2.5 py-2 text-[0.625rem] leading-relaxed text-muted-foreground'>
					<span className='font-semibold text-foreground'>Active: </span>
					<span className='text-signal-ink'>
						{palette === 'new' ? 'New (Portfolio Weaver)' : 'Old (Classic v5)'}
					</span>
					{' · '}
					<span className='capitalize font-medium text-foreground'>{theme} Mode</span>
				</div>
			</div>
		</div>
	)
}
