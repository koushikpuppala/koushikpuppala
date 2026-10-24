'use client'

import type {
	CollectionColumn,
	EducationRow as Education,
	ListQueryOptions,
} from 'types/components/admin'
import { BookOpen } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { CollectionManager } from 'components/cms/collection-manager'
import { toPublishState } from 'lib/publish-state'
import { useCollectionView } from 'lib/use-collection-view'
import { publishFilter } from 'lib/list-query'
import { educationActions } from 'actions/education'
import { EducationFormDialog } from 'components/education/education-form-dialog'

const LIST_OPTIONS: ListQueryOptions = {
	sort: { institution: 'university', dates: 'startDate', status: 'isPublished' },
	filters: { status: publishFilter },
}

export const EducationView = () => {
	const { manager, dialog } = useCollectionView({
		list: educationActions.list,
		listOptions: LIST_OPTIONS,
		toRow: item => ({ ...item, status: toPublishState(item.isPublished) }),
		save: educationActions.save,
		remove: educationActions.remove,
		togglePublish: row => educationActions.togglePublish(row.id),
	})

	const columns: CollectionColumn<Education>[] = [
		{
			key: 'institution',
			sortable: true,
			header: 'Degree & Institution',
			render: edu => (
				<div className='flex items-center gap-3'>
					<div className='bg-surface-strong border-border grid size-9 shrink-0 place-items-center rounded-lg border'>
						<BookOpen className='text-signal-ink size-4' />
					</div>
					<div>
						<p className='text-foreground font-semibold'>{edu.degree}</p>
						<p className='text-muted-foreground text-xs'>{edu.university}</p>
					</div>
				</div>
			),
		},
		{
			key: 'dates',
			sortable: true,
			header: 'Class Of',
			render: edu => (
				<span className='text-muted-foreground font-mono text-xs'>
					{edu.startDate ? new Date(edu.startDate).getFullYear() : ''} —{' '}
					{edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
				</span>
			),
		},
		{
			key: 'status',
			sortable: true,
			header: 'Status',
			render: edu => (
				<Badge variant={edu.status === 'PUBLISHED' ? 'success' : 'warning'}>{edu.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				{...manager}
				title='Academic Qualifications'
				description='Manage universities, degrees, engineering coursework, honors, and certifications.'
				columns={columns}
				createLabel='Add Education'
			/>

			<EducationFormDialog
				open={dialog.open}
				onOpenChange={dialog.onOpenChange}
				education={dialog.record}
				onSave={dialog.onSave}
			/>
		</div>
	)
}
