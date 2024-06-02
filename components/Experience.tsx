'use client'

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { monthYear } from '@import/constant'
import { FaCircle } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'
import { ExperienceSchemaProps } from '@import/types'
import { urlForImage } from '@import/sanity'

const ExperienceComponent = ({ data }: { data: ExperienceSchemaProps[] }) => {
	return (
		<VerticalTimeline>
			{data.map(({ _id, ...experience }, index) => (
				<VerticalTimelineElement
					key={_id}
					contentStyle={{ background: '#1D1836', color: '#E6DEDD' }}
					contentArrowStyle={{ borderRight: '10px solid #1D1836' }}
					date={`${monthYear(experience.startDate)} - ${experience.current ? 'Present' : monthYear(experience.endDate)}`}
					visible={true}
					// iconStyle={{ background: experience.imageBackground }}
					iconStyle={{ background: index % 2 !== 0 ? '#E6DEDD' : '#1D1836' }}
					icon={
						<Link
							href={experience.website}
							target='_blank'
							className='flex h-full w-full items-center justify-center'>
							<Image
								src={urlForImage(experience.image)}
								alt={experience.company}
								priority={true}
								width={512}
								height={512}
								className='h-3/5 w-3/5 object-contain'
							/>
							<span className='sr-only'>{experience.company} Logo</span>
						</Link>
					}>
					<div>
						<h3 className='text-[24px] font-bold text-white'>{experience.position}</h3>
						<p className='text-[16px] font-semibold text-secondary' style={{ margin: 0 }}>
							{experience.company}
						</p>
					</div>

					<ul className='ml-2 mt-5 list-disc space-y-2'>
						{experience.description.map((description, index) => (
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
			))}
		</VerticalTimeline>
	)
}

export default ExperienceComponent
