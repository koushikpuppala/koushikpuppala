'use client'

import type {
	CollectionColumn,
	ListQueryOptions,
	ServiceRow as Service,
} from 'types/components/admin'
import { Wrench } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { CollectionManager } from 'components/cms/collection-manager'
import { toPublishState } from 'lib/publish-state'
import { useCollectionView } from 'lib/use-collection-view'
import { publishFilter } from 'lib/list-query'
import { servicesActions } from 'actions/services'
import { ServiceFormDialog } from './service-form-dialog'

const LIST_OPTIONS: ListQueryOptions = {
	sort: { status: 'isPublished' },
	filters: { status: publishFilter },
}

export const ServicesView = () => {
	const { manager, dialog } = useCollectionView({
		list: servicesActions.list,
		listOptions: LIST_OPTIONS,
		toRow: item => ({ ...item, status: toPublishState(item.isPublished) }),
		save: servicesActions.save,
		remove: servicesActions.remove,
		togglePublish: row => servicesActions.togglePublish(row.id),
	})

	const columns: CollectionColumn<Service>[] = [
		{
			key: 'title',
			sortable: true,
			header: 'Service / Offering',
			render: svc => (
				<div className='flex items-center gap-3'>
					<div className='bg-surface-strong border-border grid size-8 shrink-0 place-items-center rounded-lg border'>
						<Wrench className='text-signal-ink size-4' />
					</div>
					<div>
						<p className='text-foreground font-semibold'>{svc.title}</p>
						<p className='text-muted-foreground line-clamp-1 max-w-md text-xs'>{svc.description}</p>
					</div>
				</div>
			),
		},
		{
			key: 'status',
			sortable: true,
			header: 'Status',
			render: svc => (
				<Badge variant={svc.status === 'PUBLISHED' ? 'success' : 'warning'}>{svc.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				{...manager}
				title='Services & Engineering Competencies'
				description='Manage service offerings, advisory specialties, and architectural consulting capabilities.'
				columns={columns}
				createLabel='Add Service'
			/>

			<ServiceFormDialog
				open={dialog.open}
				onOpenChange={dialog.onOpenChange}
				service={dialog.record}
				onSave={dialog.onSave}
			/>
		</div>
	)
}
