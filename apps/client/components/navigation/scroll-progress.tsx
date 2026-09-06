'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'ui/motion'
import { classNames } from '../../lib/utils'

export type ScrollProgressProps = {
	className?: string
}

/**
 * ScrollProgress
 * Thin, high-precision scroll progress bar sitting at the top of the viewport with Signal accent.
 * Uses direct GPU composite scaleX transform for zero React re-renders and zero layout shifts.
 */
export const ScrollProgress = ({ className }: ScrollProgressProps) => {
	const progressRef = useRef<HTMLDivElement>(null)
	const shouldReduceMotion = useReducedMotion()

	useEffect(() => {
		let ticking = false

		const updateProgress = () => {
			const scrollY = window.scrollY
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight
			const current = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0
			if (progressRef.current) {
				progressRef.current.style.transform = `scaleX(${current})`
			}
			ticking = false
		}

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateProgress)
				ticking = true
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		updateProgress()

		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	}, [])

	return (
		<div
			className={classNames(
				'pointer-events-none fixed top-0 inset-x-0 z-50 h-[2px] bg-transparent select-none',
				className,
			)}
			aria-hidden='true'>
			<div
				ref={progressRef}
				className={classNames(
					'h-full w-full bg-gradient-to-r from-signal via-signal to-signal-hover shadow-[0_0_8px_rgba(255,51,102,0.8)] origin-left',
					shouldReduceMotion ? 'transition-none' : 'transition-transform duration-75 ease-out',
				)}
				style={{
					transform: 'scaleX(0)',
				}}
			/>
		</div>
	)
}
