'use client'

import type { CommandItem, CommandPaletteProps } from 'types/components/admin'
import { useEffect, useState, useMemo, useRef, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
	Activity,
	BookOpen,
	Briefcase,
	ExternalLink,
	FileText,
	FolderKanban,
	Gauge,
	Image as ImageIcon,
	Inbox,
	LayoutDashboard,
	LogOut,
	Moon,
	ScrollText,
	Search,
	Settings,
	Share2,
	Sparkles,
	Sun,
	Users,
	Wrench,
} from 'components/icons'
import { Dialog, DialogContent } from 'components/ui/dialog'
import { useAuth } from 'lib/auth'
import { useTheme } from 'lib/theme'
import { classNames } from 'utils/classNames'
import { SITE_URL } from 'constants/site-url'

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
	const router = useRouter()
	const { logout } = useAuth()
	const { theme, toggleTheme } = useTheme()
	const [query, setQuery] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (open) {
			setQuery('')
			setSelectedIndex(0)
			// Wait for the dialog to mount and finish its enter transition before focusing the input.
			setTimeout(() => inputRef.current?.focus(), 50)
		}
	}, [open])

	const commands = useMemo<CommandItem[]>(() => {
		const navigate = (href: string) => {
			onOpenChange(false)
			router.push(href)
		}

		return [
			{
				id: 'dash',
				label: 'Dashboard',
				category: 'Navigation',
				icon: LayoutDashboard,
				action: () => navigate('/'),
			},
			{
				id: 'home',
				label: 'Home Page Content',
				category: 'Content',
				icon: Sparkles,
				action: () => navigate('/content/home'),
			},
			{
				id: 'about',
				label: 'About Page Content',
				category: 'Content',
				icon: FileText,
				action: () => navigate('/content/about'),
			},
			{
				id: 'projects',
				label: 'Projects & Work',
				category: 'Content',
				icon: FolderKanban,
				action: () => navigate('/content/projects'),
			},
			{
				id: 'experience',
				label: 'Experience Timeline',
				category: 'Content',
				icon: Briefcase,
				action: () => navigate('/content/experience'),
			},
			{
				id: 'education',
				label: 'Education & Honors',
				category: 'Content',
				icon: BookOpen,
				action: () => navigate('/content/education'),
			},
			{
				id: 'services',
				label: 'Skills (Services)',
				category: 'Content',
				icon: Wrench,
				action: () => navigate('/content/services'),
			},
			{
				id: 'resume',
				label: 'Resume Document',
				category: 'Content',
				icon: ScrollText,
				action: () => navigate('/content/resume'),
			},
			{
				id: 'social',
				label: 'Social Channels',
				category: 'Content',
				icon: Share2,
				action: () => navigate('/content/social'),
			},
			{
				id: 'media',
				label: 'Media Library',
				category: 'Operations',
				icon: ImageIcon,
				action: () => navigate('/media'),
			},
			{
				id: 'messages',
				label: 'Inquiries & Messages',
				category: 'Operations',
				icon: Inbox,
				action: () => navigate('/messages'),
			},
			{
				id: 'audit',
				label: 'Audit Logs',
				category: 'Operations',
				icon: Activity,
				action: () => navigate('/audit-logs'),
			},
			{
				id: 'metrics',
				label: 'API Telemetry',
				category: 'Operations',
				icon: Gauge,
				action: () => navigate('/api-metrics'),
			},
			{
				id: 'users',
				label: 'Users & Permissions',
				category: 'Operations',
				icon: Users,
				action: () => navigate('/users'),
			},
			{
				id: 'settings',
				label: 'Site Metadata & SEO',
				category: 'Configuration',
				icon: Settings,
				action: () => navigate('/settings'),
			},
			{
				id: 'theme',
				label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
				category: 'Preferences',
				icon: theme === 'dark' ? Sun : Moon,
				action: () => {
					toggleTheme()
					onOpenChange(false)
				},
			},
			{
				id: 'livesite',
				label: 'Open Live Portfolio Site',
				category: 'External',
				icon: ExternalLink,
				action: () => {
					window.open(SITE_URL, '_blank', 'noopener,noreferrer')
					onOpenChange(false)
				},
			},
			{
				id: 'logout',
				label: 'Sign Out of CMS',
				category: 'Account',
				icon: LogOut,
				action: () => {
					onOpenChange(false)
					logout()
				},
			},
		]
	}, [router, onOpenChange, theme, toggleTheme, logout])

	const filtered = useMemo(() => {
		if (!query.trim()) return commands
		const q = query.toLowerCase()
		return commands.filter(
			c => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q),
		)
	}, [commands, query])

	useEffect(() => {
		setSelectedIndex(0)
	}, [query])

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelectedIndex(prev => (prev + 1) % (filtered.length || 1))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1))
		} else if (e.key === 'Enter') {
			e.preventDefault()
			if (filtered[selectedIndex]) {
				filtered[selectedIndex].action()
			}
		} else if (e.key === 'Escape') {
			e.preventDefault()
			onOpenChange(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				aria-label='Command palette'
				className='border-border bg-surface max-w-xl overflow-hidden rounded-2xl p-0 shadow-2xl'>
				<div className='border-border flex items-center border-b px-4 py-3'>
					<Search className='text-muted-foreground mr-3 size-4 shrink-0' />
					<input
						ref={inputRef}
						type='text'
						value={query}
						onChange={e => setQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder='Type a command or search section (e.g. Projects, Media, Theme)…'
						className='text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none'
					/>
					<button
						type='button'
						onClick={() => onOpenChange(false)}
						aria-label='Close command palette'
						className='border-border bg-surface-strong text-muted-foreground hover:text-foreground focus-ring:ring-2 focus-ring:ring-signal/40 ml-3 shrink-0 cursor-pointer rounded border px-1.5 py-0.5 font-mono text-[0.625rem] transition-colors outline-none'>
						ESC
					</button>
				</div>

				<div className='max-h-80 space-y-1 overflow-y-auto p-2'>
					{filtered.length === 0 ? (
						<div className='text-muted-foreground py-8 text-center font-mono text-xs'>
							No commands found matching "{query}"
						</div>
					) : (
						filtered.map((item, idx) => {
							const Icon = item.icon
							const isSelected = idx === selectedIndex
							return (
								<button
									key={item.id}
									type='button'
									onClick={() => item.action()}
									onMouseEnter={() => setSelectedIndex(idx)}
									className={classNames(
										'flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors',
										isSelected
											? 'bg-signal/15 text-signal-ink font-medium'
											: 'text-foreground hover:bg-accent',
									)}>
									<div className='flex items-center gap-3'>
										<Icon
											className={classNames(
												'size-4 shrink-0',
												isSelected ? 'text-signal-ink' : 'text-muted-foreground',
											)}
										/>
										<span>{item.label}</span>
									</div>
									<span className='text-muted-foreground/70 font-mono text-[0.625rem] uppercase'>
										{item.category}
									</span>
								</button>
							)
						})
					)}
				</div>

				<div className='border-border bg-surface-strong/40 text-muted-foreground flex items-center justify-between border-t px-4 py-2 font-mono text-[0.6875rem]'>
					<div className='flex items-center gap-3'>
						<span>
							<kbd className='border-border bg-surface py-0.2 rounded border px-1'>↑↓</kbd> Navigate
						</span>
						<span>
							<kbd className='border-border bg-surface py-0.2 rounded border px-1'>↵</kbd> Select
						</span>
					</div>
					<span>Quick Command Studio</span>
				</div>
			</DialogContent>
		</Dialog>
	)
}
