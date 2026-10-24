import {
	ContactCTASkeleton,
	PageHeroSkeleton,
	PageSkeleton,
	SectionSkeleton,
	StackClustersSkeleton,
	TickerSkeleton,
} from 'components/skeletons'

const SkillsLoading = () => {
	return (
		<PageSkeleton label='skills'>
			<PageHeroSkeleton />
			<TickerSkeleton />
			<SectionSkeleton>
				<StackClustersSkeleton />
			</SectionSkeleton>
			<ContactCTASkeleton />
		</PageSkeleton>
	)
}

export default SkillsLoading
