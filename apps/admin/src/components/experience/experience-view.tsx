'use client'

import type {
	CollectionColumn,
	ExperienceRow as Experience,
	ListQueryOptions,
} from 'types/components/admin'
import { Briefcase } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { CollectionManager } from 'components/cms/collection-manager'
import { toPublishState } from 'lib/publish-state'
import { useCollectionView } from 'lib/use-collection-view'
import { publishFilter } from 'lib/list-query'
import { experienceActions } from 'actions/experience'
import { ExperienceFormDialog } from './experience-form-dialog'

const LIST_OPTIONS: ListQueryOptions = {
	sort: { role: 'title', dates: 'startDate', status: 'isPublished' },
	filters: { status: publishFilter },
}

export const ExperienceView = () => {
	const { manager, dialog } = useCollectionView({
		list: experienceActions.list,
		listOptions: LIST_OPTIONS,
		toRow: item => ({ ...item, status: toPublishState(item.isPublished) }),
		save: experienceActions.save,
		remove: experienceActions.remove,
		togglePublish: row => experienceActions.togglePublish(row.id),
	})

	const columns: CollectionColumn<Experience>[] = [
		{
			key: 'role',
			sortable: true,
			header: 'Role & Organization',
			render: exp => (
				<div className='flex items-center gap-3'>
					<div className='bg-surface-strong border-border grid size-9 shrink-0 place-items-center rounded-lg border'>
						<Briefcase className='text-signal-ink size-4' />
					</div>
					<div>
						<p className='text-foreground font-semibold'>{exp.title}</p>
						<p className='text-muted-foreground text-xs'>
							{exp.organization} • {exp.location}
						</p>
					</div>
				</div>
			),
		},
		{
			key: 'dates',
			sortable: true,
			header: 'Duration',
			render: exp => (
				<span className='text-muted-foreground font-mono text-xs'>
					{exp.startDate
						? new Date(exp.startDate).toLocaleDateString('en-US', {
								month: 'short',
								year: 'numeric',
							})
						: ''}{' '}
					—{' '}
					{exp.isCurrent
						? 'Present'
						: exp.endDate
							? new Date(exp.endDate).toLocaleDateString('en-US', {
									month: 'short',
									year: 'numeric',
								})
							: 'N/A'}
				</span>
			),
		},
		{
			key: 'status',
			sortable: true,
			header: 'Status',
			render: exp => (
				<Badge variant={exp.status === 'PUBLISHED' ? 'success' : 'warning'}>{exp.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				{...manager}
				title='Experience Timeline'
				description='Manage professional career trajectory, engineering positions, and key technical achievements.'
				columns={columns}
				createLabel='Add Experience'
			/>

			<ExperienceFormDialog
				open={dialog.open}
				onOpenChange={dialog.onOpenChange}
				experience={dialog.record}
				onSave={dialog.onSave}
			/>
		</div>
	)
}
