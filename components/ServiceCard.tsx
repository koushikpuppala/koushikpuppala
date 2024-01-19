'use client'

import { ServicesData } from '@import/constant'
import Image from 'next/image'
import { Tilt } from 'react-tilt'
import { MotionDiv } from '@import/components'

const ServiceCardComponent = () => {
	return (
		<div className='mt-10 flex flex-wrap justify-center gap-10 px-4 pb-16 lg:justify-normal lg:px-6'>
			{ServicesData.map(({ title, icon }, index) => (
				<Tilt
					key={index}
					options={{
						max: 45,
						scale: 1,
						speed: 450,
					}}
					className='w-full xs:w-60'>
					<MotionDiv
						direction='right'
						delay={index * 0.4}
						className='w-full rounded-2xl bg-green-pink-gradient p-px'>
						<div className='flex min-h-[280px] flex-col items-center justify-evenly rounded-2xl bg-tertiary px-12 py-5'>
							<Image src={icon} alt={title} priority={true} className='h-16 w-16 object-contain' />

							<h3 className='text-center text-lg font-bold text-white'>{title}</h3>
						</div>
					</MotionDiv>
				</Tilt>
			))}
		</div>
	)
}

export default ServiceCardComponent
