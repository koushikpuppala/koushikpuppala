import Link from 'next/link'
import {
	FlipWordsComponent,
	MotionDiv,
	MotionH1,
	MotionP,
	SocialMediaLogoComponent,
	TextGenerateEffectComponent,
} from '@import/components'
import { homeType, sanityQuery } from '@import/sanity'
import { HomeSchemaProps } from '@import/types'
import { notFound } from 'next/navigation'

export const revalidate = 300

const HomePage = async () => {
	const data: HomeSchemaProps | null = await sanityQuery(homeType)

	if (!data) return notFound()

	return (
		<div className='h-full bg-primary/50'>
			<div className='h-full w-full'>
				<div className='container mx-auto flex h-full flex-col justify-center text-center lg:text-left'>
					<MotionH1 direction='down' delay={0.2} className='mb-4 text-accent'>
						{data.title} <span className='font-light leading-relaxed text-white/60'>{data.separator}</span>{' '}
						<FlipWordsComponent words={data.subtitles} className='text-accent' />
					</MotionH1>
					<MotionP
						direction='down'
						delay={0.3}
						className='mx-auto mb-2 max-w-sm lg:mx-0 lg:max-w-xl lg:text-justify'>
						{data.description.content}
						<TextGenerateEffectComponent strings={data.description.extend} />
						{/* I'm always thinking about the next big thing. */}
					</MotionP>
					<MotionDiv direction='down' delay={0.4} className='mt-2 flex justify-center lg:justify-normal'>
						{data.social.map(({ _id, ...social }) => (
							<Link
								key={_id}
								href={social.url}
								target='_blank'
								rel='noreferrer'
								className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 align-middle text-base leading-none no-underline hover:bg-accent/50'>
								<span className='sr-only'>{social.platform}</span>
								<SocialMediaLogoComponent
									platform={social.platform}
									className='font-light leading-relaxed text-white'
								/>
							</Link>
						))}
					</MotionDiv>
				</div>
			</div>
		</div>
	)
}

export default HomePage
