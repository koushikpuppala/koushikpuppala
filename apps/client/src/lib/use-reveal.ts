'use client'

import { useEffect, useRef, useState } from 'react'

let sharedObserver: IntersectionObserver | null = null

const reveal = (el: Element) => {
	;(el as HTMLElement).dataset.revealed = 'true'
}

const getObserver = (): IntersectionObserver | null => {
	if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null

	if (!sharedObserver)
		sharedObserver = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue

					reveal(entry.target)

					sharedObserver?.unobserve(entry.target)
				}
			},
			{ rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
		)

	return sharedObserver
}

export const useRevealRef = <T extends HTMLElement = HTMLDivElement>() => {
	const ref = useRef<T | null>(null)

	useEffect(() => {
		const el = ref.current

		if (!el) return

		const observer = getObserver()

		if (!observer) {
			reveal(el)
			return
		}

		const rect = el.getBoundingClientRect()

		if (rect.top < window.innerHeight && rect.bottom > 0) {
			reveal(el)
			return
		}

		observer.observe(el)

		return () => observer.unobserve(el)
	}, [])

	return ref
}

export const useHydrated = () => {
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => setHydrated(true), [])

	return hydrated
}

export const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const mql = window.matchMedia(query)

		const update = () => setMatches(mql.matches)

		update()

		mql.addEventListener('change', update)

		return () => mql.removeEventListener('change', update)
	}, [query])

	return matches
}

export const useInteractiveMotion = () => {
	const fine = useMediaQuery('(pointer: fine)')

	const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

	return fine && !reduced
}
