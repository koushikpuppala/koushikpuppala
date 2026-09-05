'use client'

import Link from 'next/link'
import { SignalArrow } from 'ui/motion'
import { classNames } from '../../lib/utils'

export interface ResumeCtaProps {
	className?: string
	compact?: boolean
}

/**
 * ResumeCta
 * Prominent Resume CTA button styled with the Signal accent and directional micro-interaction arrow.
 */
export const ResumeCta = ({ className, compact = false }: ResumeCtaProps) => {
	return (
		<Link
			href='/resume'
			className={classNames(
				'group relative inline-flex items-center justify-center rounded-full font-mono font-medium transition-all duration-200',
				'border border-signal/40 bg-signal-soft text-signal',
				'hover:border-signal hover:bg-signal hover:text-white hover:shadow-[0_0_16px_rgba(255,51,102,0.35)]',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				compact ? 'px-3 py-1.5 text-xs gap-1.5' : 'px-4 py-2 text-xs sm:text-sm gap-2',
				className,
			)}>
			<span>Resume</span>
			<SignalArrow
				size={12}
				className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white'
			/>
		</Link>
	)
}
