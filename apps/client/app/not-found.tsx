import Link from 'next/link'
import { Surface } from 'ui/surface'
import { SignalArrow } from 'ui/motion'
import { PageContainer } from 'ui/container'

export default function RootNotFound() {
	return (
		<main className='bg-background text-foreground flex min-h-screen flex-col justify-between pt-28 pb-12'>
			<PageContainer className='mx-auto my-auto max-w-2xl space-y-8 text-center'>
				<Surface
					variant='bordered'
					className='border-border/80 bg-surface/60 space-y-6 rounded-2xl border p-8 backdrop-blur-md sm:p-12'>
					<div className='text-signal inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest uppercase'>
						<span className='bg-signal h-2 w-2 animate-pulse rounded-full' aria-hidden='true' />
						<span>ERROR 404 {'//'} ROUTE NOT FOUND</span>
					</div>

					<div className='space-y-3'>
						<h1 className='font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
							System Coordinate Unavailable
						</h1>
						<p className='text-muted-foreground text-sm leading-relaxed sm:text-base'>
							The requested page coordinate could not be located in the portfolio directory. It may
							have been moved, updated, or removed.
						</p>
					</div>

					<div className='flex justify-center pt-2'>
						<Link
							href='/'
							className='group bg-signal text-signal-foreground shadow-signal/20 focus-visible:ring-signal inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 font-mono text-xs font-semibold tracking-wider uppercase shadow-lg transition-all duration-200 hover:opacity-95 focus-visible:ring-2 focus-visible:outline-none'>
							<span aria-hidden='true'>←</span>
							<span>RETURN TO PORTFOLIO</span>
							<SignalArrow size={12} />
						</Link>
					</div>
				</Surface>
			</PageContainer>
		</main>
	)
}
