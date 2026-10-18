import type { PublishedProject } from 'types/models'
import type { MetaCellProps, ProjectHeroProps } from 'types/components/client'
import Link from 'next/link'
import { Button } from 'ui/button'
import { splitTitle, toDisplayLines } from 'lib/format'
import { PulseDot } from 'components/primitives/layout'
import { DisplayLines } from 'components/primitives/motion'
import { ArrowLeft, ExternalLink, Github } from 'components/icons'

const STATUS_LABELS: Record<PublishedProject['status'], string> = {
	COMPLETED: 'Shipped',
	IN_PROGRESS: 'In progress',
	ARCHIVED: 'Archived',
}

const MetaCell = ({ label, value }: MetaCellProps) => (
	<div className='border-border border-t py-4 sm:border-t-0 sm:border-l sm:py-0 sm:pl-6 sm:first:border-l-0 sm:first:pl-0'>
		<dt className='text-eyebrow'>{label}</dt>
		<dd className='text-foreground mt-2 text-sm'>{value}</dd>
	</div>
)

export const ProjectHero = ({ project, updated }: ProjectHeroProps) => {
	const { main, sub } = splitTitle(project.title)
	const tags = project.tags || []
	const stack = project.technologies

	return (
		<section className='border-border relative overflow-hidden border-b'>
			<div
				className='grid-fine mask-fade-b pointer-events-none absolute inset-0 opacity-60'
				aria-hidden
			/>
			<div
				className='pointer-events-none absolute -top-56 -right-32 size-144 rounded-full opacity-70 blur-3xl'
				style={{ background: 'var(--glow-signal)' }}
				aria-hidden
			/>
			<div className='container-page relative pt-24 pb-14 sm:pt-28 lg:pt-32 lg:pb-16'>
				<Link
					href='/projects'
					className='enter-item group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-[0.75rem] transition-colors'>
					<ArrowLeft className='size-3.5 transition-transform duration-400 group-hover:-translate-x-0.5' />
					All projects
				</Link>

				<div className='enter-item enter-delay-2 text-muted-foreground mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase'>
					{project.featured ? (
						<span className='text-foreground flex items-center gap-2'>
							<PulseDot />
							Flagship
						</span>
					) : null}
					{tags.map(tag => (
						<span key={tag} className='flex items-center gap-4'>
							<span aria-hidden className='text-signal-ink'>
								{'//'}
							</span>
							{tag}
						</span>
					))}
				</div>

				<h1 className='text-display text-section mt-6 max-w-4xl'>
					<DisplayLines lines={toDisplayLines(main, 2)} />
				</h1>
				{sub ? (
					<p className='enter-item enter-delay-3 font-display text-muted-foreground mt-4 max-w-2xl text-lg tracking-tight sm:text-xl'>
						{sub}
					</p>
				) : null}

				<p className='enter-item enter-delay-4 text-lead mt-7 max-w-2xl'>
					{project.shortDescription}
				</p>

				{project.liveUrl || project.github ? (
					<div className='enter-item enter-delay-5 mt-9 flex flex-wrap items-center gap-3'>
						{project.liveUrl ? (
							<Button asChild size='lg' variant='signal'>
								<Link href={project.liveUrl} target='_blank' rel='noreferrer noopener'>
									Visit live site <ExternalLink className='size-4' />
								</Link>
							</Button>
						) : null}
						{project.github ? (
							<Button asChild size='lg' variant='outline'>
								<Link href={project.github} target='_blank' rel='noreferrer noopener'>
									<Github className='size-4' /> Source
								</Link>
							</Button>
						) : null}
					</div>
				) : null}

				<dl className='enter-item enter-delay-6 border-border mt-12 grid gap-0 border-t pt-8 sm:grid-cols-3 sm:gap-6'>
					<MetaCell label='Status' value={STATUS_LABELS[project.status]} />
					<MetaCell label='Primary stack' value={stack.slice(0, 3).join(' · ')} />
					{updated ? <MetaCell label='Last updated' value={updated} /> : null}
				</dl>
			</div>
		</section>
	)
}
