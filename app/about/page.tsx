import { AboutComponent, ServiceCardComponent } from '@import/components'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'About',
	openGraph: {
		title: 'About',
	},
	twitter: {
		title: 'About',
	},
}

const AboutPage = () => {
	return (
		<div className='h-full bg-primary/30'>
			<div className='h-full w-full bg-gradient-to-r from-primary/10 via-black/30 to-black/10'>
				<div className='container mx-auto h-full items-center overflow-y-auto py-6 text-left md:py-12 lg:py-24'>
					<AboutComponent />

					<ServiceCardComponent />
				</div>
			</div>
		</div>
	)
}

export default AboutPage
