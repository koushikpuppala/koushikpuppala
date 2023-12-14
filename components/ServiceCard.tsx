'use client'

import { fadeIn } from '@import/actions'
import { ServicesData } from '@import/constant'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Tilt } from 'react-tilt'

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
					<motion.div
						className='green-pink-gradient shadow-card w-full rounded-2xl p-px'
						variants={fadeIn('right', index * 0.4)}
						initial='hidden'
						animate='show'
						exit='hidden'>
						<div className='flex min-h-[280px] flex-col items-center justify-evenly rounded-2xl bg-tertiary px-12 py-5'>
							<Image
								src={icon}
								alt='web-development'
								className='h-16 w-16 object-contain'
							/>

							<h3 className='text-center text-lg font-bold text-white'>{title}</h3>
						</div>
					</motion.div>
				</Tilt>
			))}
		</div>
	)
}

export default ServiceCardComponent
