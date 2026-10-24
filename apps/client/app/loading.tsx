import { Skeleton, SkeletonText } from 'ui/skeleton'
import {
	ContactCTASkeleton,
	FeaturedRowSkeleton,
	PageSkeleton,
	ProjectListSkeleton,
	SectionSkeleton,
	StackClustersSkeleton,
	TickerSkeleton,
	TimelineSkeleton,
} from 'components/skeletons'

const HomeLoading = () => {
	return (
		<PageSkeleton label='home page'>
			<section className='border-border relative overflow-hidden'>
				<div className='container-page pt-28 pb-16 sm:pt-32 lg:pt-40'>
					<Skeleton className='h-3 w-72 max-w-full' />
					<div className='mt-10 grid gap-12 lg:grid-cols-12'>
						<div className='space-y-6 lg:col-span-7 xl:col-span-8'>
							<Skeleton className='h-16 w-4/5 sm:h-24' />
							<Skeleton className='h-16 w-3/5 sm:h-24' />
							<Skeleton className='h-6 w-80 max-w-full' />
							<SkeletonText lines={3} className='max-w-xl' lineClassName='h-4' />
							<div className='flex gap-3'>
								<Skeleton className='h-12 w-40 rounded-lg' />
								<Skeleton className='h-12 w-36 rounded-lg' />
							</div>
						</div>
						<Skeleton className='mx-auto aspect-square w-full max-w-[24rem] rounded-full lg:col-span-5 xl:col-span-4' />
					</div>
					<Skeleton className='mt-14 h-20 w-full rounded-xl' />
				</div>
			</section>
			<TickerSkeleton />
			<SectionSkeleton>
				<div className='space-y-20 lg:space-y-28'>
					<FeaturedRowSkeleton />
					<FeaturedRowSkeleton flip />
					<ProjectListSkeleton />
				</div>
			</SectionSkeleton>
			<SectionSkeleton className='bg-surface/30 border-t'>
				<StackClustersSkeleton />
			</SectionSkeleton>
			<SectionSkeleton className='border-t'>
				<TimelineSkeleton />
			</SectionSkeleton>
			<ContactCTASkeleton />
		</PageSkeleton>
	)
}

export default HomeLoading
