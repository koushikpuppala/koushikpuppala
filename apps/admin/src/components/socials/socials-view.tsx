'use client'

import type {
	CollectionColumn,
	ListQueryOptions,
	SocialRow as Social,
} from 'types/components/admin'
import Link from 'next/link'
import { Share2 } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { CollectionManager } from 'components/cms/collection-manager'
import { toPublishState } from 'lib/publish-state'
import { useCollectionView } from 'lib/use-collection-view'
import { socialsActions } from 'actions/socials'
import { SocialFormDialog } from './social-form-dialog'

const LIST_OPTIONS: ListQueryOptions = {
	sort: { status: 'isVisible' },
	filters: { status: value => ['isVisible', String(value === 'PUBLISHED')] },
}

export const SocialsView = () => {
	const { manager, dialog } = useCollectionView({
		list: socialsActions.list,
		listOptions: LIST_OPTIONS,
		toRow: item => ({ ...item, status: toPublishState(item.isVisible !== false) }),
		save: socialsActions.save,
		remove: socialsActions.remove,
		togglePublish: row => socialsActions.setVisible(row.id, row.status === 'DRAFT'),
	})

	const columns: CollectionColumn<Social>[] = [
		{
			key: 'label',
			sortable: true,
			header: 'Platform & Label',
			render: soc => (
				<div className='flex items-center gap-3'>
					<div className='bg-surface-strong border-border grid size-8 shrink-0 place-items-center rounded-lg border'>
						<Share2 className='text-signal-ink size-4' />
					</div>
					<div>
						<p className='text-foreground font-semibold'>{soc.label || soc.platform}</p>
						<p className='text-muted-foreground font-mono text-xs'>{soc.handle || soc.url}</p>
					</div>
				</div>
			),
		},
		{
			key: 'url',
			sortable: true,
			header: 'Target Link',
			render: soc => (
				<Link
					href={soc.url}
					target='_blank'
					rel='noopener noreferrer'
					className='text-signal-ink block max-w-xs truncate font-mono text-xs hover:underline'>
					{soc.url}
				</Link>
			),
		},
		{
			key: 'status',
			sortable: true,
			header: 'Status',
			render: soc => (
				<Badge variant={soc.status === 'PUBLISHED' ? 'success' : 'warning'}>{soc.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				{...manager}
				title='Social Channels & Links'
				description='Manage verified developer communication channels, handles, and external links.'
				columns={columns}
				createLabel='Add Channel'
			/>

			<SocialFormDialog
				open={dialog.open}
				onOpenChange={dialog.onOpenChange}
				social={dialog.record}
				onSave={dialog.onSave}
			/>
		</div>
	)
}
