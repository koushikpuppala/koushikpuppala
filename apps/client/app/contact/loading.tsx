import { Skeleton, SkeletonText } from 'ui/skeleton'
import { PageSkeleton } from 'components/skeletons'

const ContactLoading = () => {
	return (
		<PageSkeleton label='contact page'>
			<section className='pt-28 pb-24 sm:pt-32 lg:pt-36 lg:pb-32'>
				<div className='container-page grid gap-14 lg:grid-cols-12'>
					<div className='space-y-8 lg:col-span-5'>
						<Skeleton className='h-3 w-40' />
						<div className='space-y-3'>
							<Skeleton className='h-11 w-64 sm:h-14' />
							<Skeleton className='h-11 w-48 sm:h-14' />
						</div>
						<SkeletonText lines={3} className='max-w-md' />
						<Skeleton className='h-36 w-full rounded-2xl' />
						<div className='border-border divide-border divide-y rounded-2xl border'>
							{['a', 'b', 'c'].map(key => (
								<div key={key} className='flex items-center gap-3 px-4 py-3.5'>
									<Skeleton className='size-8 rounded-lg' />
									<div className='flex-1 space-y-2'>
										<Skeleton className='h-2.5 w-16' />
										<Skeleton className='h-3.5 w-40' />
									</div>
								</div>
							))}
						</div>
					</div>
					<div className='panel space-y-7 rounded-2xl p-7 sm:p-10 lg:col-span-7'>
						<Skeleton className='h-6 w-48' />
						<div className='flex flex-wrap gap-2'>
							{['a', 'b', 'c', 'd', 'e'].map(key => (
								<Skeleton key={key} className='h-9 w-36 rounded-full' />
							))}
						</div>
						<div className='grid gap-6 sm:grid-cols-2'>
							<Skeleton className='h-11 w-full rounded-lg' />
							<Skeleton className='h-11 w-full rounded-lg' />
						</div>
						<Skeleton className='h-11 w-full rounded-lg' />
						<Skeleton className='h-36 w-full rounded-lg' />
						<Skeleton className='h-12 w-full rounded-lg' />
					</div>
				</div>
			</section>
		</PageSkeleton>
	)
}

export default ContactLoading
