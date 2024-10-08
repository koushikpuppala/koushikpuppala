'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { globalErrorProps } from '@import/types'

const GlobalError = ({ error, reset }: globalErrorProps) => {
	useEffect(() => {
		Sentry.captureException(error)
	}, [error])

	return (
		<main className='grid h-screen place-content-center place-items-center px-6 pb-12 pt-24 text-center sm:pb-16 sm:pt-32 lg:px-8'>
			<div className='text-center'>
				<h1 className='text-9xl font-black text-gray-700'>500</h1>

				<p className='text-2xl font-bold tracking-tight text-white sm:text-4xl'>Internal Server Error</p>

				<p className='mt-4 text-gray-400'>Something went wrong!</p>

				<button
					onClick={() => reset()}
					className='mt-6 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
					Reload the page
				</button>
			</div>
		</main>
	)
}

export default GlobalError
