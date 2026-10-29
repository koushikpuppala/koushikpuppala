'use client'

import type { MobileMenuProps } from 'types/components/client'
import Link from 'next/link'
import { X, socialIcon } from 'components/icons'
import { Button } from 'ui/button'
import { AnimatePresence } from 'motion/react'
import { div as MotionDiv, li as MotionLi } from 'motion/react-m'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { allDestinations } from 'components/shell/navigation'
import { WordMark } from 'components/shell/word-mark'

export const MobileMenu = ({ open, onClose, socials }: MobileMenuProps) => {
	useEffect(() => {
		if (!open) return

		const previous = document.body.style.overflow

		document.body.style.overflow = 'hidden'

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}

		window.addEventListener('keydown', onKey)

		return () => {
			document.body.style.overflow = previous
			window.removeEventListener('keydown', onKey)
		}
	}, [open, onClose])

	const pathname = usePathname()

	return (
		<AnimatePresence>
			{open ? (
				<MotionDiv
					key='mobile-menu'
					role='dialog'
					aria-modal='true'
					aria-label='Site navigation'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					className='bg-background fixed inset-0 z-60 flex flex-col lg:hidden'>
					<div className='grid-fine pointer-events-none absolute inset-0 opacity-70' aria-hidden />
					<div
						className='pointer-events-none absolute -top-24 -right-20 size-104 rounded-full opacity-50 blur-3xl'
						style={{ background: 'var(--glow-signal)' }}
						aria-hidden
					/>

					<div className='container-page relative flex h-20 shrink-0 items-center justify-between'>
						<WordMark />
						<button
							type='button'
							onClick={onClose}
							aria-label='Close navigation menu'
							className='text-foreground hover:bg-accent grid size-9 place-items-center rounded-lg transition-colors'>
							<X className='size-5' />
						</button>
					</div>

					<nav aria-label='Mobile' className='container-page relative flex-1 overflow-y-auto py-4'>
						<ul className='flex flex-col'>
							{allDestinations.map((item, i) => {
								const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

								return (
									<MotionLi
										key={item.href}
										initial={{ opacity: 0, y: 18 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.06 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
										className='border-border border-b last:border-none'>
										<Link
											href={item.href}
											onClick={onClose}
											className='group flex items-baseline justify-between gap-4 py-4'
											data-active={active ? 'true' : undefined}>
											<span className='font-display text-foreground/85 group-hover:text-foreground group-data-[active=true]:text-foreground text-[2rem] leading-none font-semibold tracking-tight transition-colors'>
												{item.label}
											</span>
											<span className='text-muted-foreground font-mono text-[0.625rem]'>
												{String(i + 1).padStart(2, '0')}
											</span>
										</Link>
									</MotionLi>
								)
							})}
						</ul>
					</nav>

					<MotionDiv
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.35, duration: 0.4 }}
						className='container-page border-border relative shrink-0 border-t py-6'>
						<div className='flex flex-wrap items-center justify-between gap-4'>
							<div className='flex items-center gap-2'>
								{socials.map(social => {
									const Icon = socialIcon(social)
									return (
										<Link
											key={social.id}
											href={social.url}
											target='_blank'
											rel='noreferrer noopener'
											aria-label={social.label ?? social.platform}
											className='border-border text-muted-foreground hover:border-border-strong hover:text-foreground grid size-10 place-items-center rounded-lg border transition-colors'>
											<Icon className='size-4' aria-hidden focusable='false' />
										</Link>
									)
								})}
							</div>
							<div className='flex items-center gap-2'>
								<Button asChild size='lg'>
									<Link href='/contact' onClick={onClose}>
										Get in touch
									</Link>
								</Button>
							</div>
						</div>
					</MotionDiv>
				</MotionDiv>
			) : null}
		</AnimatePresence>
	)
}
