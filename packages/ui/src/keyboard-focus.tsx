'use client'

import { useEffect } from 'react'

// Marks <html data-keyboard> while the user navigates with Tab, and clears it on any pointer
// input. The focus-ring: variant in style.css keys off it so mouse clicks never show a ring.
export const KeyboardFocus = () => {
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
