'use client'

import { fadeIn } from '@import/actions'
import { EducationData } from '@import/constant'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'

const EducationComponent = () => {
	return (
		<>
			<motion.div
				variants={fadeIn('right', 0.1)}
				initial='hidden'
				animate='show'
				exit='hidden'
				className='md:px-6'>
				<p className='text-xs uppercase tracking-wider text-secondary lg:text-base'>Introduction</p>
				<h2 className='text-3xl font-black text-white lg:text-5xl'>Education</h2>
			</motion.div>

			<motion.div
				variants={fadeIn('up', 0.2)}
				initial='hidden'
				animate='show'
				exit='hidden'
				className='mt-10 flex flex-col pb-16 lg:pb-0'>
				<VerticalTimeline>
					{EducationData.map((education, index) => (
						<VerticalTimelineElement
							key={index}
							contentStyle={{
								background: '#1d1836',
								color: '#fff',
							}}
							contentArrowStyle={{ borderRight: '10px solid #1d1836' }}
							date={education.date}
							visible={true}
							iconStyle={{ background: education.iconBg }}
							icon={
								<Link
									href={education.link}
									target='_blank'
									className='flex h-full w-full items-center justify-center'>
									<Image
										src={education.icon}
										alt={education.college_name}
										className='h-3/5 w-3/5 object-contain bg-blend-color-dodge'
									/>
									<span className='sr-only'>{education.college_name} Logo</span>
								</Link>
							}>
							<div>
								<h3 className='text-[24px] font-bold text-white'>{education.title}</h3>
								<p
									className='text-[16px] font-semibold text-secondary'
									style={{ margin: 0 }}>
									{education.college_name}
								</p>
							</div>
						</VerticalTimelineElement>
					))}
				</VerticalTimeline>
			</motion.div>
		</>
	)
}

export default EducationComponent
