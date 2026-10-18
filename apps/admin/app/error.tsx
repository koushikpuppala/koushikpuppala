'use client'

import type { ErrorPageProps } from 'types/components'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from 'ui/button'

const AdminRootError = ({ error, reset }: ErrorPageProps) => {
	useEffect(() => {
		console.error('[CMS Studio Runtime Error]', error)
	}, [error])

	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-6 text-center'>
			<div className='border-border/80 bg-surface/60 max-w-lg space-y-6 rounded-2xl border p-8 backdrop-blur-md sm:p-10'>
				<div className='text-signal inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest uppercase'>
					<span className='bg-signal size-2 animate-pulse rounded-full' aria-hidden='true' />
					<span>CMS FAULT {'//'} RENDER ERROR</span>
				</div>

				<div className='space-y-3'>
					<h1 className='text-foreground font-display text-2xl font-bold tracking-tight sm:text-3xl'>
						Studio Execution Error
					</h1>
					<p className='text-muted-foreground text-sm leading-relaxed'>
						An unexpected error occurred while loading this administrative view.
					</p>
					{error.digest ? (
						<p className='text-muted-foreground/60 font-mono text-xs'>Digest: {error.digest}</p>
					) : null}
				</div>

				<div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
					<Button variant='signal' onClick={() => reset()} className='font-mono text-xs uppercase'>
						Retry View
					</Button>
					<Button variant='outline' asChild className='font-mono text-xs uppercase'>
						<Link href='/'>Return to Dashboard</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}

export default AdminRootError
