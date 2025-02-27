import Image from 'next/image'
import { urlForImage } from '@import/sanity'
import { ServicesSchema } from '@import/types'
import { CardBody, CardContainer, Motion } from '@import/components'

const ServiceCard = ({ data }: { data: ServicesSchema[] }) => {
	return (
		<div className='mt-10 flex flex-wrap justify-center gap-10 px-4 pb-16 lg:justify-normal lg:px-6'>
			{data.map(({ _key, title, image }, index) => (
				<Motion.div key={_key} direction='right' delay={index * 0.2} className='xs:w-60 w-full'>
					<CardContainer
						className='group/card bg-quaternary w-full cursor-pointer rounded-2xl'
						options={{ max: 45, scale: 1, speed: 450 }}>
						<CardBody className='bg-violet-gradient w-full rounded-2xl p-px'>
							<div className='bg-tertiary flex min-h-[280px] flex-col items-center justify-evenly rounded-2xl px-12 py-5'>
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
						</CardBody>
					</CardContainer>
				</Motion.div>
			))}
		</div>
	)
}

export default ServiceCard
