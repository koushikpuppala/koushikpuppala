'use client'

import { useEffect, useRef, useState } from 'react'

// One observer shared by every revealed element instead of one per component.
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

		// Without IntersectionObserver, show content immediately rather than leave it hidden.
		if (!observer) {
			reveal(el)
			return
		}

		const rect = el.getBoundingClientRect()

		// Elements already on screen at mount are revealed at once, avoiding a flash on load.
		if (rect.top < window.innerHeight && rect.bottom > 0) {
			reveal(el)
			return
		}

		observer.observe(el)

		return () => observer.unobserve(el)
	}, [])

	return ref
}

const useMediaQuery = (query: string) => {
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

// Pointer-driven effects only run for a mouse or trackpad, and never with reduced motion enabled.
export const useInteractiveMotion = () => {
	const fine = useMediaQuery('(pointer: fine)')

	const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

	return fine && !reduced
}
