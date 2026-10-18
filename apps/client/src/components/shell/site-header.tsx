'use client'

import type { SiteHeaderProps } from 'types/components/client'
import Link from 'next/link'
import { ArrowUpRight, CommandIcon } from 'components/icons'
import { Button } from 'ui/button'
import { classNames } from 'utils/classNames'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { ScrollProgress } from 'components/primitives/motion'
import { ThemeToggle } from 'components/theme-toggle'
import { navItems } from './navigation'
import { WordMark } from './word-mark'
import { useScrolled } from './use-scrolled'

export const SiteHeader = ({ onOpenMenu, onOpenPalette }: SiteHeaderProps) => {
	const scrolled = useScrolled()
	const pathname = usePathname()

	return (
		<header className='fixed inset-x-0 top-0 z-50'>
			<ScrollProgress
				className={classNames('absolute inset-x-0 top-0 transition-opacity duration-500', {
					'opacity-0': !scrolled,
					'opacity-100': scrolled,
				})}
			/>
			<div
				className={classNames(
					'container-page transition-[padding] duration-500 ease-(--ease-out-expo)',
					{ 'pt-0': !scrolled, 'pt-2.5': scrolled },
				)}>
				<div
					className={classNames(
						'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border transition-[height,background-color,border-color,border-radius,padding,box-shadow] duration-500 ease-(--ease-out-expo)',
						{
							'h-20 rounded-none border-transparent px-0': !scrolled,
							'border-border bg-background/72 h-15 rounded-2xl px-3 shadow-(--shadow-lift) backdrop-blur-xl backdrop-saturate-150 sm:px-4':
								scrolled,
						},
					)}>
					<div className='flex min-w-0 items-center gap-6 xl:gap-8'>
						<WordMark compact={scrolled} />
						<nav aria-label='Primary' className='hidden items-center gap-0.5 lg:flex'>
							{navItems.map(item => {
								const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
								return (
									<Link
										key={item.href}
										href={item.href}
										className={classNames(
											'relative rounded-full px-3 py-2 text-[0.8125rem] transition-colors duration-300',
											{
												'text-muted-foreground hover:text-foreground': !active,
												'text-foreground': active,
											},
										)}>
										{active ? (
											<motion.span
												layoutId='nav-active'
												className='bg-accent absolute inset-0 -z-10 rounded-full'
												transition={{ type: 'spring', stiffness: 400, damping: 34 }}
											/>
										) : null}
										{item.label}
									</Link>
								)
							})}
						</nav>
					</div>

					<div className='flex items-center gap-1.5'>
						<button
							type='button'
							onClick={onOpenPalette}
							className='border-border bg-surface/60 text-muted-foreground hover:border-border-strong hover:text-foreground hidden items-center gap-2 rounded-lg border py-1.5 pr-2 pl-3 text-xs transition-colors xl:flex'>
							<span>Jump to…</span>
							<span className='sr-only'> a page (quick navigation)</span>
							<kbd
								aria-hidden
								className='border-border bg-background flex items-center gap-0.5 rounded border px-1.5 py-0.5 font-mono text-[0.625rem]'>
								<CommandIcon className='size-2.5' />K
							</kbd>
						</button>
						<ThemeToggle />
						<Button asChild size='sm' variant='signal' className='group hidden sm:inline-flex'>
							<Link href='/resume'>
								Resume
								<ArrowUpRight className='arrow-slide size-3.5' />
							</Link>
						</Button>
						<button
							type='button'
							onClick={onOpenMenu}
							aria-label='Open navigation menu'
							className='group text-foreground hover:bg-accent grid size-9 place-items-center rounded-lg transition-colors lg:hidden'>
							<span className='flex w-4.5 flex-col gap-1.25'>
								<span className='h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-0.5' />
								<span className='h-px w-full bg-current' />
								<span className='h-px w-2/3 bg-current transition-all duration-300 group-hover:w-full' />
							</span>
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}
