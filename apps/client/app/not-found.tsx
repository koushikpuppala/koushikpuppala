import Link from 'next/link'
import { PageContainer } from 'ui/container'
import { Surface } from 'ui/surface'
import { SignalArrow } from 'ui/motion'
import { PublicFooter } from '../components/footer'

export default function RootNotFound() {
	return (
		<main className='min-h-screen bg-background text-foreground flex flex-col justify-between pt-28 pb-12'>
			<PageContainer className='max-w-2xl mx-auto text-center space-y-8 my-auto'>
				<Surface
					variant='bordered'
					className='p-8 sm:p-12 rounded-2xl border border-border/80 bg-surface/60 backdrop-blur-md space-y-6'>
					<div className='inline-flex items-center gap-2 font-mono text-xs text-signal font-semibold uppercase tracking-widest'>
						<span className='h-2 w-2 rounded-full bg-signal animate-pulse' aria-hidden='true' />
						<span>ERROR 404 {'//'} ROUTE NOT FOUND</span>
					</div>

					<div className='space-y-3'>
						<h1 className='text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground'>
							System Coordinate Unavailable
						</h1>
						<p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
							The requested page coordinate could not be located in the portfolio directory. It may
							have been moved, updated, or removed.
						</p>
					</div>

					<div className='pt-2 flex justify-center'>
						<Link
							href='/'
							className='group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-signal text-signal-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-95 shadow-lg shadow-signal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
							<span aria-hidden='true'>←</span>
							<span>RETURN TO PORTFOLIO</span>
							<SignalArrow size={12} />
						</Link>
					</div>
				</Surface>
			</PageContainer>

			<PublicFooter />
		</main>
	)
}
