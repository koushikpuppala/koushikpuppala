'use client'

import { Surface } from 'ui/surface'
import { SignalArrow } from 'ui/motion'
import { classNames } from '../../lib/utils'
import type { PortfolioEducation } from '../../lib/education-data'

export type EducationCardProps = {
	education: PortfolioEducation
	className?: string
}

/**
 * EducationCard
 * Academic credential card reproducing the Lovable Signal design:
 * - Monospace credential index and verified period badge
 * - Bricolage Grotesque degree heading with signal hover accent
 * - Institution name, location, and verified institutional portal link
 * - Coursework focus areas and academic leadership achievements
 */
export const EducationCard = ({ education, className }: EducationCardProps) => {
	return (
		<Surface
			variant='bordered'
			className={classNames(
				'group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-surface/50 p-4 sm:p-8 backdrop-blur-md transition-all duration-300',
				'hover:border-signal/40 hover:bg-surface/80 hover:shadow-[0_0_24px_rgba(255,51,102,0.1)] hover:-translate-y-0.5',
				className,
			)}>
			<div className='space-y-4'>
				{/* Top Row: Credential Tag & Period */}
				<div className='flex items-center justify-between gap-2 pb-3 border-b border-border/50'>
					<span className='font-mono text-[10px] uppercase tracking-widest text-signal font-semibold'>
						CREDENTIAL {'//'} 0{education.sortOrder + 1}
					</span>

					<span className='font-mono text-xs text-muted-foreground bg-surface/90 px-2.5 py-1 rounded-md border border-border/60'>
						{education.periodFormatted}
					</span>
				</div>

				{/* Degree & Field of Study */}
				<div>
					<h3 className='font-display text-lg sm:text-2xl font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-signal break-words'>
						{education.degree}
					</h3>
					<span className='font-mono text-xs text-muted-foreground block pt-1'>
						{education.fieldOfStudy}
					</span>
				</div>

				{/* University / Institution & Location */}
				<div className='pt-1'>
					<h4 className='font-sans text-sm sm:text-base font-semibold text-foreground/90 break-words'>
						{education.university}
					</h4>

					<div className='flex flex-wrap items-center gap-2.5 pt-1 font-mono text-xs text-muted-foreground'>
						<span>{education.location}</span>
						{education.website && (
							<>
								<span className='text-border-strong'>{'//'}</span>
								<a
									href={education.website}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex items-center gap-1 text-signal hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'
									aria-label={`${education.university} official website`}>
									<span>Official Portal</span>
									<SignalArrow size={10} />
								</a>
							</>
						)}
					</div>
				</div>

				{/* Description & Academic Leadership Achievements */}
				<div className='space-y-2 pt-2'>
					{education.description.map(desc => (
						<p
							key={desc}
							className='font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed'>
							{desc}
						</p>
					))}

					{education.achievements.length > 0 && (
						<ul className='space-y-1 pt-1.5' aria-label='Key Academic Milestones'>
							{education.achievements.map(ach => (
								<li
									key={ach}
									className='flex items-start gap-2 font-sans text-xs text-foreground/80 leading-relaxed'>
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
			</div>

			{/* Coursework & Focus Area Tag Pills */}
			{education.focusAreas.length > 0 && (
				<div className='pt-5 mt-4 border-t border-border/40 flex flex-wrap gap-1.5'>
					{education.focusAreas.map(area => (
						<span
							key={area}
							className='rounded-md border border-border/60 bg-surface/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors group-hover:border-border-strong group-hover:text-foreground'>
							{area}
						</span>
					))}
				</div>
			)}
		</Surface>
	)
}
