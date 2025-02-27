import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getExperienceDocuments } from '@import/sanity'
import { Experience, Motion } from '@import/components'

export const metadata: Metadata = {
	title: 'Experience',
	openGraph: { title: 'Experience' },
	twitter: { title: 'Experience' },
}

const ExperiencePage = async () => {
	const data = await getExperienceDocuments()

	if (data.length === 0) return notFound()

	return (
		<div className='bg-primary/50 h-full'>
			<div className='h-full w-full overflow-y-auto'>
				<div className='container mx-auto h-full items-center py-6 text-left md:py-12 lg:py-24'>
					<Motion.div direction='right' delay={0.2} className='md:px-6'>
						<p className='text-secondary text-center text-xs tracking-wider uppercase lg:text-base'>
							What I have done so far
						</p>
						<h2 className='text-center text-3xl font-black text-white lg:text-5xl'>
							Work Experience
						</h2>
					</Motion.div>

					<Motion.div direction='up' delay={0.2} className='mt-10 flex flex-col pb-40 lg:pb-12'>
						<Experience data={data} />
					</Motion.div>
				</div>
			</div>
		</div>
	)
}

export default ExperiencePage
