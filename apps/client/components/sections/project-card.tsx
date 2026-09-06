'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MicroGrid } from 'ui/background'
import { SignalArrow } from 'ui/motion'
import { classNames } from '../../lib/utils'
import type { PortfolioProject } from '../../lib/projects-data'

export type ProjectCardProps = {
	project: PortfolioProject
	className?: string
}

/**
 * ProjectCard
 * Recreates the Lovable Selected Work showcase card:
 * - High-definition visual area (Image or Lovable technical generative mesh canvas)
 * - Category badge and system status indicator
 * - Bricolage Grotesque display title with pink hover glow
 * - Narrative system description
 * - Stack tags
 * - Case study action with dynamic micro-interaction SignalArrow
 */
export const ProjectCard = ({ project, className }: ProjectCardProps) => {
	return (
		<article
			className={classNames(
				'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-surface/50 backdrop-blur-md transition-all duration-300',
				'hover:border-signal/50 hover:bg-surface/80 hover:shadow-[0_0_30px_rgba(255,51,102,0.12)] hover:-translate-y-1',
				className,
			)}>
			<div>
				{/* Visual Canvas Area */}
				<div className='relative aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden border-b border-border/60 bg-surface-strong/40'>
					{project.imageUrl ? (
						<>
							<Image
								src={project.imageUrl}
								alt={project.title}
								fill
								sizes='(max-width: 768px) 100vw, 50vw'
								className='object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105'
							/>
							{/* Ambient Contrast Gradient Overlay */}
							<div
								className='pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40'
								aria-hidden='true'
							/>
						</>
					) : (
						/* Lovable Technical Generative Canvas Treatment (When no photo exists) */
						<div className='relative flex h-full w-full items-center justify-center p-6 select-none'>
							{/* Fine Texture Mesh */}
							<MicroGrid opacity={0.35} className='pointer-events-none' />

							{/* Radial Ambient Signal Light */}
							<div
								className='pointer-events-none absolute -inset-8 rounded-full bg-radial from-signal/15 via-transparent to-transparent blur-xl opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-75'
								aria-hidden='true'
							/>

							{/* Technical Telemetry Watermark */}
							<div className='relative z-10 flex flex-col items-center justify-center gap-1.5 text-center'>
								<span className='font-mono text-[10px] tracking-[0.2em] text-signal uppercase font-semibold'>
									SYSTEM ARCHITECTURE
								</span>
								<span className='font-display text-xl sm:text-2xl font-medium text-foreground tracking-tight'>
									{project.title}
								</span>
								<span className='font-mono text-[9px] text-muted-foreground tracking-wider uppercase'>
									SPEC {'//'} {project.slug}
								</span>
							</div>
						</div>
					)}

					{/* Top Left: Category Badge */}
					<div className='absolute left-3.5 top-3.5 z-10'>
						<div className='inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/90 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-md'>
							<span
								className='h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_rgba(255,51,102,0.8)]'
								aria-hidden='true'
							/>
							<span className='tracking-wider font-semibold uppercase'>{project.category}</span>
						</div>
					</div>

					{/* Top Right: Status Pill */}
					<div className='absolute right-3.5 top-3.5 z-10'>
						<div className='inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/90 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-md'>
							<span
								className={classNames(
									'h-1.5 w-1.5 rounded-full',
									project.status === 'COMPLETED'
										? 'bg-status-live shadow-[0_0_6px_rgba(16,185,129,0.8)]'
										: 'bg-signal animate-pulse shadow-[0_0_6px_rgba(255,51,102,0.8)]',
								)}
								aria-hidden='true'
							/>
							<span className='tracking-wider font-medium'>
								{project.status === 'COMPLETED' ? 'SYS.LIVE' : 'ACTIVE_DEV'}
							</span>
						</div>
					</div>
				</div>

				{/* Metadata Header: Project Type & Year */}
				<div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1 font-mono text-xs text-muted-foreground'>
					<span className='uppercase tracking-wider'>{project.projectType}</span>
					<span>
						{'//'} {project.year}
					</span>
				</div>

				{/* Title with Link Anchor */}
				<div className='px-4 sm:px-6 pt-1'>
					<h3 className='font-display text-xl sm:text-2xl font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-signal break-words'>
						<Link
							href={`/projects/${project.slug}`}
							className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded'>
							<span className='absolute inset-0' aria-hidden='true' />
							{project.title}
						</Link>
					</h3>

					{/* Short Narrative Description */}
					<p className='mt-2.5 line-clamp-2 font-sans text-sm text-muted-foreground leading-relaxed'>
						{project.shortDescription}
					</p>
				</div>

				{/* Technology Stack Pills */}
				<div className='flex flex-wrap gap-1.5 px-4 sm:px-6 pt-4 pb-2'>
					{project.tags.slice(0, 5).map(tag => (
						<span
							key={tag}
							className='rounded-md border border-border/70 bg-surface/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors group-hover:border-border-strong group-hover:text-foreground break-words'>
							{tag}
						</span>
					))}
				</div>
			</div>

			{/* Card Footer: Metadata & Action CTA */}
			<div className='relative z-20 flex items-center justify-between border-t border-border/50 px-4 sm:px-6 py-3 sm:py-3.5 mt-5 bg-surface/30 backdrop-blur-sm'>
				{/* Secondary External Links */}
				<div className='flex items-center gap-3 font-mono text-xs text-muted-foreground'>
					{project.github && (
						<a
							href={project.github}
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded px-1'
							aria-label={`${project.title} GitHub repository`}>
							Source
						</a>
					)}
					{project.liveUrl && (
						<>
							<span className='text-border-strong'>{'//'}</span>
							<a
								href={project.liveUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded px-1'
								aria-label={`${project.title} Live system`}>
								Live
							</a>
						</>
					)}
				</div>

				{/* Primary Case Study CTA Link */}
				<Link
					href={`/projects/${project.slug}`}
					className='inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors group-hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded px-1'>
					<span className='font-medium'>View Project</span>
					<SignalArrow
						size={12}
						className='transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5'
					/>
				</Link>
			</div>
		</article>
	)
}
