import Image from 'next/image'
import { CardBody, CardContainer, MotionDiv } from '@import/components'
import { ServicesSchemaProps } from '@import/types'
import { urlForImage } from '@import/sanity'

const ServiceCardComponent = ({ data }: { data: ServicesSchemaProps[] }) => {
	return (
		<div className='mt-10 flex flex-wrap justify-center gap-10 px-4 pb-16 lg:justify-normal lg:px-6'>
			{data.map(({ _key, title, image }, index) => (
				<MotionDiv key={_key} direction='right' delay={index * 0.2} className='w-full xs:w-60'>
					<CardContainer
						className='group/card w-full cursor-pointer rounded-2xl bg-quaternary'
						options={{ max: 45, scale: 1, speed: 450 }}>
						<CardBody className='w-full rounded-2xl bg-violet-gradient p-px'>
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
						</CardBody>
					</CardContainer>
				</MotionDiv>
			))}
		</div>
	)
}

export default ServiceCardComponent
