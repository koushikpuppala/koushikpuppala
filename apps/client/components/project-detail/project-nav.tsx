import Link from 'next/link'
import { Surface } from 'ui/surface'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import type { PortfolioProject } from '../../lib/projects-data'

export type ProjectNavProps = {
	prev: PortfolioProject | null
	next: PortfolioProject | null
	className?: string
}

export const ProjectNav = ({ prev, next, className }: ProjectNavProps) => {
	if (!prev && !next) return null

	return (
		<ScrollReveal
			delay={0.1}
			className={`pt-12 sm:pt-16 border-t border-border/80 space-y-8 ${className || ''}`}>
			<div className='flex items-center justify-between font-mono text-xs text-muted-foreground'>
				<span className='uppercase tracking-widest text-signal font-semibold'>
					SPECIFICATION NAVIGATION
				</span>
				<Link
					href='/#projects'
					className='hover:text-signal transition-colors uppercase tracking-wider'>
					INDEX {'//'} ALL WORK
				</Link>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Previous Project Tile */}
				{prev ? (
					<Link
						href={`/projects/${prev.slug}`}
						className='group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded-xl sm:rounded-2xl'>
						<Surface
							variant='bordered'
							className='h-full p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-border/70 bg-surface/50 hover:border-signal/50 hover:bg-surface/80 hover:-translate-y-1 transition-all duration-300 space-y-3'>
							<div className='flex items-center gap-2 font-mono text-xs text-muted-foreground group-hover:text-signal transition-colors'>
								<span
									aria-hidden='true'
									className='transition-transform duration-200 group-hover:-translate-x-1 text-signal'>
									←
								</span>
								<span className='uppercase tracking-wider'>PREVIOUS SPECIFICATION</span>
							</div>

							<div className='space-y-1'>
								<h4 className='font-display text-lg sm:text-2xl font-semibold tracking-tight text-foreground group-hover:text-signal transition-colors break-words'>
									{prev.title}
								</h4>
								<p className='font-mono text-xs text-muted-foreground'>
									{prev.category} • {prev.projectType}
								</p>
							</div>
						</Surface>
					</Link>
				) : (
					<div />
				)}

				{/* Next Project Tile */}
				{next ? (
					<Link
						href={`/projects/${next.slug}`}
						className='group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded-xl sm:rounded-2xl'>
						<Surface
							variant='bordered'
							className='h-full p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-border/70 bg-surface/50 hover:border-signal/50 hover:bg-surface/80 hover:-translate-y-1 transition-all duration-300 space-y-3 text-left md:text-right'>
							<div className='flex items-center justify-start md:justify-end gap-2 font-mono text-xs text-muted-foreground group-hover:text-signal transition-colors'>
								<span className='uppercase tracking-wider'>NEXT SPECIFICATION</span>
								<span
									aria-hidden='true'
									className='transition-transform duration-200 group-hover:translate-x-1 text-signal'>
									→
								</span>
							</div>

							<div className='space-y-1'>
								<h4 className='font-display text-lg sm:text-2xl font-semibold tracking-tight text-foreground group-hover:text-signal transition-colors break-words'>
									{next.title}
								</h4>
								<p className='font-mono text-xs text-muted-foreground'>
									{next.category} • {next.projectType}
								</p>
							</div>
						</Surface>
					</Link>
				) : (
					<div />
				)}
			</div>

			{/* Center Return to All Projects CTA */}
			<div className='flex justify-center pt-4'>
				<Link
					href='/#projects'
					className='group inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/80 bg-surface hover:bg-surface-strong hover:text-foreground text-muted-foreground font-mono text-xs font-medium uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal'>
					<span aria-hidden='true'>←</span>
					<span>RETURN TO ALL WORK</span>
					<SignalArrow size={12} />
				</Link>
			</div>
		</ScrollReveal>
	)
}
