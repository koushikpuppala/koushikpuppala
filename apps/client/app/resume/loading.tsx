import { Skeleton } from 'ui/skeleton'
import {
	ContactCTASkeleton,
	PageHeroSkeleton,
	PageSkeleton,
	RecordRowsSkeleton,
	SectionSkeleton,
} from 'components/skeletons'

const ResumeLoading = () => {
	return (
		<PageSkeleton label='resume'>
			<PageHeroSkeleton />
			<SectionSkeleton>
				<RecordRowsSkeleton rows={4} />
			</SectionSkeleton>
			<SectionSkeleton className='border-t'>
				<RecordRowsSkeleton rows={2} />
			</SectionSkeleton>
			<SectionSkeleton className='border-t'>
				<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					{['a', 'b', 'c', 'd', 'e', 'f'].map(key => (
						<div key={key} className='space-y-3'>
							<Skeleton className='h-3 w-24' />
							<div className='flex flex-wrap gap-1.5'>
								{['1', '2', '3', '4'].map(chip => (
									<Skeleton key={chip} className='h-6 w-16 rounded-full' />
								))}
							</div>
						</div>
					))}
				</div>
			</SectionSkeleton>
			<ContactCTASkeleton />
		</PageSkeleton>
	)
}

export default ResumeLoading
