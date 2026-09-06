'use client'

import { useReducedMotion } from 'ui/motion'

export type BackToTopProps = {
	className?: string
}

export const BackToTop = ({ className }: BackToTopProps) => {
	const shouldReduceMotion = useReducedMotion()

	const scrollToTop = () => {
		if (typeof window !== 'undefined') {
			window.scrollTo({
				top: 0,
				behavior: shouldReduceMotion ? 'auto' : 'smooth',
			})
		}
	}

	return (
		<button
			type='button'
			onClick={scrollToTop}
			aria-label='Scroll to top of page'
			className={`group inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded py-1 px-2 ${
				className || ''
			}`}>
			<span className='uppercase tracking-wider'>BACK TO TOP</span>
			<span
				aria-hidden='true'
				className='transition-transform duration-200 group-hover:-translate-y-0.5 text-signal'>
				↑
			</span>
		</button>
	)
}
