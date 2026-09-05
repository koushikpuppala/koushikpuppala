import { PageContainer } from 'ui/container'
import { Surface } from 'ui/surface'

export default function ProjectLoading() {
	return (
		<main className='min-h-screen bg-background text-foreground pt-24 sm:pt-28 pb-16'>
			<PageContainer className='space-y-12 sm:space-y-16 animate-pulse'>
				{/* Top Bar Skeleton */}
				<div className='flex items-center justify-between'>
					<div className='h-4 w-40 rounded bg-surface-strong/60' />
					<div className='h-6 w-28 rounded-full bg-surface-strong/60' />
				</div>

				{/* Title Skeleton */}
				<div className='space-y-4'>
					<div className='h-4 w-32 rounded bg-surface-strong/60' />
					<div className='h-12 w-3/4 rounded-xl bg-surface-strong/80' />
					<div className='h-6 w-1/2 rounded bg-surface-strong/50' />
					<div className='h-16 w-full max-w-2xl rounded-lg bg-surface/60' />
				</div>

				{/* Metadata Strip Skeleton */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-border/60 bg-surface/40'>
					{[0, 1, 2, 3].map(i => (
						<div key={i} className='space-y-2'>
							<div className='h-3 w-16 rounded bg-surface-strong/50' />
							<div className='h-5 w-24 rounded bg-surface-strong/70' />
						</div>
					))}
				</div>

				{/* Visual Canvas Skeleton */}
				<div className='relative aspect-[21/9] w-full rounded-2xl border border-border/60 bg-surface-strong/40' />

				{/* Case Study Section Skeleton */}
				<Surface
					variant='bordered'
					className='p-8 rounded-2xl border border-border/60 bg-surface/40 space-y-4'>
					<div className='h-4 w-36 rounded bg-surface-strong/60' />
					<div className='h-8 w-64 rounded bg-surface-strong/80' />
					<div className='space-y-2 pt-2'>
						<div className='h-4 w-full rounded bg-surface/70' />
						<div className='h-4 w-5/6 rounded bg-surface/70' />
						<div className='h-4 w-4/6 rounded bg-surface/70' />
					</div>
				</Surface>
			</PageContainer>
		</main>
	)
}
