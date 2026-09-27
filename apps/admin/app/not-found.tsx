import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
	title: 'Page Not Found',
	description: 'The requested administrative view or content collection could not be found.',
}

export default function AdminNotFound() {
	return (
		<div className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
			<div className='border-border/80 bg-surface/60 max-w-lg space-y-6 rounded-2xl border p-8 backdrop-blur-md sm:p-10'>
				<div className='text-signal inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest uppercase'>
					<span className='bg-signal size-2 animate-pulse rounded-full' aria-hidden='true' />
					<span>ERROR 404 {'//'} STUDIO VIEW NOT FOUND</span>
				</div>

				<div className='space-y-3'>
					<h1 className='text-foreground font-display text-2xl font-bold tracking-tight sm:text-3xl'>
						Studio Resource Missing
					</h1>
					<p className='text-muted-foreground text-sm leading-relaxed'>
						The requested administrative view or content collection could not be found. It may have been relocated or removed.
					</p>
				</div>

				<div className='flex justify-center pt-2'>
					<Button
						variant='signal'
						asChild
						className='font-mono text-xs uppercase'>
						<Link href='/'>Return to Dashboard</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
