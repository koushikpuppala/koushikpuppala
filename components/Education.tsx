'use client'

import Link from 'next/link'
import Image from 'next/image'
import { monthYear } from '@import/constant'
import { urlForImage } from '@import/sanity'
import { EducationSchema } from '@import/types'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'

const Education = ({ data }: { data: EducationSchema[] }) => {
	return (
		<VerticalTimeline>
			{data.map(({ _key, ...education }) => (
				<VerticalTimelineElement
					key={_key}
					contentStyle={{ background: '#1D1836', color: '#E6DEDD' }}
					contentArrowStyle={{ borderRight: '10px solid #1D1836' }}
					date={`${monthYear(education.startDate)} - ${education.current ? `Present (Until ${monthYear(education.expectedDate)})` : monthYear(education.endDate)}`}
					visible={true}
					iconStyle={{ background: '#E6DEDD' }}
					icon={
						<Link
							href={education.website}
							target='_blank'
							className='flex h-full w-full items-center justify-center'>
							<Image
								src={urlForImage(education.image)}
								alt={education.university}
								priority={true}
								width={512}
								height={512}
								className='h-3/5 w-3/5 object-contain bg-blend-color-dodge'
							/>
							<span className='sr-only'>{education.university} Logo</span>
						</Link>
					}>
					<div>
						<h3 className='text-[24px] font-bold text-white'>{education.degree}</h3>
						<p className='text-[16px] font-semibold text-secondary' style={{ margin: 0 }}>
							{education.university}
						</p>
					</div>
				</VerticalTimelineElement>
			))}
		</VerticalTimeline>
	)
}

export default Education
