'use client'

import type { QuickPaletteProps } from 'types/components/client'
import { Search } from 'components/icons'
import { classNames } from 'utils/classNames'
import { useRouter } from 'next/navigation'
import {
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { allDestinations } from './navigation'

export const QuickPalette = ({ open, onOpenChange, socials }: QuickPaletteProps) => {
	const router = useRouter()

	const [query, setQuery] = useState('')

	const [selectedIndex, setSelectedIndex] = useState(0)

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (open) {
			setQuery('')
			setSelectedIndex(0)

			setTimeout(() => inputRef.current?.focus(), 50)

			const previous = document.body.style.overflow

			document.body.style.overflow = 'hidden'

			return () => {
				document.body.style.overflow = previous
			}
		}
	}, [open])

	const filteredPages = useMemo(() => {
		const q = query.trim().toLowerCase()

		if (!q) return allDestinations

		return allDestinations.filter(item => item.label.toLowerCase().includes(q))
	}, [query])

	const filteredSocials = useMemo(() => {
		const q = query.trim().toLowerCase()

		if (!q) return socials

		return socials.filter(
			s => s.label?.toLowerCase().includes(q) || s.handle?.toLowerCase().includes(q),
		)
	}, [query, socials])

	const totalItems = filteredPages.length + filteredSocials.length + 2

	const handleKeyDown = (e: ReactKeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault()
			onOpenChange(false)
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelectedIndex(prev => (prev + 1) % totalItems)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems)
		} else if (e.key === 'Enter') {
			e.preventDefault()

			if (selectedIndex < filteredPages.length) {
				const page = filteredPages[selectedIndex]

				if (page) {
					onOpenChange(false)
					router.push(page.href)
				}
			} else if (selectedIndex < filteredPages.length + filteredSocials.length) {
				const social = filteredSocials[selectedIndex - filteredPages.length]

				if (social) {
					onOpenChange(false)
					window.open(social.url, '_blank', 'noopener,noreferrer')
				}
			} else {
				onOpenChange(false)
			}
		}
	}

	if (!open) return null

	return (
		<div className='fixed inset-0 z-70 flex items-start justify-center px-4 pt-20 sm:pt-28'>
			<button
				type='button'
				aria-label='Close quick navigation'
				className='bg-background/80 fixed inset-0 cursor-default backdrop-blur-md transition-opacity'
				onClick={() => onOpenChange(false)}
				tabIndex={-1}
			/>
			<div
				role='dialog'
				aria-modal='true'
				aria-label='Quick navigation'
				className='border-border bg-surface relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-(--shadow-lift)'
				onKeyDown={handleKeyDown}>
				<div className='border-border flex items-center border-b px-4'>
					<Search className='text-muted-foreground size-4 shrink-0 opacity-60' />
					<input
						ref={inputRef}
						value={query}
						onChange={e => {
							setQuery(e.target.value)
							setSelectedIndex(0)
						}}
						placeholder='Jump to a page, or search…'
						className='text-foreground placeholder:text-muted-foreground h-12 w-full bg-transparent px-3 text-sm outline-none'
					/>
					<kbd className='border-border bg-background/80 text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[0.625rem]'>
						ESC
					</kbd>
				</div>

				<div className='max-h-80 overflow-y-auto p-2'>
					{filteredPages.length === 0 && filteredSocials.length === 0 && query.trim() ? (
						<p className='text-muted-foreground py-6 text-center text-sm'>
							No matches found for &ldquo;{query}&rdquo;.
						</p>
					) : null}

					{filteredPages.length > 0 ? (
						<div className='mb-2'>
							<p className='text-muted-foreground px-2 py-1 font-mono text-[0.6875rem] tracking-wider uppercase'>
								Pages
							</p>
							{filteredPages.map((page, i) => {
								const isSelected = selectedIndex === i
								return (
									<button
										key={page.href}
										type='button'
										onClick={() => {
											onOpenChange(false)
											router.push(page.href)
										}}
										onMouseEnter={() => setSelectedIndex(i)}
										className={classNames(
											'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
											{
												'text-foreground/80 hover:bg-accent/60': !isSelected,
												'bg-accent text-accent-foreground': isSelected,
											},
										)}>
										<span>{page.label}</span>
										<span className='text-muted-foreground font-mono text-xs'>{page.href}</span>
									</button>
								)
							})}
						</div>
					) : null}

					{filteredSocials.length > 0 ? (
						<div className='mb-2'>
							<p className='text-muted-foreground px-2 py-1 font-mono text-[0.6875rem] tracking-wider uppercase'>
								Elsewhere
							</p>
							{filteredSocials.map((social, i) => {
								const currentIdx = filteredPages.length + i
								const isSelected = selectedIndex === currentIdx
								return (
									<button
										key={social.id}
										type='button'
										onClick={() => {
											onOpenChange(false)
											window.open(social.url, '_blank', 'noopener,noreferrer')
										}}
										onMouseEnter={() => setSelectedIndex(currentIdx)}
										className={classNames(
											'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
											isSelected
												? 'bg-accent text-accent-foreground'
												: 'text-foreground/80 hover:bg-accent/60',
										)}>
										<span>{social.label}</span>
										<span className='text-muted-foreground font-mono text-xs'>
											{social.handle ?? ''}
										</span>
									</button>
								)
							})}
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
