'use client'

import Image from 'next/image'
import { MotionDiv } from '@import/components'
import { ServicesSchemaProps } from '@import/types'
import { Tilt } from 'react-tilt'
import { urlForImage } from '@import/sanity'

const ServiceCardComponent = ({ data }: { data: ServicesSchemaProps[] }) => {
	return (
		<div className='mt-10 flex flex-wrap justify-center gap-10 px-4 pb-16 lg:justify-normal lg:px-6'>
			{data.map(({ _id, title, image }, index) => (
				<Tilt key={_id} options={{ max: 45, scale: 1, speed: 450 }} className='w-full xs:w-60'>
					<MotionDiv
						direction='right'
						delay={index * 0.4}
						className='w-full rounded-2xl bg-violet-gradient p-px'>
						<div className='flex min-h-[280px] flex-col items-center justify-evenly rounded-2xl bg-tertiary px-12 py-5'>
							<Image
								src={urlForImage(image)}
								alt={title}
								width={512}
								height={512}
								priority={true}
								className='h-16 w-16 object-contain group-hover/card:shadow-xl'
							/>

							<h3 className='text-center text-lg font-bold text-white'>{title}</h3>
						</div>
					</MotionDiv>
				</Tilt>
			))}
		</div>
	)
}

export default ServiceCardComponent
