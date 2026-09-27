'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
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
	Zap,
} from '@/components/icons'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

type CommandItem = {
	id: string
	label: string
	category: string
	icon: React.ComponentType<{ className?: string }>
	action: () => void
	shortcut?: string
}

type CommandPaletteProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
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
			setTimeout(() => inputRef.current?.focus(), 50)
		}
	}, [open])

	const commands = useMemo<CommandItem[]>(() => {
		const navigate = (href: string) => {
			onOpenChange(false)
			router.push(href)
		}

		return [
			{ id: 'dash', label: 'Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/') },
			{ id: 'home', label: 'Home Page Content', category: 'Content', icon: Sparkles, action: () => navigate('/content/home') },
			{ id: 'about', label: 'About Page Content', category: 'Content', icon: FileText, action: () => navigate('/content/about') },
			{ id: 'projects', label: 'Projects & Work', category: 'Content', icon: FolderKanban, action: () => navigate('/content/projects') },
			{ id: 'experience', label: 'Experience Timeline', category: 'Content', icon: Briefcase, action: () => navigate('/content/experience') },
			{ id: 'education', label: 'Education & Honors', category: 'Content', icon: BookOpen, action: () => navigate('/content/education') },
			{ id: 'services', label: 'Services & Advisory', category: 'Content', icon: Wrench, action: () => navigate('/content/services') },
			{ id: 'skills', label: 'Skills & Tech Stack', category: 'Content', icon: Zap, action: () => navigate('/content/skills') },
			{ id: 'resume', label: 'Resume Document', category: 'Content', icon: ScrollText, action: () => navigate('/content/resume') },
			{ id: 'social', label: 'Social Channels', category: 'Content', icon: Share2, action: () => navigate('/content/social') },
			{ id: 'media', label: 'Media Library', category: 'Operations', icon: ImageIcon, action: () => navigate('/media') },
			{ id: 'messages', label: 'Inquiries & Messages', category: 'Operations', icon: Inbox, action: () => navigate('/messages') },
			{ id: 'audit', label: 'Audit Logs', category: 'Operations', icon: Activity, action: () => navigate('/audit-logs') },
			{ id: 'metrics', label: 'API Telemetry', category: 'Operations', icon: Gauge, action: () => navigate('/api-metrics') },
			{ id: 'users', label: 'Users & Permissions', category: 'Operations', icon: Users, action: () => navigate('/users') },
			{ id: 'settings', label: 'Site Metadata & SEO', category: 'Configuration', icon: Settings, action: () => navigate('/settings') },
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
					window.open('https://koushikpuppala.com', '_blank', 'noopener,noreferrer')
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

	function handleKeyDown(e: React.KeyboardEvent) {
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
				onClose={() => onOpenChange(false)}
				className='max-w-xl p-0 overflow-hidden border-border bg-surface shadow-2xl rounded-2xl'>
				<div className='flex items-center border-b border-border px-4 py-3'>
					<Search className='size-4 text-muted-foreground mr-3 shrink-0' />
					<input
						ref={inputRef}
						type='text'
						value={query}
						onChange={e => setQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder='Type a command or search section (e.g. Projects, Media, Theme)…'
						className='w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none'
					/>
					<kbd className='hidden sm:inline-block rounded border border-border bg-surface-strong px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground'>
						ESC
					</kbd>
				</div>

				<div className='max-h-80 overflow-y-auto p-2 space-y-1'>
					{filtered.length === 0 ? (
						<div className='py-8 text-center text-xs font-mono text-muted-foreground'>
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
									className={cn(
										'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors cursor-pointer text-left',
										isSelected
											? 'bg-signal/15 text-signal-ink font-medium'
											: 'text-foreground hover:bg-accent',
									)}>
									<div className='flex items-center gap-3'>
										<Icon
											className={cn('size-4 shrink-0', isSelected ? 'text-signal-ink' : 'text-muted-foreground')}
										/>
										<span>{item.label}</span>
									</div>
									<span className='font-mono text-[0.625rem] uppercase text-muted-foreground/70'>
										{item.category}
									</span>
								</button>
							)
						})
					)}
				</div>

				<div className='border-t border-border bg-surface-strong/40 px-4 py-2 flex items-center justify-between text-[0.6875rem] font-mono text-muted-foreground'>
					<div className='flex items-center gap-3'>
						<span><kbd className='rounded border border-border bg-surface px-1 py-0.2'>↑↓</kbd> Navigate</span>
						<span><kbd className='rounded border border-border bg-surface px-1 py-0.2'>↵</kbd> Select</span>
					</div>
					<span>Quick Command Studio</span>
				</div>
			</DialogContent>
		</Dialog>
	)
}
