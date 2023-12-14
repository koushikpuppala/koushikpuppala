'use client'

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { ExperienceData } from '@import/constant'
import { FaCircle } from 'react-icons/fa6'
import { fadeIn } from '@import/actions'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

import 'react-vertical-timeline-component/style.min.css'

const ExperienceComponent = () => {
	return (
		<>
			<motion.div
				variants={fadeIn('right', 0.2)}
				initial='hidden'
				animate='show'
				exit='hidden'
				className='md:px-6'>
				<p className='text-center text-xs uppercase tracking-wider text-secondary lg:text-base'>
					What I have done so far
				</p>
				<h2 className='text-center text-3xl font-black text-white lg:text-5xl'>Work Experience</h2>
			</motion.div>

			<motion.div
				variants={fadeIn('up', 0.2)}
				initial='hidden'
				animate='show'
				exit='hidden'
				className='mt-10 flex flex-col pb-16 lg:pb-0'>
				<VerticalTimeline>
					{ExperienceData.map((experience, index) => (
						<VerticalTimelineElement
							key={index}
							contentStyle={{
								background: '#1d1836',
								color: '#fff',
							}}
							contentArrowStyle={{ borderRight: '10px solid #1d1836' }}
							date={experience.date}
							visible={true}
							iconStyle={{ background: experience.iconBg }}
							icon={
								<Link
									href={experience.link}
									target='_blank'
									className='flex h-full w-full items-center justify-center'>
									<Image
										src={experience.icon}
										alt={experience.company_name}
										className='h-3/5 w-3/5 object-contain'
									/>
									<span className='sr-only'>{experience.company_name} Logo</span>
								</Link>
							}>
							<div>
								<h3 className='text-[24px] font-bold text-white'>{experience.title}</h3>
								<p
									className='text-[16px] font-semibold text-secondary'
									style={{ margin: 0 }}>
									{experience.company_name}
								</p>
							</div>

							<ul className='ml-2 mt-5 list-disc space-y-2'>
								{experience.points.map((point, index) => (
									<li
										key={index}
										className='line-clamp-2 text-sm tracking-wider text-white-100 hover:line-clamp-none'>
										<span>
											<FaCircle
												fontSize={5}
												className='mr-3 inline-block text-secondary'
											/>
											{point}
										</span>
									</li>
								))}
							</ul>
						</VerticalTimelineElement>
					))}
				</VerticalTimeline>
			</motion.div>
		</>
	)
}

export default ExperienceComponent
