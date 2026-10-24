import {
	ContactCTASkeleton,
	PageHeroSkeleton,
	PageSkeleton,
	SectionHeaderSkeleton,
	StatStripSkeleton,
	TimelineSkeleton,
} from 'components/skeletons'

const ExperienceLoading = () => {
	return (
		<PageSkeleton label='experience'>
			<PageHeroSkeleton />
			<section className='pt-14 pb-20 lg:pt-16 lg:pb-28'>
				<div className='container-page'>
					<StatStripSkeleton />
					<div className='mt-16 lg:mt-20'>
						<SectionHeaderSkeleton />
					</div>
					<div className='mt-12'>
						<TimelineSkeleton items={4} />
					</div>
				</div>
			</section>
			<ContactCTASkeleton />
		</PageSkeleton>
	)
}

export default ExperienceLoading
