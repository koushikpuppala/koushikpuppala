import { EducationComponent, MotionDiv, MotionP, ServiceCardComponent } from '@import/components'
import { aboutType, sanityQuery } from '@import/sanity'
import { AboutSchemaProps } from '@import/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
	title: 'About',
	openGraph: { title: 'About' },
	twitter: { title: 'About' },
}

export const revalidate = 300

const AboutPage = async () => {
	const data: AboutSchemaProps | null = await sanityQuery(aboutType)

	if (!data) return notFound()

	return (
		<div className='h-full bg-primary/50'>
			<div className='h-full w-full overflow-y-auto'>
				<div className='container mx-auto h-full items-center py-6 text-left md:py-12 lg:py-24'>
					<MotionDiv direction='right' delay={0.1} className='md:px-6'>
						<p className='text-xs uppercase tracking-wider text-secondary lg:text-base'>Introduction</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Overview</h2>
					</MotionDiv>

					<MotionP
						direction='right'
						delay={0.2}
						className='mx-auto mb-2 mt-4 max-w-3xl text-justify text-sm leading-6 text-secondary md:px-6 lg:mx-0 lg:text-lg xl:max-w-5xl'>
						{data.introduction}
					</MotionP>

					<ServiceCardComponent data={data.services} />

					<MotionDiv direction='right' delay={0.1} className='md:px-6'>
						<p className='text-xs uppercase tracking-wider text-secondary lg:text-base'>Introduction</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Education</h2>
					</MotionDiv>

					<MotionDiv direction='up' delay={0.2} className='mt-10 flex flex-col pb-40 lg:pb-12'>
						<EducationComponent data={data.educations} />
					</MotionDiv>
				</div>
			</div>
		</div>
	)
}

export default AboutPage
