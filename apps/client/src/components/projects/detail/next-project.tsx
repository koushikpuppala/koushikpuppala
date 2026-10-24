import type { NextProjectProps } from 'types/components/client'
import Link from 'next/link'
import { splitTitle } from 'lib/format'
import { ArrowUpRight } from 'components/icons'
import { Section } from 'components/primitives/layout'
import { Reveal } from 'components/primitives/motion'

export const NextProject = ({ project: next }: NextProjectProps) => (
	<Section className='border-border border-t pt-14 pb-24 lg:pb-32'>
		<div className='container-page'>
			<Reveal>
				<Link
					href={`/projects/${next.slug}`}
					className='group border-border bg-surface/50 hover:bg-surface grid gap-6 rounded-2xl border p-7 transition-colors duration-500 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-10'>
					<div className='min-w-0'>
						<p className='text-eyebrow'>Next case study</p>
						<h2 className='font-display mt-3 text-2xl font-medium tracking-tight text-balance sm:text-3xl'>
							<span className='link-underline'>{splitTitle(next.title).main}</span>
						</h2>
						<p className='text-muted-foreground mt-2 max-w-xl text-sm'>{next.shortDescription}</p>
					</div>
					<span className='border-border text-muted-foreground group-hover:border-signal-solid group-hover:bg-signal-solid group-hover:text-signal-foreground grid size-12 shrink-0 place-items-center rounded-full border transition-all duration-500'>
						<ArrowUpRight className='size-5' />
					</span>
				</Link>
			</Reveal>
		</div>
	</Section>
)
