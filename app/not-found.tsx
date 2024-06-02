import { MotionDiv, MotionH1, MotionP } from '@import/components'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: '404 | Page Not Found',
	openGraph: {
		title: '404 | Page Not Found',
	},
	twitter: {
		title: '404 | Page Not Found',
	},
}

const NotFoundPage = () => {
	return (
		<main className='grid h-screen place-content-center place-items-center px-6 pb-12 pt-24 text-center sm:pb-16 sm:pt-32 lg:px-8'>
			<div className='text-center'>
				<MotionH1 direction='down' delay={0.1} className='text-9xl font-black text-gray-700'>
					404
				</MotionH1>

				<MotionP
					direction='down'
					delay={0.2}
					className='text-2xl font-bold tracking-tight text-white sm:text-4xl'>
					Page not found
				</MotionP>

				<MotionP direction='down' delay={0.3} className='mt-4 text-gray-400'>
					Sorry, we couldn&apos;t find the page you&apos;re looking for.
				</MotionP>

				<MotionDiv direction='down' delay={0.4}>
					<Link
						href='/'
						className='mt-6 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
						Go back home
					</Link>
				</MotionDiv>
			</div>
		</main>
	)
}

export default NotFoundPage
