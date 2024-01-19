'use client'

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { ExperienceData } from '@import/constant'
import { FaCircle } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'

const ExperienceComponent = () => {
	return (
		<VerticalTimeline>
			{ExperienceData.map(
				({ role, company, startDate, endDate, descriptions, image, imageBackground, website }, index) => (
					<VerticalTimelineElement
						key={index}
						contentStyle={{
							background: '#1d1836',
							color: '#fff',
						}}
						contentArrowStyle={{ borderRight: '10px solid #1d1836' }}
						date={`${startDate} - ${endDate}`}
						visible={true}
						iconStyle={{ background: imageBackground }}
						icon={
							<Link
								href={website}
								target='_blank'
								className='flex h-full w-full items-center justify-center'>
								<Image
									src={image}
									alt={company}
									priority={true}
									className='h-3/5 w-3/5 object-contain'
								/>
								<span className='sr-only'>{company} Logo</span>
							</Link>
						}>
						<div>
							<h3 className='text-[24px] font-bold text-white'>{role}</h3>
							<p className='text-[16px] font-semibold text-secondary' style={{ margin: 0 }}>
								{company}
							</p>
						</div>

						<ul className='ml-2 mt-5 list-disc space-y-2'>
							{descriptions.map((description, index) => (
								<li
									key={index}
									className='line-clamp-2 text-sm tracking-wider text-white-100 hover:line-clamp-none'>
									<span>
										<FaCircle fontSize={5} className='mr-3 inline-block text-secondary' />
										{description}
									</span>
								</li>
							))}
						</ul>
					</VerticalTimelineElement>
				),
			)}
		</VerticalTimeline>
	)
}

export default ExperienceComponent
