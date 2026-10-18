import {
	ContactCTASkeleton,
	LeadershipSkeleton,
	PageHeroSkeleton,
	PageSkeleton,
	RecordRowsSkeleton,
	SectionSkeleton,
} from 'components/skeletons'

const EducationLoading = () => {
	return (
		<PageSkeleton label='education'>
			<PageHeroSkeleton actions={1} />
			<SectionSkeleton>
				<RecordRowsSkeleton rows={2} />
			</SectionSkeleton>
			<SectionSkeleton className='border-t'>
				<LeadershipSkeleton />
			</SectionSkeleton>
			<ContactCTASkeleton />
		</PageSkeleton>
	)
}

export default EducationLoading
