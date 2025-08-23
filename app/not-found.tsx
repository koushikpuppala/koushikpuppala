import type { Metadata } from 'next'

import Link from 'next/link'
import { Animation } from 'components'

export const metadata: Metadata = {
	title: '404 | Page Not Found',
	openGraph: { title: '404 | Page Not Found' },
	twitter: { title: '404 | Page Not Found' },
}

const NotFoundPage = () => {
	return (
		<main className='flex h-screen flex-col place-content-center place-items-center text-center'>
			<Animation.h1 direction='down' delay={0.1} className='text-9xl font-black text-gray-700'>
				404
			</Animation.h1>

			<Animation.p
				direction='down'
				delay={0.2}
				className='text-2xl font-bold tracking-tight text-white sm:text-4xl'>
				Page not found
			</Animation.p>

			<Animation.p direction='down' delay={0.3} className='text-gray-400'>
				Sorry, we couldn&apos;t find the page you&apos;re looking for.
			</Animation.p>

			<Animation.div direction='down' delay={0.4}>
				<Link
					href='/'
					className='mt-2 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
					Go back home
				</Link>
			</Animation.div>
		</main>
	)
}

export default NotFoundPage
