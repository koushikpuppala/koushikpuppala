import { Skeleton } from 'ui/skeleton'
import {
	FeaturedRowSkeleton,
	PageHeroSkeleton,
	PageSkeleton,
	ProjectListSkeleton,
	SectionSkeleton,
} from 'components/skeletons'

const ProjectsLoading = () => {
	return (
		<PageSkeleton label='projects'>
			<PageHeroSkeleton actions={1} />
			<section className='pt-12 lg:pt-16'>
				<div className='container-page'>
					<div className='border-border grid gap-5 border-y py-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center lg:gap-10'>
						<Skeleton className='h-11 w-full rounded-full' />
						<div className='flex flex-wrap gap-2 lg:justify-end'>
							{['a', 'b', 'c', 'd', 'e', 'f'].map(key => (
								<Skeleton key={key} className='h-7 w-20 rounded-full' />
							))}
						</div>
					</div>
				</div>
			</section>
			<SectionSkeleton>
				<div className='space-y-20 lg:space-y-28'>
					<FeaturedRowSkeleton />
					<FeaturedRowSkeleton flip />
					<ProjectListSkeleton />
				</div>
			</SectionSkeleton>
		</PageSkeleton>
	)
}

export default ProjectsLoading
