'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import { Surface } from 'ui/surface'
import { PageContainer } from 'ui/container'

export default function RootError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		Sentry.captureException(error)
	}, [error])

	return (
		<main className='bg-background text-foreground flex min-h-screen flex-col justify-between pt-28 pb-12'>
			<PageContainer className='mx-auto my-auto max-w-2xl space-y-8 text-center'>
				<Surface
					variant='bordered'
					className='border-border/80 bg-surface/60 space-y-6 rounded-2xl border p-8 backdrop-blur-md sm:p-12'>
					<div className='text-signal inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest uppercase'>
						<span className='bg-signal h-2 w-2 animate-pulse rounded-full' aria-hidden='true' />
						<span>SYSTEM FAULT {'//'} RENDER ERROR</span>
					</div>

					<div className='space-y-3'>
						<h1 className='font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
							Unexpected Execution Interruption
						</h1>
						<p className='text-muted-foreground text-sm leading-relaxed sm:text-base'>
							An unexpected application state prevented this view from rendering. Our observability
							pipeline has logged this event.
						</p>
						{error.digest ? (
							<p className='text-muted-foreground/60 font-mono text-xs'>
								Fault Signature: {error.digest}
							</p>
						) : null}
					</div>

					<div className='flex flex-wrap items-center justify-center gap-4 pt-2'>
						<button
							type='button'
							onClick={() => reset()}
							className='bg-signal text-signal-foreground shadow-signal/20 focus-visible:ring-signal inline-flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3.5 font-mono text-xs font-semibold tracking-wider uppercase shadow-lg transition-all duration-200 hover:opacity-95 focus-visible:ring-2 focus-visible:outline-none'>
							<span>RETRY EXECUTION</span>
						</button>
						<Link
							href='/'
							className='border-border bg-surface text-foreground hover:bg-surface-hover focus-visible:ring-signal inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none'>
							<span>RETURN TO HOME</span>
						</Link>
					</div>
				</Surface>
			</PageContainer>
		</main>
	)
}
