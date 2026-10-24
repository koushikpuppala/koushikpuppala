import { Skeleton, SkeletonText } from 'ui/skeleton'
import {
	AboutBlockSkeleton,
	ContactCTASkeleton,
	PageHeroSkeleton,
	PageSkeleton,
	SectionSkeleton,
} from 'components/skeletons'

const AboutLoading = () => {
	return (
		<PageSkeleton label='about page'>
			<PageHeroSkeleton />
			<SectionSkeleton header={false}>
				<AboutBlockSkeleton />
			</SectionSkeleton>
			<SectionSkeleton className='border-t'>
				<div className='border-border bg-border grid gap-px overflow-hidden border-y sm:grid-cols-2'>
					{['a', 'b', 'c', 'd'].map(key => (
						<div key={key} className='bg-background space-y-4 p-7 sm:p-9'>
							<Skeleton className='h-3 w-6' />
							<SkeletonText lines={2} />
						</div>
					))}
				</div>
			</SectionSkeleton>
			<ContactCTASkeleton />
		</PageSkeleton>
	)
}

export default AboutLoading
