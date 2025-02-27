'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaCircle } from 'react-icons/fa6'
import { monthYear } from '@import/constant'
import { urlForImage } from '@import/sanity'
import { ExperienceSchema } from '@import/types'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'

const Experience = ({ data }: { data: ExperienceSchema[] }) => {
	return (
		<VerticalTimeline>
			{data.map(({ _rev, ...experience }, index) => (
				<VerticalTimelineElement
					key={_rev}
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
						<p className='text-secondary text-[16px] font-semibold' style={{ margin: 0 }}>
							{experience.company}
						</p>
					</div>

					<ul className='mt-5 ml-2 list-disc space-y-2'>
						{experience.description.map((description, index) => (
							<li
								key={index}
								className='text-white-100 line-clamp-2 text-sm tracking-wider hover:line-clamp-none'>
								<span>
									<FaCircle fontSize={5} className='text-secondary mr-3 inline-block' />
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

export default Experience
