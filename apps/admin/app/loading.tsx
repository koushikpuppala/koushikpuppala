export default function AdminRootLoading() {
	return (
		<div className='space-y-6 p-6 sm:p-8 animate-pulse'>
			{/* Header Skeleton */}
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div className='space-y-2'>
					<div className='h-3 w-28 rounded bg-muted/60' />
					<div className='h-7 w-48 rounded-lg bg-muted/80' />
				</div>
				<div className='h-9 w-32 rounded-lg bg-muted/60' />
			</div>

			{/* Metric Cards Skeleton */}
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{[0, 1, 2, 3].map(i => (
					<div
						key={i}
						className='border-border/60 bg-surface/40 space-y-3 rounded-xl border p-4 sm:p-5'>
						<div className='flex items-center justify-between'>
							<div className='h-3 w-20 rounded bg-muted/60' />
							<div className='size-7 rounded-lg bg-muted/50' />
						</div>
						<div className='h-7 w-24 rounded bg-muted/80' />
						<div className='h-3 w-32 rounded bg-muted/40' />
					</div>
				))}
			</div>

			{/* Table or Content Area Skeleton */}
			<div className='border-border/60 bg-surface/40 space-y-4 rounded-xl border p-6'>
				<div className='flex items-center justify-between'>
					<div className='h-4 w-36 rounded bg-muted/60' />
					<div className='h-8 w-44 rounded-lg bg-muted/50' />
				</div>
				<div className='space-y-3 pt-2'>
					<div className='h-10 w-full rounded-lg bg-muted/40' />
					<div className='h-10 w-full rounded-lg bg-muted/30' />
					<div className='h-10 w-full rounded-lg bg-muted/40' />
					<div className='h-10 w-full rounded-lg bg-muted/30' />
				</div>
			</div>
		</div>
	)
}
