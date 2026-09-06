import Link from 'next/link'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import type { PortfolioProject } from '../../lib/projects-data'

export type ProjectHeroProps = {
	project: PortfolioProject
	className?: string
}

export const ProjectHero = ({ project, className }: ProjectHeroProps) => {
	return (
		<header className={`space-y-6 sm:space-y-8 ${className || ''}`}>
			{/* Top Navigation & Status Bar */}
			<div className='flex flex-wrap items-center justify-between gap-4 font-mono text-xs'>
				{/* Return Link */}
				<Link
					href='/#projects'
					className='group inline-flex items-center gap-2 text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded py-1'>
					<span
						aria-hidden='true'
						className='transition-transform duration-200 group-hover:-translate-x-1 text-signal'>
						←
					</span>
					<span className='uppercase tracking-wider'>BACK TO SELECTED WORK</span>
				</Link>

				{/* Category & Status Badges */}
				<div className='flex items-center gap-2.5'>
					<div className='inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/80 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur-md'>
						<span
							className='h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_rgba(255,51,102,0.8)]'
							aria-hidden='true'
						/>
						<span className='tracking-wider font-semibold uppercase text-foreground'>
							{project.category}
						</span>
					</div>

					<div className='inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/80 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur-md'>
						<span
							className={`h-1.5 w-1.5 rounded-full ${
								project.status === 'COMPLETED'
									? 'bg-status-live shadow-[0_0_6px_rgba(16,185,129,0.8)]'
									: 'bg-signal animate-pulse shadow-[0_0_6px_rgba(255,51,102,0.8)]'
							}`}
							aria-hidden='true'
						/>
						<span className='tracking-wider font-medium'>
							{project.status === 'COMPLETED' ? 'SYS.LIVE' : 'ACTIVE_DEV'}
						</span>
					</div>
				</div>
			</div>

			{/* Main Title & Subtitle */}
			<ScrollReveal delay={0.1} className='space-y-3'>
				<span className='font-mono text-xs sm:text-sm uppercase tracking-widest text-signal font-semibold'>
					SPECIFICATION {'//'} {project.slug}
				</span>

				<h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.15] break-words'>
					{project.title}
				</h1>

				{project.subtitle && (
					<p className='font-mono text-xs sm:text-base text-muted-foreground font-medium max-w-2xl break-words'>
						{project.subtitle}
					</p>
				)}
			</ScrollReveal>

			{/* Short Summary Description */}
			<p className='text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-3xl'>
				{project.shortDescription}
			</p>

			{/* Structured Metadata Telemetry Grid */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border/80 bg-surface/50 backdrop-blur-sm'>
				<div className='space-y-1 font-mono text-xs'>
					<span className='text-muted-foreground/70 uppercase tracking-wider text-[10px] block'>
						ROLE
					</span>
					<span className='text-foreground font-medium truncate block'>
						{project.role || 'Lead Engineer'}
					</span>
				</div>

				<div className='space-y-1 font-mono text-xs'>
					<span className='text-muted-foreground/70 uppercase tracking-wider text-[10px] block'>
						YEAR / TIMELINE
					</span>
					<span className='text-foreground font-medium block'>{project.year}</span>
				</div>

				<div className='space-y-1 font-mono text-xs'>
					<span className='text-muted-foreground/70 uppercase tracking-wider text-[10px] block'>
						CLASSIFICATION
					</span>
					<span className='text-foreground font-medium truncate block'>{project.projectType}</span>
				</div>

				<div className='space-y-1 font-mono text-xs'>
					<span className='text-muted-foreground/70 uppercase tracking-wider text-[10px] block'>
						DEPLOYMENT
					</span>
					<span className='text-signal font-medium block truncate'>
						{project.status === 'COMPLETED' ? 'Production Deployed' : 'Active Engineering'}
					</span>
				</div>
			</div>

			{/* External Action Controls (Live & GitHub) */}
			{(project.liveUrl || project.github) && (
				<div className='flex flex-wrap items-center gap-3 pt-2'>
					{project.liveUrl && (
						<a
							href={project.liveUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-signal text-signal-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-95 active:scale-[0.98] shadow-lg shadow-signal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
							<span>VISIT LIVE PLATFORM</span>
							<SignalArrow
								size={13}
								className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
							/>
						</a>
					)}

					{project.github && (
						<a
							href={project.github}
							target='_blank'
							rel='noopener noreferrer'
							className='group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-border/80 bg-surface hover:bg-surface-strong hover:text-foreground text-muted-foreground font-mono text-xs font-medium uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal'>
							<svg
								className='h-4 w-4'
								aria-hidden='true'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
								<path d='M9 18c-4.51 2-5-2-7-2' />
							</svg>
							<span>SOURCE CODE REPOSITORY</span>
							<SignalArrow
								size={12}
								className='transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
							/>
						</a>
					)}
				</div>
			)}
		</header>
	)
}
