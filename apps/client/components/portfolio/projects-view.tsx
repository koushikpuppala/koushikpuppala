'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, X } from '@/components/icons'
import { SiteShell } from '@/components/site-shell'
import { EmptyState, Reveal, Section, SectionHeader } from '@/components/primitives'
import { PageHero } from '@/components/portfolio/page-hero'
import { FeaturedProjectRow, SupportingProjects } from '@/components/portfolio/work-showcase'
import { ContactCTA } from '@/components/portfolio/home-sections'
import { Button } from '@/components/ui/button'
import type { Project, Social } from '@/lib/api-types'
import { cn } from '@/lib/utils'

function FilterChip({
	active,
	onClick,
	children,
}: {
	active: boolean
	onClick: () => void
	children: string
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			aria-pressed={active}
			className={cn(
				'rounded-full border px-3.5 py-1.5 font-mono text-[0.75rem] transition-all duration-400 ease-[var(--ease-out-expo)]',
				active
					? 'border-signal bg-signal-soft text-signal-ink'
					: 'border-border text-muted-foreground hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground',
			)}>
			{children}
		</button>
	)
}

export function ProjectsView({ projects, socials }: { projects: Project[]; socials: Social[] }) {
	const [search, setSearch] = useState('')
	const [tag, setTag] = useState<string | null>(null)

	const email = socials.find(social => social.platform === 'mail')?.handle ?? null
	const tags = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tags))).sort(), [projects])

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase()
		return projects.filter(project => {
			const matchesTag = !tag || project.tags.includes(tag)
			const matchesTerm =
				!term ||
				[project.title, project.summary, ...project.stack, ...project.tags]
					.join(' ')
					.toLowerCase()
					.includes(term)
			return matchesTag && matchesTerm
		})
	}, [projects, search, tag])

	const isFiltering = Boolean(search.trim() || tag)
	const featured = filtered.filter(project => project.featured)
	const supporting = filtered.filter(project => !project.featured)

	return (
		<SiteShell socials={socials}>
			<PageHero
				eyebrow='Projects'
				title='Systems behind the interfaces'
				lines={['Systems behind', 'the interfaces']}
				lead='Payment instrument integrations, travel booking flows and long-running personal projects — each one documented as a case study.'
				meta={[
					`${projects.length} projects`,
					`${projects.filter(p => p.featured).length} featured`,
				]}
				actions={
					<Button asChild size='lg' variant='outline' className='group'>
						<Link href='/contact'>
							Start a conversation <ArrowRight className='arrow-slide size-4' />
						</Link>
					</Button>
				}
			/>

			<Section className='pt-12 pb-0 lg:pt-16'>
				<div className='container-page'>
					<Reveal className='grid gap-5 border-y border-border py-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center lg:gap-10'>
						<div className='relative'>
							<Search
								className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground'
								aria-hidden
							/>
							<input
								value={search}
								onChange={event => setSearch(event.target.value)}
								placeholder='Search projects, stack, tags…'
								aria-label='Search projects'
								className='h-11 w-full rounded-full border border-border bg-surface/60 pr-10 pl-10 font-mono text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-border-strong focus:outline-none'
							/>
							{search ? (
								<button
									type='button'
									onClick={() => setSearch('')}
									aria-label='Clear search'
									className='absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground'>
									<X className='size-3.5' />
								</button>
							) : null}
						</div>
						<fieldset
							className='flex flex-wrap gap-2 lg:justify-end border-0 p-0 m-0'
							aria-label='Filter by tag'>
							<FilterChip active={tag === null} onClick={() => setTag(null)}>
								All
							</FilterChip>
							{tags.map(item => (
								<FilterChip
									key={item}
									active={tag === item}
									onClick={() => setTag(item === tag ? null : item)}>
									{item}
								</FilterChip>
							))}
						</fieldset>
					</Reveal>
				</div>
			</Section>

			<Section className='pt-14 lg:pt-20'>
				<div className='container-page'>
					{filtered.length === 0 ? (
						<EmptyState
							title='No projects match those filters'
							description='Try a different search term or clear the tag filter.'
							action={
								<Button
									variant='outline'
									onClick={() => {
										setSearch('')
										setTag(null)
									}}>
									Clear filters
								</Button>
							}
						/>
					) : (
						<>
							{featured.length ? (
								<>
									{!isFiltering ? (
										<SectionHeader index='01' eyebrow='Flagship' title='Case studies' size='md' />
									) : (
										<p className='text-eyebrow'>
											{filtered.length} {filtered.length === 1 ? 'result' : 'results'}
										</p>
									)}
									<div className='mt-14 space-y-20 lg:mt-16 lg:space-y-28'>
										{featured.map((project, i) => (
											<FeaturedProjectRow
												key={project.id}
												project={project}
												index={i}
												flip={i % 2 === 1}
												eager={i === 0}
											/>
										))}
									</div>
								</>
							) : null}

							{supporting.length ? (
								<div className={cn(featured.length ? 'mt-20 lg:mt-28' : '')}>
									<Reveal className='flex items-center gap-4'>
										<span className='text-eyebrow whitespace-nowrap'>
											{featured.length ? 'Also built' : 'Projects'}
										</span>
										<span className='h-px flex-1 bg-border' />
									</Reveal>
									<SupportingProjects
										projects={supporting}
										startIndex={featured.length + 1}
										className='mt-6 border-t border-border'
									/>
								</div>
							) : null}
						</>
					)}
				</div>
			</Section>

			<ContactCTA socials={socials} email={email} />
		</SiteShell>
	)
}
