'use client'

import type { GlobalErrorProps } from 'types/app'

import * as Sentry from '@sentry/nextjs'
import { Animation } from 'components'
import { useEffect } from 'react'

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
	useEffect(() => {
		Sentry.captureException(error)
	}, [error])

	return (
		<main className='flex h-screen flex-col place-content-center place-items-center text-center'>
			<Animation.h1 direction='down' delay={0.1} className='text-9xl font-black text-gray-700'>
				500
			</Animation.h1>

			<Animation.p
				direction='down'
				delay={0.2}
				className='text-2xl font-bold tracking-tight text-white sm:text-4xl'>
				Internal Server Error
			</Animation.p>

			<Animation.p direction='down' delay={0.3} className='text-gray-400'>
				Something went wrong!
			</Animation.p>

			<Animation.div direction='down' delay={0.4}>
				<button
					onClick={() => reset()}
					className='mt-2 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
					Reload the page
				</button>
			</Animation.div>
		</main>
	)
}

export default GlobalError
