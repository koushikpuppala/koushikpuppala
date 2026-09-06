import { Surface } from 'ui/surface'
import { classNames } from '../../lib/utils'

export type PlaceholderLayoutVariant =
	| 'projects'
	| 'experience'
	| 'skills'
	| 'about'
	| 'education'
	| 'resume'
	| 'contact'

export type SectionPlaceholderProps = {
	variant: PlaceholderLayoutVariant
	className?: string
}

/**
 * SectionPlaceholder
 * Structural layout frame representing the exact proportions, column rhythm, and dimensions
 * of the upcoming Lovable section implementations without dummy data.
 */
export const SectionPlaceholder = ({ variant, className }: SectionPlaceholderProps) => {
	return (
		<div className={classNames('w-full', className)}>
			{/* Projects Layout Proportions: Asymmetric Showcase Grid */}
			{variant === 'projects' && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
					{[1, 2, 3, 4].map(idx => (
						<Surface
							key={idx}
							variant='bordered'
							className='group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 p-6 sm:p-8 min-h-[340px] sm:min-h-[400px]'>
							<div className='flex items-center justify-between'>
								<span className='font-mono text-[10px] uppercase tracking-widest text-signal/80'>
									SPEC: PROJECT_FRAME_0{idx}
								</span>
								<span className='inline-flex items-center gap-1.5 rounded border border-border/80 bg-surface/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground'>
									<span className='h-1 w-1 rounded-full bg-border-strong' aria-hidden='true' />
									READY
								</span>
							</div>

							{/* Card Proportional Media Frame */}
							<div className='my-6 w-full flex-1 rounded-lg border border-dashed border-border/60 bg-surface/30 flex items-center justify-center p-6'>
								<span className='font-mono text-xs text-muted-foreground/60 tracking-wider uppercase'>
									ASPECT 16:10 PREVIEW CANVAS
								</span>
							</div>

							<div className='space-y-2'>
								<div className='h-5 w-2/3 rounded bg-surface-strong/60' />
								<div className='h-3 w-4/5 rounded bg-surface/80' />
							</div>
						</Surface>
					))}
				</div>
			)}

			{/* Experience Layout Proportions: Vertical Timeline Rail */}
			{variant === 'experience' && (
				<div className='relative pl-6 sm:pl-8 border-l border-border/80 space-y-8 sm:space-y-12 max-w-4xl'>
					{[1, 2, 3].map(idx => (
						<div key={idx} className='relative group'>
							{/* Timeline Node */}
							<span
								className='absolute -left-[31px] sm:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-border-strong group-hover:bg-signal transition-colors'
								aria-hidden='true'
							/>

							<Surface variant='bordered' className='p-6 sm:p-8 rounded-xl space-y-4'>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<span className='font-mono text-xs text-signal font-semibold uppercase tracking-wider'>
										POSITION_SLOT_0{idx}
									</span>
									<span className='font-mono text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded border border-border/60'>
										PERIOD {'//'} TENURE
									</span>
								</div>
								<div className='h-5 w-1/2 rounded bg-surface-strong/70' />
								<div className='space-y-2 pt-2'>
									<div className='h-3 w-5/6 rounded bg-surface/80' />
									<div className='h-3 w-4/6 rounded bg-surface/60' />
								</div>
							</Surface>
						</div>
					))}
				</div>
			)}

			{/* Skills Layout Proportions: 4-Column Tech Clusters */}
			{variant === 'skills' && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{['FRONTEND & CLIENT', 'BACKEND & APIS', 'DATABASE & CLOUD', 'DEVTOOLS & ARCH'].map(
						(cluster, idx) => (
							<Surface
								key={cluster}
								variant='bordered'
								className='p-6 rounded-xl flex flex-col justify-between min-h-[300px] border border-border/70'>
								<div className='space-y-3'>
									<span className='font-mono text-[10px] uppercase tracking-widest text-signal font-medium'>
										CLUSTER_0{idx + 1}
									</span>
									<h4 className='font-sans text-sm font-semibold text-foreground tracking-tight'>
										{cluster}
									</h4>
									<div className='h-[1px] w-full bg-border/60 my-2' />
								</div>

								<div className='space-y-2.5 my-4 flex-1'>
									{[1, 2, 3, 4].map(slot => (
										<div
											key={slot}
											className='h-8 rounded border border-dashed border-border/60 bg-surface/40 flex items-center px-3'>
											<span className='font-mono text-[10px] text-muted-foreground/70'>
												TECH_NODE_0{slot}
											</span>
										</div>
									))}
								</div>

								<div className='pt-2 border-t border-border/40 flex items-center justify-between'>
									<span className='font-mono text-[10px] text-muted-foreground'>SYSTEM CAP</span>
									<span className='font-mono text-[10px] text-status-live font-semibold'>
										VERIFIED
									</span>
								</div>
							</Surface>
						),
					)}
				</div>
			)}

			{/* About Layout Proportions: 12-Column Split Bio & Philosophy */}
			{variant === 'about' && (
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
					{/* Left: Bio / Pedestal Frame */}
					<div className='lg:col-span-5'>
						<Surface
							variant='bordered'
							className='p-6 sm:p-8 rounded-xl border border-border/80 flex flex-col items-center justify-center text-center min-h-[380px]'>
							<div className='h-32 w-32 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center mb-6 bg-surface/40'>
								<span className='font-mono text-[10px] text-muted-foreground tracking-wider uppercase'>
									PORTRAIT PEDESTAL
								</span>
							</div>
							<div className='h-5 w-1/2 rounded bg-surface-strong/80 mb-2' />
							<div className='h-3 w-3/4 rounded bg-surface/80 mb-4' />
							<span className='font-mono text-xs text-signal font-medium'>
								LOCATION: BENGALURU, INDIA
							</span>
						</Surface>
					</div>

					{/* Right: Technical Narrative & Milestones */}
					<div className='lg:col-span-7 space-y-6'>
						<Surface variant='bordered' className='p-6 sm:p-8 rounded-xl space-y-4'>
							<span className='font-mono text-xs uppercase tracking-widest text-muted-foreground'>
								PHILOSOPHY {'//'} SYSTEMIC ENGINEERING
							</span>
							<div className='space-y-3 pt-2'>
								<div className='h-4 w-full rounded bg-surface-strong/60' />
								<div className='h-4 w-5/6 rounded bg-surface/80' />
								<div className='h-4 w-4/6 rounded bg-surface/60' />
							</div>
						</Surface>

						<div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
							{[1, 2, 3].map(m => (
								<Surface
									key={m}
									variant='bordered'
									className='p-4 rounded-lg text-center space-y-1'>
									<div className='h-6 w-12 mx-auto rounded bg-signal/20' />
									<span className='font-mono text-[10px] text-muted-foreground uppercase block'>
										METRIC_0{m}
									</span>
								</Surface>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Education Layout Proportions: Academic Milestones Grid */}
			{variant === 'education' && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
					{[1, 2].map(idx => (
						<Surface
							key={idx}
							variant='bordered'
							className='p-6 sm:p-8 rounded-xl border border-border/80 flex flex-col justify-between min-h-[260px]'>
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='font-mono text-[10px] uppercase tracking-widest text-signal font-semibold'>
										DEGREE_CREDENTIAL_0{idx}
									</span>
									<span className='font-mono text-xs text-muted-foreground bg-surface px-2.5 py-0.5 rounded border border-border/60'>
										YEAR_RANGE
									</span>
								</div>
								<div className='h-6 w-3/4 rounded bg-surface-strong/70' />
								<div className='h-4 w-1/2 rounded bg-surface/80' />
							</div>

							<div className='pt-6 border-t border-border/50 flex flex-wrap gap-2'>
								{[1, 2, 3].map(c => (
									<span
										key={c}
										className='font-mono text-[10px] text-muted-foreground border border-dashed border-border px-2 py-0.5 rounded'>
										FOCUS_AREA_0{c}
									</span>
								))}
							</div>
						</Surface>
					))}
				</div>
			)}

			{/* Resume Layout Proportions: Download & Credential Overview */}
			{variant === 'resume' && (
				<Surface
					variant='bordered'
					className='p-6 sm:p-10 rounded-xl border border-border/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
					<div className='lg:col-span-8 space-y-4'>
						<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
							CREDENTIALS CONSOLE {'//'} AUTHORITATIVE DOSSIER
						</span>
						<div className='h-6 w-2/3 rounded bg-surface-strong/80' />
						<div className='h-4 w-4/5 rounded bg-surface/80' />
						<div className='flex flex-wrap gap-3 pt-2'>
							<span className='font-mono text-xs text-muted-foreground'>FORMAT: PDF</span>
							<span className='text-border-strong'>•</span>
							<span className='font-mono text-xs text-muted-foreground'>LATEST REVISION: 2026</span>
						</div>
					</div>

					<div className='lg:col-span-4 flex justify-start lg:justify-end'>
						<div className='h-12 w-48 rounded-full border border-dashed border-signal/60 bg-signal/10 flex items-center justify-center font-mono text-xs text-signal font-medium'>
							DOWNLOAD ACTION FRAME
						</div>
					</div>
				</Surface>
			)}

			{/* Contact Layout Proportions: Split Channels & Transmission Terminal */}
			{variant === 'contact' && (
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
					{/* Direct Communication Channels */}
					<div className='lg:col-span-5 space-y-4'>
						<Surface variant='bordered' className='p-6 sm:p-8 rounded-xl space-y-6'>
							<span className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
								DIRECT CHANNELS
							</span>
							<div className='space-y-4'>
								{['EMAIL TRANSMISSION', 'OFFICIAL LINKEDIN', 'GITHUB NETWORK', 'DISCORD HUB'].map(
									ch => (
										<div
											key={ch}
											className='flex items-center justify-between p-3 rounded-lg border border-dashed border-border/60 bg-surface/30'>
											<span className='font-mono text-xs text-foreground font-medium'>{ch}</span>
											<span className='font-mono text-[10px] text-muted-foreground'>CONNECT</span>
										</div>
									),
								)}
							</div>
						</Surface>
					</div>

					{/* Transmission Message Form Frame */}
					<div className='lg:col-span-7'>
						<Surface variant='bordered' className='p-6 sm:p-8 rounded-xl space-y-6'>
							<div className='flex items-center justify-between border-b border-border/50 pb-4'>
								<span className='font-mono text-xs uppercase tracking-widest text-muted-foreground font-medium'>
									DISPATCH TERMINAL {'//'} ENCRYPTED
								</span>
								<span
									className='h-2 w-2 rounded-full bg-status-live animate-pulse'
									aria-hidden='true'
								/>
							</div>

							<div className='space-y-4'>
								<div className='h-11 rounded-lg border border-dashed border-border/70 bg-surface/20 flex items-center px-4'>
									<span className='font-mono text-xs text-muted-foreground/60'>
										INPUT_FRAME: NAME &amp; ORGANIZATION
									</span>
								</div>
								<div className='h-11 rounded-lg border border-dashed border-border/70 bg-surface/20 flex items-center px-4'>
									<span className='font-mono text-xs text-muted-foreground/60'>
										INPUT_FRAME: RETURN EMAIL ADDRESS
									</span>
								</div>
								<div className='h-28 rounded-lg border border-dashed border-border/70 bg-surface/20 flex items-start p-4'>
									<span className='font-mono text-xs text-muted-foreground/60'>
										INPUT_FRAME: TRANSMISSION BODY
									</span>
								</div>
								<div className='h-11 w-40 rounded-full border border-dashed border-signal/60 bg-signal/10 flex items-center justify-center font-mono text-xs text-signal font-semibold'>
									TRANSMIT FRAME
								</div>
							</div>
						</Surface>
					</div>
				</div>
			)}
		</div>
	)
}
