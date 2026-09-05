import Image from 'next/image'
import { Surface } from 'ui/surface'
import { ScrollReveal } from 'ui/motion'
import type { PortfolioProject } from '../../lib/projects-data'

export interface CaseStudyBodyProps {
	project: PortfolioProject
	className?: string
}

export const CaseStudyBody = ({ project, className }: CaseStudyBodyProps) => {
	const hasDescriptions = project.descriptions && project.descriptions.length > 0
	const hasMetrics = project.metrics && Object.keys(project.metrics).length > 0
	const hasCaseStudy = Boolean(project.caseStudy)
	const hasTech =
		(project.technologies && project.technologies.length > 0) ||
		(project.tags && project.tags.length > 0)
	const hasGallery = project.gallery && project.gallery.length > 0

	return (
		<div className={`space-y-12 sm:space-y-16 ${className || ''}`}>
			{/* Section 01: Overview & System Context */}
			{hasDescriptions && (
				<ScrollReveal delay={0.1}>
					<Surface
						variant='bordered'
						className='p-4 sm:p-10 rounded-xl sm:rounded-2xl border border-border/80 bg-surface/50 backdrop-blur-sm space-y-6'>
						<div className='space-y-1.5'>
							<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
								01 {'//'} OVERVIEW &amp; SYSTEM CONTEXT
							</span>
							<h3 className='text-xl sm:text-3xl font-display font-semibold tracking-tight text-foreground break-words'>
								Core Capabilities &amp; Architecture
							</h3>
						</div>

						<div className='space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed'>
							{project.descriptions.map(desc => (
								<p key={desc.slice(0, 32)}>{desc}</p>
							))}
						</div>
					</Surface>
				</ScrollReveal>
			)}

			{/* Section 02: Telemetry & Performance Benchmarks */}
			{hasMetrics && (
				<ScrollReveal delay={0.1}>
					<div className='space-y-6'>
						<div className='space-y-1.5'>
							<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
								02 {'//'} TELEMETRY &amp; BENCHMARKS
							</span>
							<h3 className='text-xl sm:text-3xl font-display font-semibold tracking-tight text-foreground break-words'>
								Empirical Performance &amp; Metrics
							</h3>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{Object.entries(project.metrics || {}).map(([key, val]) => (
								<Surface
									key={key}
									variant='bordered'
									className='p-4 sm:p-6 rounded-xl border border-border/70 bg-surface-strong/30 space-y-2 hover:border-signal/40 transition-colors'>
									<div className='font-mono text-[11px] uppercase tracking-wider text-signal font-semibold'>
										{key}
									</div>
									<div className='text-2xl sm:text-3xl font-display font-semibold tracking-tight text-foreground'>
										{val}
									</div>
								</Surface>
							))}
						</div>
					</div>
				</ScrollReveal>
			)}

			{/* Section 03: Architectural Case Study */}
			{hasCaseStudy && (
				<ScrollReveal delay={0.1}>
					<Surface
						variant='bordered'
						className='p-4 sm:p-10 rounded-xl sm:rounded-2xl border border-border/80 bg-surface/50 backdrop-blur-sm space-y-6'>
						<div className='space-y-1.5'>
							<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
								03 {'//'} ARCHITECTURAL CASE STUDY
							</span>
							<h3 className='text-xl sm:text-3xl font-display font-semibold tracking-tight text-foreground break-words'>
								Implementation &amp; Technical Approach
							</h3>
						</div>

						<div className='p-4 sm:p-6 rounded-xl border-l-2 border-l-signal border border-border/60 bg-surface-strong/30 text-base sm:text-lg text-muted-foreground leading-relaxed'>
							{project.caseStudy}
						</div>
					</Surface>
				</ScrollReveal>
			)}

			{/* Section 04: Technology Matrix */}
			{hasTech && (
				<ScrollReveal delay={0.1}>
					<Surface
						variant='bordered'
						className='p-4 sm:p-10 rounded-xl sm:rounded-2xl border border-border/80 bg-surface/50 backdrop-blur-sm space-y-8'>
						<div className='space-y-1.5'>
							<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
								04 {'//'} TECHNOLOGY MATRIX
							</span>
							<h3 className='text-xl sm:text-3xl font-display font-semibold tracking-tight text-foreground break-words'>
								Runtimes, Frameworks &amp; Protocols
							</h3>
						</div>

						{/* Technologies */}
						{project.technologies && project.technologies.length > 0 && (
							<div className='space-y-3'>
								<span className='font-mono text-xs uppercase tracking-wider text-muted-foreground block'>
									PRIMARY TECHNOLOGIES
								</span>
								<div className='flex flex-wrap gap-2'>
									{project.technologies.map(tech => (
										<span
											key={tech}
											className='px-3.5 py-1.5 rounded-lg border border-border/80 bg-surface font-mono text-xs sm:text-sm text-foreground hover:border-signal/50 hover:text-signal transition-colors'>
											{tech}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Tags */}
						{project.tags && project.tags.length > 0 && (
							<div className='space-y-3 pt-2 border-t border-border/60'>
								<span className='font-mono text-xs uppercase tracking-wider text-muted-foreground block'>
									ARCHITECTURE &amp; PROTOCOL DOMAINS
								</span>
								<div className='flex flex-wrap gap-2'>
									{project.tags.map(tag => (
										<span
											key={tag}
											className='px-3 py-1 rounded-md border border-border/60 bg-surface-strong/40 font-mono text-xs text-muted-foreground'>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}
					</Surface>
				</ScrollReveal>
			)}

			{/* Section 05: Project Gallery (when present) */}
			{hasGallery && (
				<ScrollReveal delay={0.1}>
					<div className='space-y-6'>
						<div className='space-y-1.5'>
							<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
								05 {'//'} SYSTEM ARTIFACTS
							</span>
							<h3 className='text-xl sm:text-3xl font-display font-semibold tracking-tight text-foreground break-words'>
								Visual Schematics &amp; Interface Gallery
							</h3>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{project.gallery?.map(item => (
								<div
									key={item.id || item.url}
									className='group overflow-hidden rounded-xl border border-border/80 bg-surface-strong/30 space-y-3'>
									<div className='relative aspect-[16/10] w-full overflow-hidden bg-surface'>
										<Image
											src={item.url}
											alt={item.altText || item.title || project.title}
											fill
											sizes='(max-width: 768px) 100vw, 50vw'
											className='object-cover transition-transform duration-300 group-hover:scale-105'
										/>
									</div>
									{(item.title || item.caption) && (
										<div className='p-4 pt-1'>
											{item.title && (
												<div className='font-mono text-xs font-semibold text-foreground'>
													{item.title}
												</div>
											)}
											{item.caption && (
												<div className='font-sans text-xs text-muted-foreground mt-0.5'>
													{item.caption}
												</div>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</ScrollReveal>
			)}
		</div>
	)
}
