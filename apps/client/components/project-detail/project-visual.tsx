import Image from 'next/image'
import { MicroGrid } from 'ui/background'
import { ScrollReveal } from 'ui/motion'
import type { PortfolioProject } from '../../lib/projects-data'

export interface ProjectVisualProps {
	project: PortfolioProject
	className?: string
}

export const ProjectVisual = ({ project, className }: ProjectVisualProps) => {
	const displayImage = project.heroImageUrl || project.imageUrl

	return (
		<ScrollReveal delay={0.15} className={`w-full ${className || ''}`}>
			<div className='relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/80 bg-surface-strong/30 shadow-2xl'>
				{displayImage ? (
					<>
						<Image
							src={displayImage}
							alt={project.title}
							fill
							priority
							sizes='(max-width: 1024px) 100vw, 1200px'
							className='object-cover object-top'
						/>
						{/* Ambient Contrast Gradient Overlay */}
						<div
							className='pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent opacity-70'
							aria-hidden='true'
						/>
					</>
				) : (
					/* Lovable Technical Generative Canvas Treatment */
					<div className='relative flex h-full w-full items-center justify-center p-8 select-none overflow-hidden'>
						{/* Micro-grid mesh */}
						<MicroGrid opacity={0.4} className='pointer-events-none' />

						{/* Radial Ambient Signal Light */}
						<div
							className='pointer-events-none absolute -inset-10 rounded-full bg-radial from-signal/20 via-transparent to-transparent blur-2xl opacity-60'
							aria-hidden='true'
						/>

						{/* Technical Telemetry Watermark */}
						<div className='relative z-10 flex flex-col items-center justify-center gap-2 text-center p-4'>
							<span className='font-mono text-xs tracking-[0.25em] text-signal uppercase font-semibold'>
								SYSTEM ARCHITECTURE SCHEMATIC
							</span>
							<h2 className='font-display text-2xl sm:text-4xl font-semibold text-foreground tracking-tight'>
								{project.title}
							</h2>
							<span className='font-mono text-xs text-muted-foreground tracking-wider uppercase'>
								SPEC {'//'} {project.slug}
							</span>
						</div>
					</div>
				)}

				{/* Corner Technical Telemetry Pips */}
				<div className='absolute left-4 top-4 z-10 hidden sm:inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-border/60'>
					<span className='h-1.5 w-1.5 rounded-full bg-signal' aria-hidden='true' />
					<span>
						CANVAS {'//'} {project.slug}
					</span>
				</div>

				<div className='absolute right-4 top-4 z-10 hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-border/60'>
					<span>ARCHITECTURE: PROD</span>
				</div>
			</div>
		</ScrollReveal>
	)
}
