'use client'

import type { ContactMessage } from 'types/api'
import type { DataTableColumnDef } from 'types/components'
import type { ListQueryOptions } from 'types/components/admin'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { IconButton } from 'ui/icon-button'
import { Eye, Trash2 } from 'components/icons'
import { DataTable } from 'ui/designs/data-table'
import { contactsActions } from 'actions/contacts'
import { useServerList } from 'lib/use-server-list'
import { CountCard } from 'components/cms/count-card'
import { PageHeader } from 'components/cms/page-header'
import { ErrorBanner } from 'components/ui/error-banner'
import { ConfirmDialog } from 'components/cms/confirm-dialog'
import { RefreshButton } from 'components/cms/refresh-button'
import { MessageDialog } from './message-dialog'
import { MESSAGE_FILTERS } from './message-options'
import { PriorityBadge, StatusBadge } from './message-badges'

const listMessages = (query: URLSearchParams, signal: AbortSignal) =>
	contactsActions.list<ContactMessage>(query, signal)

const LIST_OPTIONS: ListQueryOptions = { filters: { status: 'status', priority: 'priority' } }

const DATE = { month: 'short', day: 'numeric', year: 'numeric' } as const

export const MessagesView = () => {
	const searchParams = useSearchParams()
	const { data, items, total, loading, error, reload } = useServerList(listMessages, LIST_OPTIONS)
	const [selected, setSelected] = useState<ContactMessage | null>(null)
	const [toDelete, setToDelete] = useState<ContactMessage | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [linkedId] = useState(() => searchParams.get('id'))

	const open = (message: ContactMessage) => {
		setSelected(message)

		if (message.status === 'UNREAD')
			contactsActions
				.update(message.id, { status: 'READ' })
				.then(() => reload())
				.catch(console.error)
	}

	useEffect(() => {
		if (!linkedId) return

		const controller = new AbortController()

		contactsActions.get<ContactMessage>(linkedId, controller.signal).then(res => {
			if (!res.data) return

			open(res.data)
			reload()
		})

		return () => controller.abort()
	}, [linkedId])

	const confirmDelete = async () => {
		if (!toDelete) return

		setDeleting(true)

		try {
			const res = await contactsActions.remove(toDelete.id)

			if (res.error) throw new Error(res.error)

			await reload()

			if (selected?.id === toDelete.id) setSelected(null)

			setToDelete(null)
		} finally {
			setDeleting(false)
		}
	}

	const counts = data && !Array.isArray(data) ? data : null

	const columns = useMemo<DataTableColumnDef<ContactMessage>[]>(
		() => [
			{
				accessorKey: 'name',
				enableSorting: true,
				header: 'Sender',
				cell: ({ row }) => (
					<div className='flex items-center gap-2.5'>
						{row.original.status === 'UNREAD' && (
							<span className='bg-signal-ink h-2 w-2 shrink-0 rounded-full' />
						)}
						<div>
							<p className='text-foreground font-medium'>{row.original.name}</p>
							<p className='text-muted-foreground text-xs'>{row.original.email}</p>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'subject',
				enableSorting: true,
				header: 'Subject & Message',
				cell: ({ row }) => (
					<div className='max-w-md'>
						<p className='text-foreground truncate font-medium'>{row.original.subject}</p>
						<p className='text-muted-foreground truncate text-xs'>{row.original.message}</p>
					</div>
				),
			},
			{
				accessorKey: 'priority',
				enableSorting: true,
				header: 'Priority',
				cell: ({ row }) => <PriorityBadge value={row.original.priority} />,
			},
			{
				accessorKey: 'status',
				enableSorting: true,
				header: 'Status',
				cell: ({ row }) => <StatusBadge value={row.original.status} />,
			},
			{
				accessorKey: 'createdAt',
				enableSorting: true,
				header: 'Date',
				cell: ({ row }) => (
					<span className='text-muted-foreground text-xs'>
						{new Date(row.original.createdAt).toLocaleDateString(undefined, DATE)}
					</span>
				),
			},
			{
				id: 'actions',
				header: () => <div className='text-right'>Actions</div>,
				cell: ({ row }) => (
					<div className='flex items-center justify-end gap-1'>
						<IconButton
							variant='primary'
							title='Inspect'
							aria-label={`Inspect message from ${row.original.name}`}
							onClick={() => open(row.original)}>
							<Eye />
						</IconButton>
						<IconButton
							variant='danger'
							title='Delete'
							aria-label={`Delete message from ${row.original.name}`}
							onClick={() => setToDelete(row.original)}>
							<Trash2 />
						</IconButton>
					</div>
				),
			},
		],
		[],
	)

	return (
		<div className='space-y-6'>
			<PageHeader
				title='Inquiries & Inbox'
				description='Review and triage client contact requests, project inquiries, and feedback.'>
				<RefreshButton loading={loading} onClick={reload} />
			</PageHeader>

			{error && <ErrorBanner message={error} onRetry={reload} />}

			<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
				<CountCard label='Total Submissions' value={total} loaded={Boolean(data)} />
				<CountCard
					label='Unread'
					value={counts?.unreadCount ?? 0}
					loaded={Boolean(data)}
					valueClassName='text-signal-ink'
					indicator={(counts?.unreadCount ?? 0) > 0}
				/>
				<CountCard
					label='High / Urgent'
					value={counts?.urgentCount ?? 0}
					loaded={Boolean(data)}
					valueClassName='text-amber-500'
				/>
				<CountCard
					label='Resolved'
					value={counts?.resolvedCount ?? 0}
					loaded={Boolean(data)}
					valueClassName='text-emerald-500'
				/>
			</div>

			<DataTable
				columns={columns}
				data={items}
				loading={loading}
				totalCount={total}
				pageSize={10}
				filters={MESSAGE_FILTERS}
			/>

			<MessageDialog
				message={selected}
				onClose={() => setSelected(null)}
				onSaved={reload}
				onDelete={setToDelete}
			/>

			<ConfirmDialog
				open={Boolean(toDelete)}
				onOpenChange={isOpen => !isOpen && setToDelete(null)}
				onConfirm={confirmDelete}
				title='Delete Inquiry Record?'
				description={`Are you sure you want to permanently delete the inquiry from ${toDelete?.name}? This action cannot be undone.`}
				confirmLabel='Delete Inquiry'
				loading={deleting}
			/>
		</div>
	)
}
