import Link from 'next/link'
import { SocialMedia } from '@import/constant'
import { MotionDiv, MotionH1, MotionP, TypesComponent } from '@import/components'

const HomePage = () => {
	return (
		<div className='h-full bg-primary/60'>
			<div className='h-full w-full bg-gradient-to-r from-primary/10 via-black/30 to-black/10'>
				<div className='container mx-auto flex h-full flex-col justify-center text-center lg:text-left'>
					<MotionH1
						direction='down'
						delay={0.2}
						className='h1 mb-4 text-accent'>
						Koushik Puppala <span className='font-light leading-relaxed text-white/60'>|</span>{' '}
						<TypesComponent />
					</MotionH1>
					<MotionP
						direction='down'
						delay={0.3}
						className='mx-auto mb-2 max-w-sm lg:mx-0 lg:max-w-xl lg:text-justify'>
						Full-stack developer by day, dreamer by night. I believe that technology has the power to make
						the <TypesComponent once={true} />
						{/* I'm always thinking about the next big thing. */}
					</MotionP>
					<MotionDiv
						direction='down'
						delay={0.4}
						className='mt-2 flex justify-center lg:justify-normal'>
						{SocialMedia.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								target='_blank'
								rel='noreferrer'
								className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 align-middle text-base leading-none no-underline hover:bg-accent/50'>
								<span className='sr-only'>{item.name}</span>
								<item.icon className='font-light leading-relaxed text-white' />
							</Link>
						))}
					</MotionDiv>
				</div>
			</div>
		</div>
	)
}

export default HomePage
