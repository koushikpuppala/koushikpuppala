'use client'

import { ProjectsData } from '@import/constant'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaGlobe } from 'react-icons/fa6'
import { Tilt } from 'react-tilt'
import { MotionDiv } from '@import/components'

const ProjectCardComponent = () => {
	return (
		<div className='mt-10 flex flex-wrap justify-center gap-10 px-4 pb-24 lg:justify-normal lg:px-6 lg:pb-12'>
			{ProjectsData.map(({ title, subtitle, description, tags, image, source_code_link, website }, index) => (
				<Tilt
					key={index}
					options={{
						max: 45,
						scale: 1,
						speed: 450,
					}}>
					<MotionDiv
						direction='right'
						delay={index * 0.4}
						className='shadow-card w-full rounded-2xl bg-green-pink-gradient p-px'>
						<div className='w-full rounded-2xl bg-tertiary p-5 sm:w-80'>
							<div className='relative h-44 w-full'>
								<Image
									src={image}
									alt='project_image'
									className='h-full w-full rounded-2xl object-cover'
								/>

								<div className='card-img_hover absolute inset-0 m-3 flex justify-end gap-1'>
									{source_code_link && (
										<Link
											href={`https://koushikpuppala.com/github/${source_code_link}`}
											target='_blank'
											className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient'>
											<span className='sr-only'>Source Code</span>
											<FaGithub size={16} />
										</Link>
									)}
									{website && (
										<Link
											href={website}
											target='_blank'
											className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient'>
											<span className='sr-only'>Website</span>
											<FaGlobe size={16} />
										</Link>
									)}
								</div>
							</div>

							<div className='mt-5'>
								<h3 className='line-clamp-1 text-2xl font-bold text-white'>{title}</h3>
								<p className='mt-2 line-clamp-1 text-sm text-secondary'>{subtitle}</p>
								<p className='mt-2 line-clamp-3 text-sm text-secondary'>
									{description
										.map(content => {
											return content
										})
										.join(' ')}
								</p>
							</div>

							<div className='mt-4 flex flex-wrap gap-2'>
								{tags.map(tag => (
									<p
										key={`${title}-${tag.name}`}
										className={`text-sm ${tag.color}`}>
										#{tag.name}
									</p>
								))}
							</div>
						</div>
					</MotionDiv>
				</Tilt>
			))}
		</div>
	)
}

export default ProjectCardComponent
