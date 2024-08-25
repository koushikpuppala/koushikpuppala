import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getHomeDocument } from '@import/sanity'
import { FlipWords, Motion, SocialMediaLogo, TextGenerateEffect } from '@import/components'

const HomePage = async () => {
	const data = await getHomeDocument()

	if (!data) return notFound()

	return (
		<div className='h-full bg-primary/50'>
			<div className='h-full w-full'>
				<div className='container mx-auto flex h-full flex-col justify-center text-center lg:text-left'>
					<Motion.h1 direction='down' delay={0.2} className='mb-4 text-accent'>
						{data.title} <span className='font-light leading-relaxed text-white/60'>{data.separator}</span>{' '}
						<FlipWords words={data.subtitles} className='text-accent' />
					</Motion.h1>
					<Motion.p
						direction='down'
						delay={0.3}
						className='mx-auto mb-2 max-w-sm lg:mx-0 lg:max-w-xl lg:text-justify'>
						{data.description.content}
						<TextGenerateEffect strings={data.description.extend} />
						{/* I'm always thinking about the next big thing. */}
					</Motion.p>
					<Motion.div direction='down' delay={0.4} className='mt-2 flex justify-center lg:justify-normal'>
						{data.social.map(({ _id, ...social }) => (
							<Link
								key={_id}
								href={social.url}
								target='_blank'
								rel='noreferrer'
								className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 align-middle text-base leading-none no-underline hover:bg-accent/50'>
								<span className='sr-only'>{social.platform}</span>
								<SocialMediaLogo
									platform={social.platform}
									className='font-light leading-relaxed text-white'
								/>
							</Link>
						))}
					</Motion.div>
				</div>
			</div>
		</div>
	)
}

export default HomePage
