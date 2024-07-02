import { ExperienceComponent, MotionDiv } from '@import/components'
import { experiencesType, sanityQuery } from '@import/sanity'
import { ExperienceSchemaProps } from '@import/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Experience',
	openGraph: {
		title: 'Experience',
	},
	twitter: {
		title: 'Experience',
	},
}

export const revalidate = 300

const ExperiencePage = async () => {
	const data: ExperienceSchemaProps[] | null = await sanityQuery(experiencesType)

	if (!data) return notFound()

	return (
		<div className='h-full bg-primary/50'>
			<div className='h-full w-full overflow-y-auto'>
				<div className='container mx-auto h-full items-center py-6 text-left md:py-12 lg:py-24'>
					<MotionDiv direction='right' delay={0.2} className='md:px-6'>
						<p className='text-center text-xs uppercase tracking-wider text-secondary lg:text-base'>
							What I have done so far
						</p>
						<h2 className='text-center text-3xl font-black text-white lg:text-5xl'>Work Experience</h2>
					</MotionDiv>

					<MotionDiv direction='up' delay={0.2} className='mt-10 flex flex-col pb-40 lg:pb-12'>
						<ExperienceComponent data={data} />
					</MotionDiv>
				</div>
			</div>
		</div>
	)
}

export default ExperiencePage
