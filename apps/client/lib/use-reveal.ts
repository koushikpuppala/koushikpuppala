'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal plumbing.
 *
 * Elements ship visible in the server HTML. The `js` class added by the head
 * bootstrap script (before first paint) is what arms the hidden state in CSS,
 * so a JS-less or crawler render still sees every word.
 *
 * A single shared IntersectionObserver drives every reveal on the page —
 * one observer instead of one per element keeps long pages cheap.
 */

let sharedObserver: IntersectionObserver | null = null

function reveal(el: Element) {
	;(el as HTMLElement).dataset.revealed = 'true'
}

function getObserver(): IntersectionObserver | null {
	if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null
	if (!sharedObserver) {
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
	}
	return sharedObserver
}

export function useRevealRef<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T | null>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const observer = getObserver()
		if (!observer) {
			reveal(el)
			return
		}

		// Anything already on screen at hydration reveals immediately — no flash,
		// no dependence on an observer callback for above-the-fold content.
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

/** True only after hydration — for pointer/measurement-dependent enhancements. */
export function useHydrated() {
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])
	return hydrated
}

/** Matches a media query reactively; false during SSR. */
export function useMediaQuery(query: string) {
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

/** Fine pointer + motion allowed — the gate for cursor-driven effects. */
export function useInteractiveMotion() {
	const fine = useMediaQuery('(pointer: fine)')
	const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
	return fine && !reduced
}
