'use client'

import type { UserMenuProps } from 'types/components/admin'
import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { LogOut, Settings } from 'components/icons'
import { useOutsideClick } from 'lib/use-shell-effects'

export const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)
	const close = useCallback(() => setOpen(false), [])

	useOutsideClick(ref, open, close)

	return (
		<div className='relative' ref={ref}>
			<button
				type='button'
				onClick={() => setOpen(prev => !prev)}
				aria-expanded={open}
				className='border-border bg-surface text-foreground hover:bg-accent focus-ring:ring-ring focus-ring:ring-2 flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs transition-colors outline-none'>
				<span className='bg-signal grid size-6 place-items-center rounded-full font-mono text-[0.625rem] font-bold text-white'>
					{user?.displayName?.[0] || 'K'}
				</span>
				<span className='hidden max-w-30 truncate font-medium sm:inline'>
					{user?.displayName || 'Koushik'}
				</span>
			</button>

			{open && (
				<div className='border-border bg-surface animate-in fade-in-50 zoom-in-95 absolute right-0 z-50 mt-2 w-48 rounded-xl border p-1.5 font-mono text-xs shadow-xl duration-100'>
					<div className='border-border mb-1 border-b px-2.5 py-2'>
						<p className='text-foreground truncate font-sans font-semibold'>{user?.displayName}</p>
						<p className='text-muted-foreground truncate text-[0.6875rem]'>{user?.email}</p>
					</div>
					<Link
						href='/settings'
						onClick={close}
						className='text-foreground hover:bg-accent flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors'>
						<Settings className='text-muted-foreground size-3.5' />
						<span>Settings</span>
					</Link>
					<button
						type='button'
						onClick={() => {
							close()
							onSignOut()
						}}
						className='text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors'>
						<LogOut className='size-3.5' />
						<span>Sign Out</span>
					</button>
				</div>
			)}
		</div>
	)
}
