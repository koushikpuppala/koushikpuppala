'use client'

import { Surface } from 'ui/surface'
import { SignalArrow } from 'ui/motion'
import { classNames } from '../../lib/utils'
import { type PortfolioExperience, formatEmploymentType } from '../../lib/experience-data'

export type ExperienceCardProps = {
	experience: PortfolioExperience
	className?: string
}

/**
 * ExperienceCard
 * Timeline milestone component reproducing the Lovable Signal aesthetic:
 * - Active concentric timeline rail marker with pulsing signal dot for current roles
 * - Hairline bordered surface with interactive hover glow
 * - Company and role hierarchy with Bricolage Grotesque typography
 * - Verified period/tenure badge and location metadata
 * - Key impact achievements and system contributions
 * - Monospace technology stack pills
 */
export const ExperienceCard = ({ experience, className }: ExperienceCardProps) => {
	return (
		<div className={classNames('group relative', className)}>
			{/* Timeline Node on Left Rail */}
			{experience.isCurrent ? (
				<div
					className='absolute -left-[34px] sm:-left-[58px] top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-signal/60 bg-background shadow-[0_0_12px_rgba(255,51,102,0.4)]'
					aria-hidden='true'>
					<span className='h-2 w-2 rounded-full bg-signal animate-pulse shadow-[0_0_6px_rgba(255,51,102,0.9)]' />
				</div>
			) : (
				<div
					className='absolute -left-[32px] sm:-left-[56px] top-6 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-border-strong bg-surface-strong transition-all duration-300 group-hover:border-signal group-hover:bg-signal/20 group-hover:scale-110'
					aria-hidden='true'>
					<span className='h-1.5 w-1.5 rounded-full bg-muted-foreground group-hover:bg-signal transition-colors' />
				</div>
			)}

			{/* Milestone Surface Card */}
			<Surface
				variant='bordered'
				className={classNames(
					'p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-border/70 bg-surface/50 backdrop-blur-md transition-all duration-300',
					'hover:border-signal/40 hover:bg-surface/80 hover:shadow-[0_0_30px_rgba(255,51,102,0.1)] hover:-translate-y-0.5',
				)}>
				{/* Top Row: Company Name, Employment Type & Period */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/50'>
					<div className='flex flex-wrap items-center gap-2'>
						<h3 className='font-display text-base sm:text-xl font-semibold text-foreground tracking-tight break-words'>
							{experience.company}
						</h3>
						<span className='inline-flex items-center rounded-full border border-border/80 bg-surface/80 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider'>
							{formatEmploymentType(experience.employmentType)}
						</span>
					</div>

					<div className='font-mono text-[11px] sm:text-xs text-muted-foreground bg-surface/90 px-2.5 py-1 rounded-md border border-border/60 self-start sm:self-auto shrink-0'>
						{experience.periodFormatted}
					</div>
				</div>

				{/* Role & Location Subhead */}
				<div className='pt-3 sm:pt-4 pb-2'>
					<h4 className='font-display text-lg sm:text-2xl font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-signal break-words'>
						{experience.title}
					</h4>

					<div className='flex flex-wrap items-center gap-3 pt-1.5 font-mono text-xs text-muted-foreground'>
						<span>{experience.location}</span>
						{experience.website && (
							<>
								<span className='text-border-strong'>{'//'}</span>
								<a
									href={experience.website}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex items-center gap-1 text-signal hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'
									aria-label={`${experience.company} external website`}>
									<span>Visit Organization</span>
									<SignalArrow size={10} />
								</a>
							</>
						)}
					</div>
				</div>

				{/* Description & Impact Points */}
				<div className='space-y-2 pt-3'>
					{experience.description.map(point => (
						<p
							key={point}
							className='font-sans text-sm sm:text-base text-muted-foreground leading-relaxed'>
							{point}
						</p>
					))}

					{experience.achievements.length > 0 && (
						<ul className='space-y-1.5 pt-2' aria-label='Key Achievements'>
							{experience.achievements.map(ach => (
								<li
									key={ach}
									className='flex items-start gap-2.5 font-sans text-sm text-foreground/90'>
									<span
										className='text-signal font-mono text-xs shrink-0 mt-0.5'
										aria-hidden='true'>
										✦
									</span>
									<span>{ach}</span>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Technology Stack Tags */}
				{experience.technologies.length > 0 && (
					<div className='pt-5 mt-4 border-t border-border/40 flex flex-wrap gap-1.5'>
						{experience.technologies.map(tech => (
							<span
								key={tech}
								className='rounded-md border border-border/60 bg-surface/60 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors group-hover:border-border-strong group-hover:text-foreground'>
								{tech}
							</span>
						))}
					</div>
				)}
			</Surface>
		</div>
	)
}
