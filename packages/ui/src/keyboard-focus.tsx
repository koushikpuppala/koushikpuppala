'use client'

import { useEffect } from 'react'

export const KeyboardFocus = () => {
	// Marks <html data-keyboard> while Tab is in use and clears it on pointer input, so the
	// focus-ring: variant never draws a ring for clicks.
	useEffect(() => {
		const root = document.documentElement
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Tab') root.dataset.keyboard = ''
		}
		const onPointerDown = () => {
			delete root.dataset.keyboard
		}

		window.addEventListener('keydown', onKeyDown, true)
		window.addEventListener('pointerdown', onPointerDown, true)

		return () => {
			window.removeEventListener('keydown', onKeyDown, true)
			window.removeEventListener('pointerdown', onPointerDown, true)
		}
	}, [])

	return null
}
