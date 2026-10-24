'use client'
import Image from 'next/image'

import type {
	CollectionColumn,
	ListQueryOptions,
	ProjectRow as Project,
} from 'types/components/admin'
import { FolderKanban } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { CollectionManager } from 'components/cms/collection-manager'
import { toPublishState } from 'lib/publish-state'
import { useCollectionView } from 'lib/use-collection-view'
import { publishFilter } from 'lib/list-query'
import { projectsActions } from 'actions/projects'
import { ProjectFormDialog } from 'components/projects/project-form-dialog'

const LIST_OPTIONS: ListQueryOptions = {
	sort: { status: 'isPublished' },
	filters: { status: publishFilter },
}

export const ProjectsView = () => {
	const { manager, dialog } = useCollectionView({
		list: projectsActions.list,
		listOptions: LIST_OPTIONS,
		toRow: item => ({
			...item,
			lifecycle: item.status,
			status: toPublishState(item.isPublished),
		}),
		save: projectsActions.save,
		remove: projectsActions.remove,
		togglePublish: row => projectsActions.togglePublish(row.id),
	})

	const columns: CollectionColumn<Project>[] = [
		{
			key: 'title',
			sortable: true,
			header: 'Project Details',
			render: p => (
				<div className='flex items-center gap-3'>
					<div className='bg-surface-strong border-border relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border'>
						{p.thumbnail?.url ? (
							<Image
								src={p.thumbnail.url}
								alt={p.title}
								fill
								sizes='40px'
								className='object-cover'
							/>
						) : (
							<FolderKanban className='text-muted-foreground size-4' />
						)}
					</div>
					<div className='min-w-0'>
						<div className='flex items-center gap-2'>
							<span className='text-foreground truncate font-semibold'>{p.title}</span>
							{p.featured && <Badge variant='signal'>Featured</Badge>}
						</div>
						<p className='text-muted-foreground truncate text-xs'>/{p.slug}</p>
					</div>
				</div>
			),
		},
		{
			key: 'technologies',
			header: 'Technologies',
			render: p => (
				<div className='flex max-w-xs flex-wrap gap-1'>
					{(p.technologies || []).slice(0, 3).map((t, idx) => (
						<Badge key={idx} variant='secondary' className='text-[0.625rem]'>
							{t}
						</Badge>
					))}
					{(p.technologies || []).length > 3 && (
						<span className='text-muted-foreground font-mono text-[0.625rem]'>
							+{(p.technologies || []).length - 3}
						</span>
					)}
				</div>
			),
		},
		{
			key: 'status',
			sortable: true,
			header: 'Status',
			render: p => (
				<div className='flex flex-wrap items-center gap-1.5'>
					<Badge variant={p.status === 'PUBLISHED' ? 'success' : 'warning'}>{p.status}</Badge>
					{p.lifecycle ? <Badge variant='secondary'>{p.lifecycle.replace('_', ' ')}</Badge> : null}
				</div>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				{...manager}
				title='Projects & Case Studies'
				description='Manage production showcases, case study narratives, technology badges, and deployment links.'
				columns={columns}
				createLabel='New Project'
			/>

			<ProjectFormDialog
				open={dialog.open}
				onOpenChange={dialog.onOpenChange}
				project={dialog.record}
				onSave={dialog.onSave}
			/>
		</div>
	)
}
