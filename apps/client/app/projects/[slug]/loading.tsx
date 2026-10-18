import { Skeleton, SkeletonText } from 'ui/skeleton'
import { PageSkeleton } from 'components/skeletons'

const ProjectLoading = () => {
	return (
		<PageSkeleton label='case study'>
			<section className='border-border border-b'>
				<div className='container-page pt-24 pb-14 sm:pt-28 lg:pt-32 lg:pb-16'>
					<Skeleton className='h-3 w-24' />
					<Skeleton className='mt-8 h-3 w-48' />
					<Skeleton className='mt-6 h-12 w-3/5 sm:h-16' />
					<Skeleton className='mt-4 h-6 w-96 max-w-full' />
					<SkeletonText lines={2} className='mt-7 max-w-2xl' lineClassName='h-4' />
					<div className='mt-9 flex gap-3'>
						<Skeleton className='h-11 w-36 rounded-lg' />
						<Skeleton className='h-11 w-32 rounded-lg' />
					</div>
					<div className='border-border mt-12 grid gap-6 border-t pt-8 sm:grid-cols-3'>
						{['a', 'b', 'c'].map(key => (
							<div key={key} className='space-y-2'>
								<Skeleton className='h-3 w-24' />
								<Skeleton className='h-4 w-36' />
							</div>
						))}
					</div>
				</div>
			</section>
			<div className='container-page -mt-px'>
				<Skeleton className='border-border aspect-4/3 w-full rounded-t-none rounded-b-2xl border-x border-b sm:aspect-video lg:aspect-21/9' />
			</div>
			<section className='pt-16 pb-20 lg:pt-24 lg:pb-28'>
				<div className='container-page grid gap-14 lg:grid-cols-12'>
					<div className='space-y-6 lg:col-span-7 xl:col-span-8'>
						<Skeleton className='h-3 w-28' />
						<SkeletonText lines={5} />
						<SkeletonText lines={4} />
					</div>
					<div className='panel h-fit space-y-5 rounded-2xl p-7 lg:col-span-5 xl:col-span-4'>
						<Skeleton className='h-3 w-20' />
						<div className='flex flex-wrap gap-2'>
							{['a', 'b', 'c', 'd', 'e'].map(key => (
								<Skeleton key={key} className='h-6 w-20 rounded-full' />
							))}
						</div>
						<Skeleton className='h-3 w-16' />
						<Skeleton className='h-4 w-28' />
						<Skeleton className='h-11 w-full rounded-lg' />
					</div>
				</div>
			</section>
			<div className='container-page pb-20'>
				<div className='border-border flex items-center justify-between gap-6 rounded-2xl border p-7 sm:p-10'>
					<div className='min-w-0 flex-1 space-y-3'>
						<Skeleton className='h-3 w-32' />
						<Skeleton className='h-7 w-80 max-w-full' />
						<Skeleton className='h-3.5 w-96 max-w-full' />
					</div>
					<Skeleton className='size-12 shrink-0 rounded-full' />
				</div>
			</div>
		</PageSkeleton>
	)
}

export default ProjectLoading
