// import Link from 'next/link'
import { notFound } from 'next/navigation'

const HomePage = async () => {
	const data = null

	if (!data) return notFound()

	return (
		<div className='bg-primary/50 h-full'>
			{/* <div className='h-full w-full'>
				<div className='container mx-auto flex h-full flex-col justify-center text-center lg:text-left'>
					<Motion.h1 direction='down' delay={0.2} className='text-accent mb-4'>
						{data.title} <span className='leading-relaxed font-light text-white/60'>{data.separator}</span>{' '}
						<FlipWords words={data.subtitles} className='text-accent' />
					</Motion.h1>
					<Motion.p
						direction='down'
						delay={0.3}
						className='mx-auto mb-2 max-w-sm lg:mx-0 lg:max-w-xl lg:text-justify'>
						{data.description.content}
						<TextGenerateEffect strings={data.description.extend} />
						I'm always thinking about the next big thing.
					</Motion.p>
					<Motion.div direction='down' delay={0.4} className='mt-2 flex justify-center lg:justify-normal'>
						{data.social.map(({ _id, ...social }) => (
							<Link
								key={_id}
								href={social.url}
								target='_blank'
								rel='noreferrer'
								className='hover:bg-accent/50 mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 align-middle text-base leading-none no-underline'>
								<span className='sr-only'>{social.platform}</span>
								<SocialMediaLogo
									platform={social.platform}
									className='leading-relaxed font-light text-white'
								/>
							</Link>
						))}
					</Motion.div>
				</div>
			</div> */}
		</div>
	)
}

export default HomePage
