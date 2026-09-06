import { Surface } from 'ui/surface'
import { SignalArrow, ScrollReveal } from 'ui/motion'
import type { PortfolioResume } from '../../lib/resume-data'

export type ResumeCardProps = {
	resume: PortfolioResume
	className?: string
}

/**
 * ResumeCard
 * Recreates the Lovable Credentials Console & Authoritative Dossier:
 * - Technical monospaced telemetry bar with live verification status and revision tokens
 * - Executive summary with verified career pillars (Upraised, IIIT Raichur, Distributed Systems)
 * - 4-point specification metrics matrix (Format, Size, Pages, Cryptographic Integrity)
 * - Dual action controls: Primary high-visibility PDF download CTA with SignalArrow micro-interaction
 *   and secondary browser preview trigger
 * - Resilient responsive layout scaling gracefully from mobile viewports to widescreen displays
 */
export const ResumeCard = ({ resume, className }: ResumeCardProps) => {
	return (
		<ScrollReveal delay={0.1} className={className}>
			<Surface
				variant='bordered'
				className='relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/80 bg-surface/60 backdrop-blur-md p-4 sm:p-8 lg:p-10 transition-all duration-300 hover:border-signal/40 hover:shadow-2xl hover:shadow-signal/5'>
				{/* Ambient Signal Glow Texture */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-signal/5 blur-3xl'
				/>

				{/* Top Telemetry Strip */}
				<div className='flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-5 sm:pb-6 border-b border-border/60 text-xs font-mono'>
					<div className='flex items-center gap-2 sm:gap-2.5'>
						<span className='relative flex h-2 w-2 shrink-0'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75' />
							<span className='relative inline-flex rounded-full h-2 w-2 bg-signal' />
						</span>
						<span className='font-semibold uppercase tracking-wider sm:tracking-widest text-signal text-[10px] sm:text-xs break-words'>
							CREDENTIALS CONSOLE {'//'} DOSSIER
						</span>
					</div>

					<div className='flex items-center gap-2'>
						<span className='px-2.5 py-0.5 rounded-md border border-border/80 bg-surface-strong/60 text-muted-foreground font-mono text-[11px]'>
							REV. {resume.revisionYear}
						</span>
						<span className='hidden sm:inline-block px-2.5 py-0.5 rounded-md border border-signal/30 bg-signal/10 text-signal font-mono text-[11px] font-medium'>
							VERIFIED ARTIFACT
						</span>
					</div>
				</div>

				{/* Main Dossier Content & Action Console */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-6 sm:pt-8'>
					{/* Left Column: Dossier Overview & Highlights (8 cols) */}
					<div className='lg:col-span-7 xl:col-span-8 space-y-6'>
						<div>
							<span className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
								{resume.headline}
							</span>
							<h3 className='mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight text-foreground'>
								{resume.title}
							</h3>
							<p className='mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl'>
								{resume.summary}
							</p>
						</div>

						{/* Highlights Grid: 4 Core Pillars */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
							{resume.highlights.map(item => (
								<div
									key={item.number}
									className='p-4 rounded-xl border border-border/60 bg-surface-strong/30 space-y-1.5 transition-all duration-200 hover:border-signal/40 hover:bg-surface-strong/60 hover:-translate-y-0.5'>
									<div className='flex items-center gap-2'>
										<span className='font-mono text-xs font-semibold text-signal'>
											{item.number}
										</span>
										<span className='font-mono text-xs uppercase tracking-wider text-foreground font-medium'>
											{item.title}
										</span>
									</div>
									<p className='text-xs text-muted-foreground leading-relaxed'>
										{item.description}
									</p>
								</div>
							))}
						</div>

						{/* Competencies Ribbon */}
						<div className='space-y-2 pt-2'>
							<span className='font-mono text-[11px] uppercase tracking-wider text-muted-foreground'>
								VERIFIED TECHNICAL COMPETENCIES
							</span>
							<div className='flex flex-wrap gap-2'>
								{resume.competencies.map(comp => (
									<span
										key={comp}
										className='px-2.5 py-1 rounded-md border border-border/70 bg-surface text-foreground font-mono text-xs'>
										{comp}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Right Column: Telemetry Specs & Download Action Panel (5/4 cols) */}
					<div className='lg:col-span-5 xl:col-span-4 flex flex-col justify-between h-full'>
						<div className='p-6 rounded-xl border border-border/80 bg-surface-strong/40 space-y-6'>
							{/* Document Specifications Grid */}
							<div className='space-y-3'>
								<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
									SPECIFICATION TELEMETRY
								</span>

								<div className='grid grid-cols-2 gap-3 pt-1'>
									{resume.stats.map(st => (
										<div
											key={st.label}
											className='p-3 rounded-lg border border-border/50 bg-surface/50 space-y-1'>
											<div className='font-mono text-[10px] uppercase tracking-wider text-muted-foreground'>
												{st.label}
											</div>
											<div className='font-mono text-xs font-semibold text-foreground'>
												{st.value}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Document Integrity Notice */}
							<div className='flex items-start gap-2.5 p-3 rounded-lg border border-border/40 bg-surface/30 text-xs text-muted-foreground'>
								<svg
									className='w-4 h-4 text-signal shrink-0 mt-0.5'
									aria-hidden='true'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
								</svg>
								<span className='text-[11px] leading-relaxed'>
									Authentic document compiled from production repository assets. Direct PDF stream
									with zero tracking or redirection.
								</span>
							</div>

							{/* Action Controls */}
							<div className='space-y-3 pt-2'>
								{/* Primary Download CTA */}
								<a
									href={resume.downloadUrl}
									download='Koushik_Puppala_Resume.pdf'
									className='group relative flex w-full items-center justify-center gap-2 px-4 sm:px-6 py-3.5 rounded-xl bg-signal text-signal-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-95 active:scale-[0.98] shadow-lg shadow-signal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
									<svg
										className='w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5'
										aria-hidden='true'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'>
										<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
										<polyline points='7 10 12 15 17 10' />
										<line x1='12' y1='15' x2='12' y2='3' />
									</svg>
									<span>DOWNLOAD RESUME</span>
									<span className='opacity-80 text-[11px] font-normal'>
										({resume.fileSizeFormatted})
									</span>
									<SignalArrow
										size={13}
										className='ml-0.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
									/>
								</a>

								{/* Secondary Preview Link */}
								<a
									href={resume.previewUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='group flex w-full items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl border border-border/80 bg-surface hover:bg-surface-strong hover:text-foreground text-muted-foreground font-mono text-xs font-medium uppercase tracking-wider transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal'>
									<svg
										className='w-3.5 h-3.5'
										aria-hidden='true'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'>
										<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
										<polyline points='15 3 21 3 21 9' />
										<line x1='10' y1='14' x2='21' y2='3' />
									</svg>
									<span>PREVIEW IN BROWSER</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</Surface>
		</ScrollReveal>
	)
}
