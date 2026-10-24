import type { ProjectDetailsProps } from 'types/components/client'
import Link from 'next/link'
import { Button } from 'ui/button'
import { ArrowRight } from 'components/icons'
import { Chip } from 'components/primitives/layout'
import { Reveal } from 'components/primitives/motion'

export const ProjectDetails = ({ stack, tags, updated }: ProjectDetailsProps) => (
	<aside className='lg:col-span-5 xl:col-span-4'>
		<Reveal delay={90} from='right' className='lg:sticky lg:top-28'>
			<div className='panel rounded-2xl p-7'>
				<div className='flex items-center gap-4'>
					<p className='text-eyebrow whitespace-nowrap'>Details</p>
					<span className='bg-border h-px flex-1' />
				</div>

				<div className='mt-7'>
					<p className='text-eyebrow'>Stack</p>
					<div className='mt-3 flex flex-wrap gap-1.5'>
						{stack.map(tech => (
							<Chip key={tech} tone='outline'>
								{tech}
							</Chip>
						))}
					</div>
				</div>

				{tags.length ? (
					<div className='mt-7'>
						<p className='text-eyebrow'>Tags</p>
						<div className='mt-3 flex flex-wrap gap-x-3 gap-y-1.5'>
							{tags.map(tag => (
								<span key={tag} className='text-signal-ink font-mono text-[0.75rem]'>
									#{tag.toLowerCase().replace(/\s+/g, '-')}
								</span>
							))}
						</div>
					</div>
				) : null}

				{updated ? (
					<div className='border-border mt-7 border-t pt-6'>
						<p className='text-eyebrow'>Updated</p>
						<p className='numeric text-muted-foreground mt-2 font-mono text-sm'>{updated}</p>
					</div>
				) : null}

				<Button asChild variant='outline' className='group mt-7 w-full'>
					<Link href='/contact'>
						Discuss a similar build <ArrowRight className='arrow-slide size-4' />
					</Link>
				</Button>
			</div>
		</Reveal>
	</aside>
)
