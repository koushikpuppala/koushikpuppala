import { Metadata } from 'next'
import { config } from '@import/config'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { ContactComponent, MotionDiv, MotionP } from '@import/components'

export const metadata: Metadata = {
	title: 'Contact',
	openGraph: { title: 'Contact' },
	twitter: { title: 'Contact' },
	alternates: { canonical: 'https://koushikpuppala.com/contact' },
}

const ContactPage = () => {
	return (
		<div className='h-full bg-primary/50'>
			<div className='h-full w-full overflow-y-auto'>
				<div className='container mx-auto h-full items-center py-6 text-left md:py-12 lg:py-24'>
					<MotionDiv direction='right' delay={0.1} className='md:px-6'>
						<p className='text-xs uppercase tracking-wider text-secondary lg:text-base'>Get in touch</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Contact</h2>
					</MotionDiv>

					<MotionP
						direction='right'
						delay={0.2}
						className='mx-auto mb-2 mt-4 max-w-3xl text-justify text-sm leading-6 text-secondary md:px-6 lg:mx-0 lg:text-lg xl:max-w-5xl'>
						I&apos;m currently looking for new opportunities, my inbox is always open. Whether you have a
						question or just want to say hi, I&apos;ll try my best to get back to you!
					</MotionP>

					<MotionDiv
						direction='right'
						delay={0.3}
						className='mx-auto mt-4 max-w-3xl pb-40 text-justify text-sm leading-6 text-secondary md:px-6 lg:mx-0 lg:pb-12 lg:text-lg xl:max-w-5xl'>
						<ReCaptchaProvider reCaptchaKey={config.reCaptchaSiteKey}>
							<ContactComponent />
						</ReCaptchaProvider>
					</MotionDiv>
				</div>
			</div>
		</div>
	)
}

export default ContactPage
