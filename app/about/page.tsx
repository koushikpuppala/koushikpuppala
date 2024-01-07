import { EducationComponent, MotionDiv, MotionP, ServiceCardComponent } from '@import/components'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'About',
	openGraph: {
		title: 'About',
	},
	twitter: {
		title: 'About',
	},
}

const AboutPage = () => {
	return (
		<div className='h-full bg-primary/30'>
			<div className='h-full w-full bg-gradient-to-r from-primary/10 via-black/30 to-black/10'>
				<div className='container mx-auto h-full items-center overflow-y-auto py-6 text-left md:py-12 lg:py-24'>
					<MotionDiv
						direction='right'
						delay={0.1}
						className='md:px-6'>
						<p className='text-xs uppercase tracking-wider text-secondary lg:text-base'>Introduction</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Overview</h2>
					</MotionDiv>

					<MotionP
						direction='right'
						delay={0.2}
						className='mx-auto mb-2 mt-4 max-w-3xl text-justify text-sm leading-6 text-secondary md:px-6 lg:mx-0 lg:text-lg xl:max-w-5xl'>
						I am pursuing my B.Tech in Computer Science and Engineering at the Indian Institute of
						Information Technology, Raichur. As a passionate full-stack web developer, I regularly work in
						that capacity and lead my institute's website team. Currently, I am working on fascinating
						projects that include the creation of a Discord bot and many full-stack web apps. My expertise
						has given me a good understanding of front-end and back-end technologies, allowing me to design
						unique, user-friendly software solutions. I am careful and strive for perfection in whatever I
						do. As I progress, I am excited to professionally apply my abilities and expertise as a
						full-stack developer.
					</MotionP>
					<ServiceCardComponent />

					<MotionDiv
						direction='right'
						delay={0.1}
						className='md:px-6'>
						<p className='text-xs uppercase tracking-wider text-secondary lg:text-base'>Introduction</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Education</h2>
					</MotionDiv>

					<MotionDiv
						direction='up'
						delay={0.2}
						className='mt-10 flex flex-col pb-16 lg:pb-0'>
						<EducationComponent />
					</MotionDiv>
				</div>
			</div>
		</div>
	)
}

export default AboutPage
