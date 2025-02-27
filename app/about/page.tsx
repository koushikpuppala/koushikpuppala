import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAboutDocument } from '@import/sanity'
import { Education, Motion, ServiceCard } from '@import/components'

export const metadata: Metadata = {
	title: 'About',
	openGraph: { title: 'About' },
	twitter: { title: 'About' },
}

const AboutPage = async () => {
	const data = await getAboutDocument()

	if (!data) return notFound()

	return (
		<div className='bg-primary/50 h-full'>
			<div className='h-full w-full overflow-y-auto'>
				<div className='container mx-auto h-full items-center py-6 text-left md:py-12 lg:py-24'>
					<Motion.div direction='right' delay={0.1} className='md:px-6'>
						<p className='text-secondary text-xs tracking-wider uppercase lg:text-base'>Introduction</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Overview</h2>
					</Motion.div>

					<Motion.p
						direction='right'
						delay={0.2}
						className='text-secondary mx-auto mt-4 mb-2 max-w-3xl text-justify text-sm leading-6 md:px-6 lg:mx-0 lg:text-lg xl:max-w-5xl'>
						{data.introduction}
					</Motion.p>

					<ServiceCard data={data.services} />

					<Motion.div direction='right' delay={0.1} className='md:px-6'>
						<p className='text-secondary text-xs tracking-wider uppercase lg:text-base'>Introduction</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Education</h2>
					</Motion.div>

					<Motion.div direction='up' delay={0.2} className='mt-10 flex flex-col pb-40 lg:pb-12'>
						<Education data={data.educations} />
					</Motion.div>
				</div>
			</div>
		</div>
	)
}

export default AboutPage
