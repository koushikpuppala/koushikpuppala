'use client'

import { Surface } from 'ui/surface'
import { classNames } from '../../lib/utils'
import type { SkillCluster } from '../../lib/skills-data'

export type SkillClusterCardProps = {
	cluster: SkillCluster
	className?: string
}

/**
 * SkillClusterCard
 * Technical stack cluster component reproducing the Lovable Signal design:
 * - Grouped category header with technical index and monospace tags
 * - Bricolage Grotesque display title with pink hover glow
 * - High-contrast skill rows with proficiency and CORE badges
 * - Clean wrapping for long technology names (e.g. REST APIs & Swagger / OpenAPI)
 * - Hairline boundaries and subtle hover transitions
 */
export const SkillClusterCard = ({ cluster, className }: SkillClusterCardProps) => {
	return (
		<Surface
			variant='bordered'
			className={classNames(
				'group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-surface/50 p-4 sm:p-7 backdrop-blur-md transition-all duration-300',
				'hover:border-signal/50 hover:bg-surface/80 hover:shadow-[0_0_24px_rgba(255,51,102,0.12)] hover:-translate-y-1',
				className,
			)}>
			<div className='flex flex-col h-full'>
				{/* Cluster Header */}
				<div className='space-y-1.5 pb-2'>
					<span className='font-mono text-[10px] uppercase tracking-widest text-signal font-semibold'>
						CLUSTER_{cluster.index} {'//'} {cluster.categoryTag}
					</span>

					<h3 className='font-display text-lg sm:text-2xl font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-signal break-words'>
						{cluster.title}
					</h3>

					<p className='font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-0.5'>
						{cluster.description}
					</p>
				</div>

				{/* Hairline Divider */}
				<div className='h-[1px] w-full bg-border/50 my-3.5' aria-hidden='true' />

				{/* Grouped Skills List */}
				<div className='space-y-2 flex-1 my-1'>
					{cluster.skills.map(skill => (
						<div
							key={skill.id}
							className={classNames(
								'group/skill flex items-center justify-between gap-2 sm:gap-3 rounded-lg border border-border/50 bg-surface/40 px-2.5 sm:px-3 py-2 transition-all duration-200',
								'hover:border-signal/40 hover:bg-surface-strong/80 hover:translate-x-1',
							)}>
							{/* Skill Name with break-words to guarantee clean wrapping */}
							<span className='font-mono text-xs sm:text-sm text-foreground/90 font-medium transition-colors group-hover/skill:text-signal break-words'>
								{skill.name}
							</span>

							{/* Badge / Indicator */}
							<div className='shrink-0'>
								{skill.featured ? (
									<span className='inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] text-signal font-semibold'>
										<span
											className='h-1 w-1 rounded-full bg-signal shadow-[0_0_4px_rgba(255,51,102,0.8)] animate-pulse'
											aria-hidden='true'
										/>
										<span>CORE</span>
									</span>
								) : skill.proficiency ? (
									<span className='font-mono text-[10px] text-muted-foreground bg-surface px-2 py-0.5 rounded border border-border/60'>
										{skill.proficiency}%
									</span>
								) : null}
							</div>
						</div>
					))}
				</div>

				{/* Cluster Footer Metric */}
				<div className='pt-4 mt-3 border-t border-border/40 flex items-center justify-between font-mono text-[10px] text-muted-foreground'>
					<span>{cluster.skills.length} VERIFIED NODES</span>
					<span className='text-status-live font-semibold'>SYS.READY</span>
				</div>
			</div>
		</Surface>
	)
}
