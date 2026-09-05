'use client'

import Link from 'next/link'
import { BrandGlyph } from 'ui/brand'
import { classNames } from '../../lib/utils'

export interface HeaderLogoProps {
	className?: string
	isScrolled?: boolean
}

/**
 * HeaderLogo
 * Accessible home link featuring the BrandGlyph with smooth transition between full wordmark and compact treatment.
 */
export const HeaderLogo = ({ className, isScrolled = false }: HeaderLogoProps) => {
	return (
		<Link
			href='/'
			aria-label='Koushik Puppala — home'
			className={classNames(
				'group flex items-center gap-3 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md',
				className,
			)}>
			<div className='relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105'>
				<BrandGlyph size={isScrolled ? 26 : 30} />
			</div>

			<div className='flex flex-col overflow-hidden transition-all duration-300'>
				<span
					className={classNames(
						'font-display font-medium tracking-tight text-foreground whitespace-nowrap transition-all duration-300',
						isScrolled ? 'text-xs md:text-sm' : 'text-sm md:text-base',
					)}>
					KOUSHIK PUPPALA
				</span>
				{!isScrolled && (
					<span className='font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hidden sm:inline-block'>
						ENGINEERING
					</span>
				)}
			</div>
		</Link>
	)
}
