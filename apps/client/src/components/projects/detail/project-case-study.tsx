import type { ProjectCaseStudyProps } from 'types/components/client'
import Image from 'next/image'
import { Reveal } from 'components/primitives/motion'

export const ProjectCaseStudy = ({ project }: ProjectCaseStudyProps) => {
	const paragraphs = (
		project.caseStudy ? project.caseStudy.split('\n') : project.descriptions
	).filter(Boolean)
	const gallery = project.gallery || []

	return (
		<div className='lg:col-span-7 xl:col-span-8'>
			<Reveal className='flex items-center gap-4'>
				<span className='text-eyebrow whitespace-nowrap'>Case study</span>
				<span className='bg-border h-px flex-1' />
			</Reveal>
			<article className='mt-8 space-y-6'>
				{paragraphs.map((paragraph, i) => (
					<Reveal key={paragraph.slice(0, 32)} delay={i * 55}>
						<p className='text-muted-foreground max-w-2xl text-[1.0625rem] leading-[1.8]'>
							{paragraph}
						</p>
					</Reveal>
				))}
			</article>

			{gallery.length > 0 ? (
				<div className='mt-14 grid gap-5 sm:grid-cols-2'>
					{gallery.map((item, i) =>
						item.url ? (
							<Reveal key={item.id} delay={i * 60}>
								<figure className='border-border bg-surface overflow-hidden rounded-xl border'>
									<Image
										src={item.url}
										alt={item.altText || item.caption || project.title}
										width={800}
										height={500}
										unoptimized
										className='h-auto w-full object-cover'
									/>
									{item.caption ? (
										<figcaption className='border-border text-muted-foreground border-t px-4 py-3 font-mono text-[0.6875rem]'>
											{item.caption}
										</figcaption>
									) : null}
								</figure>
							</Reveal>
						) : null,
					)}
				</div>
			) : null}
		</div>
	)
}
