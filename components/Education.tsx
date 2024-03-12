'use client'

import { EducationData } from '@import/constant'
import Image from 'next/image'
import Link from 'next/link'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'

const EducationComponent = () => {
	return (
		<VerticalTimeline>
			{EducationData.map(({ degree, college, startDate, endDate, image, imageBackground, website }, index) => (
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
						<Link href={website} target='_blank' className='flex h-full w-full items-center justify-center'>
							<Image
								src={image}
								alt={college}
								priority={true}
								className='h-3/5 w-3/5 object-contain bg-blend-color-dodge'
							/>
							<span className='sr-only'>{college} Logo</span>
						</Link>
					}>
					<div>
						<h3 className='text-[24px] font-bold text-white'>{degree}</h3>
						<p className='text-[16px] font-semibold text-secondary' style={{ margin: 0 }}>
							{college}
						</p>
					</div>
				</VerticalTimelineElement>
			))}
		</VerticalTimeline>
	)
}

export default EducationComponent
