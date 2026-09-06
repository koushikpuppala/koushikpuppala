import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github } from '@/components/icons'
import { SiteShell } from '@/components/site-shell'
import { Chip, DisplayLines, PulseDot, Reveal, Section } from '@/components/primitives'
import { ProjectVisual } from '@/components/portfolio/project-visual'
import { Button } from '@/components/ui/button'
import { splitTitle, toDisplayLines } from '@/lib/format'
import { getProject, getProjects, getSocials } from '@/lib/portfolio-data'

export type PageProps = {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const projects = await getProjects()
	return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params
	const project = await getProject(slug)

	if (!project) {
		return {
			title: 'Project not found',
			robots: { index: false },
		}
	}

	return {
		title: `${project.title} — Koushik Puppala`,
		description: project.summary,
		openGraph: {
			title: `${project.title} — Koushik Puppala`,
			description: project.summary,
			type: 'article',
		},
		twitter: {
			card: 'summary_large_image',
		},
	}
}

function MetaCell({ label, value }: { label: string; value: string }) {
	return (
		<div className='border-t border-border py-4 sm:border-t-0 sm:border-l sm:py-0 sm:pl-6 sm:first:border-l-0 sm:first:pl-0'>
			<p className='text-eyebrow'>{label}</p>
			<p className='mt-2 text-sm text-foreground'>{value}</p>
		</div>
	)
}

export default async function ProjectDetailPage({ params }: PageProps) {
	const { slug } = await params
	const [project, projects, socials] = await Promise.all([
		getProject(slug),
		getProjects(),
		getSocials(),
	])

	if (!project) {
		notFound()
	}

	const { main, sub } = splitTitle(project.title)
	const index = projects.findIndex(item => item.slug === project.slug)
	const next = projects[(index + 1 + projects.length) % projects.length]
	const paragraphs = project.content.split('\n').filter(Boolean)
	const updated = new Date(project.updatedAt).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
	})

	return (
		<SiteShell socials={socials}>
			{/* ------------------------------------------------------------ intro */}
			<section className='relative overflow-hidden border-b border-border'>
				<div
					className='grid-fine mask-fade-b pointer-events-none absolute inset-0 opacity-60'
					aria-hidden
				/>
				<div
					className='pointer-events-none absolute -top-56 -right-32 size-[36rem] rounded-full opacity-70 blur-3xl'
					style={{ background: 'var(--glow-signal)' }}
					aria-hidden
				/>
				<div className='container-page relative pt-24 pb-14 sm:pt-28 lg:pt-32 lg:pb-16'>
					<Link
						href='/projects'
						className='enter-item group inline-flex items-center gap-2 font-mono text-[0.75rem] text-muted-foreground transition-colors hover:text-foreground'>
						<ArrowLeft className='size-3.5 transition-transform duration-400 group-hover:-translate-x-0.5' />
						All projects
					</Link>

					<div className='enter-item enter-delay-2 mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase'>
						{project.featured ? (
							<span className='flex items-center gap-2 text-foreground'>
								<PulseDot />
								Flagship
							</span>
						) : null}
						{project.tags.map(tag => (
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
						<p className='enter-item enter-delay-3 mt-4 max-w-2xl font-display text-lg tracking-tight text-muted-foreground sm:text-xl'>
							{sub}
						</p>
					) : null}

					<p className='enter-item enter-delay-4 text-lead mt-7 max-w-2xl'>{project.summary}</p>

					{project.liveUrl || project.repoUrl ? (
						<div className='enter-item enter-delay-5 mt-9 flex flex-wrap items-center gap-3'>
							{project.liveUrl ? (
								<Button asChild size='lg' variant='signal'>
									<a href={project.liveUrl} target='_blank' rel='noreferrer noopener'>
										Visit live site <ExternalLink className='size-4' />
									</a>
								</Button>
							) : null}
							{project.repoUrl ? (
								<Button asChild size='lg' variant='outline'>
									<a href={project.repoUrl} target='_blank' rel='noreferrer noopener'>
										<Github className='size-4' /> Source
									</a>
								</Button>
							) : null}
						</div>
					) : null}

					<dl className='enter-item enter-delay-6 mt-12 grid gap-0 border-t border-border pt-8 sm:grid-cols-3 sm:gap-6'>
						<MetaCell
							label='Status'
							value={project.status === 'PUBLISHED' ? 'Shipped' : project.status}
						/>
						<MetaCell label='Primary stack' value={project.stack.slice(0, 3).join(' · ')} />
						<MetaCell label='Last updated' value={updated} />
					</dl>
				</div>
			</section>

			{/* ----------------------------------------------------------- visual */}
			<div className='container-page -mt-px'>
				<Reveal from='scale' className='relative'>
					<div className='group relative overflow-hidden rounded-b-2xl border-x border-b border-border'>
						<ProjectVisual
							slug={project.slug}
							title={project.title}
							coverImageUrl={project.coverImageUrl}
							eager
							frame='wide'
							className='aspect-4/3 w-full sm:aspect-16/9 lg:aspect-21/9'
						/>
						<div className='pointer-events-none absolute inset-0 ring-1 ring-foreground/5 ring-inset' />
					</div>
				</Reveal>
			</div>

			{/* ---------------------------------------------------------- content */}
			<Section className='pt-16 lg:pt-24'>
				<div className='container-page grid gap-14 lg:grid-cols-12 lg:gap-16'>
					<div className='lg:col-span-7 xl:col-span-8'>
						<Reveal className='flex items-center gap-4'>
							<span className='text-eyebrow whitespace-nowrap'>Case study</span>
							<span className='h-px flex-1 bg-border' />
						</Reveal>
						<article className='mt-8 space-y-6'>
							{paragraphs.map((paragraph, i) => (
								<Reveal key={paragraph.slice(0, 32)} delay={i * 55}>
									<p className='max-w-2xl text-[1.0625rem] leading-[1.8] text-muted-foreground'>
										{paragraph}
									</p>
								</Reveal>
							))}
						</article>

						{project.gallery.length > 0 ? (
							<div className='mt-14 grid gap-5 sm:grid-cols-2'>
								{project.gallery.map((item, i) => (
									<Reveal key={item.id} delay={i * 60}>
										<figure className='overflow-hidden rounded-xl border border-border bg-surface'>
											<img
												src={item.url}
												alt={item.caption ?? project.title}
												loading='lazy'
												decoding='async'
												className='w-full'
											/>
											{item.caption ? (
												<figcaption className='border-t border-border px-4 py-3 font-mono text-[0.6875rem] text-muted-foreground'>
													{item.caption}
												</figcaption>
											) : null}
										</figure>
									</Reveal>
								))}
							</div>
						) : null}
					</div>

					<aside className='lg:col-span-5 xl:col-span-4'>
						<Reveal delay={90} from='right' className='lg:sticky lg:top-28'>
							<div className='panel rounded-2xl p-7'>
								<div className='flex items-center gap-4'>
									<p className='text-eyebrow whitespace-nowrap'>Details</p>
									<span className='h-px flex-1 bg-border' />
								</div>

								<div className='mt-7'>
									<p className='text-eyebrow'>Stack</p>
									<div className='mt-3 flex flex-wrap gap-1.5'>
										{project.stack.map(tech => (
											<Chip key={tech} tone='outline'>
												{tech}
											</Chip>
										))}
									</div>
								</div>

								{project.tags.length ? (
									<div className='mt-7'>
										<p className='text-eyebrow'>Tags</p>
										<div className='mt-3 flex flex-wrap gap-x-3 gap-y-1.5'>
											{project.tags.map(tag => (
												<span key={tag} className='font-mono text-[0.75rem] text-signal-ink'>
													#{tag.toLowerCase().replace(/\s+/g, '-')}
												</span>
											))}
										</div>
									</div>
								) : null}

								<div className='mt-7 border-t border-border pt-6'>
									<p className='text-eyebrow'>Updated</p>
									<p className='numeric mt-2 font-mono text-sm text-muted-foreground'>{updated}</p>
								</div>

								<Button asChild variant='outline' className='group mt-7 w-full'>
									<Link href='/contact'>
										Discuss a similar build <ArrowRight className='arrow-slide size-4' />
									</Link>
								</Button>
							</div>
						</Reveal>
					</aside>
				</div>
			</Section>

			{/* ------------------------------------------------------------- next */}
			{next && next.slug !== project.slug ? (
				<Section className='border-t border-border pt-14 pb-24 lg:pb-32'>
					<div className='container-page'>
						<Reveal>
							<Link
								href={`/projects/${next.slug}`}
								className='group grid gap-6 rounded-2xl border border-border bg-surface/50 p-7 transition-colors duration-500 hover:bg-surface sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-10'>
								<div className='min-w-0'>
									<p className='text-eyebrow'>Next case study</p>
									<h2 className='font-display mt-3 text-2xl font-medium tracking-tight text-balance sm:text-3xl'>
										<span className='link-underline'>{splitTitle(next.title).main}</span>
									</h2>
									<p className='mt-2 max-w-xl text-sm text-muted-foreground'>{next.summary}</p>
								</div>
								<span className='grid size-12 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-500 group-hover:border-signal group-hover:bg-signal group-hover:text-signal-foreground'>
									<ArrowUpRight className='size-5' />
								</span>
							</Link>
						</Reveal>
					</div>
				</Section>
			) : null}
		</SiteShell>
	)
}
