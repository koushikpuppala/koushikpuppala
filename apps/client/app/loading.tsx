import { PageContainer } from 'ui/container'

export default function RootLoading() {
	return (
		<main className='bg-background text-foreground min-h-screen pt-24 pb-16 sm:pt-28'>
			<PageContainer className='animate-pulse space-y-12 sm:space-y-16'>
				{/* Header Skeleton */}
				<div className='space-y-4'>
					<div className='bg-surface-strong/60 h-4 w-32 rounded' />
					<div className='bg-surface-strong/80 h-10 w-3/4 max-w-xl rounded-xl' />
					<div className='bg-surface-strong/50 h-5 w-1/2 max-w-md rounded' />
				</div>

				{/* Content Grid Skeleton */}
				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{[0, 1, 2, 3, 4, 5].map(i => (
						<div
							key={i}
							className='border-border/60 bg-surface/40 h-64 space-y-4 rounded-2xl border p-6'>
							<div className='bg-surface-strong/50 h-4 w-24 rounded' />
							<div className='bg-surface-strong/70 h-6 w-3/4 rounded' />
							<div className='space-y-2 pt-2'>
								<div className='bg-surface/60 h-3 w-full rounded' />
								<div className='bg-surface/60 h-3 w-5/6 rounded' />
							</div>
						</div>
					))}
				</div>
			</PageContainer>
		</main>
	)
}
