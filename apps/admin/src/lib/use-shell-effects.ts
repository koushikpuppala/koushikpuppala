'use client'

import type { RefObject } from 'react'
import type { SessionUser } from 'types/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useCommandShortcut = (toggle: () => void) => {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return

			event.preventDefault()
			toggle()
		}

		window.addEventListener('keydown', onKeyDown)

		return () => window.removeEventListener('keydown', onKeyDown)
	}, [toggle])
}

export const useOutsideClick = (
	ref: RefObject<HTMLElement | null>,
	active: boolean,
	onOutside: () => void,
) => {
	useEffect(() => {
		if (!active) return

		const onMouseDown = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) onOutside()
		}

		document.addEventListener('mousedown', onMouseDown)

		return () => document.removeEventListener('mousedown', onMouseDown)
	}, [ref, active, onOutside])
}

export const useAuthRedirect = (user: SessionUser | null, loading: boolean, pathname: string) => {
	const router = useRouter()

	useEffect(() => {
		if (loading) return

		if (!user && pathname !== '/login') router.replace('/login')
		else if (user && pathname === '/login') router.replace('/')
	}, [user, loading, pathname, router])
}
