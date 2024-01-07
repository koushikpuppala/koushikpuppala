'use client'

import { EducationData } from '@import/constant'
import Image from 'next/image'
import Link from 'next/link'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'

const EducationComponent = () => {
	return (
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
								priority={true}
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
	)
}

export default EducationComponent
