'use client'

import { useEffect, useState } from 'react'

export const useScrolled = (threshold = 12) => {
	const [scrolled, setScrolled] = useState(false)
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > threshold)

		onScroll()

		window.addEventListener('scroll', onScroll, { passive: true })

		return () => window.removeEventListener('scroll', onScroll)
	}, [threshold])

	return scrolled
}
