'use client'

import type { CollectionItem, CollectionManagerProps } from 'types/components/admin'
import { useState, useMemo } from 'react'
import type { DataTableColumnDef, DataTableFilters } from 'types/components'
import { DataTable } from 'ui/designs/data-table'
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from 'components/icons'
import { Button } from 'ui/button'
import { IconButton } from 'ui/icon-button'
import { ConfirmDialog } from 'components/cms/confirm-dialog'

const itemLabel = (item: object): string => {
	const record = item as Record<string, unknown>
	const name = ['title', 'name', 'label', 'degree', 'platform', 'key'].find(
		key => typeof record[key] === 'string' && record[key],
	)

	return name ? String(record[name]) : 'this record'
}

export const CollectionManager = <T extends CollectionItem>({
	title,
	description,
	items,
	totalCount,
	columns,
	loading = false,
	error = null,
	onRetry,
	onCreate,
	onEdit,
	onDelete,
	onTogglePublish,
	createLabel = 'Create New',
	actionsExtra,
}: CollectionManagerProps<T>) => {
	const [deleteItem, setDeleteItem] = useState<T | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [notice, setNotice] = useState<string | null>(null)

	const statusFilterOptions: DataTableFilters[] = [
		{
			id: 'status',
			label: 'Status',
			type: 'select',
			options: [
				{ label: 'All Statuses', value: '' },
				{ label: 'Published', value: 'PUBLISHED' },
				{ label: 'Draft', value: 'DRAFT' },
			],
		},
	]

	const tanstackColumns = useMemo<DataTableColumnDef<T>[]>(() => {
		const cols: DataTableColumnDef<T>[] = columns.map(col => ({
			id: col.key,
			header: col.header,
			accessorFn: item => (item as Record<string, unknown>)[col.key],
			enableSorting: col.sortable ?? false,
			cell: info =>
				col.render
					? col.render(info.row.original)
					: String((info.row.original as Record<string, unknown>)[col.key] ?? ''),
		}))

		if (!cols.some(c => c.id === 'status')) {
			cols.unshift({
				id: 'status',
				accessorFn: item => item.status || 'PUBLISHED',
				enableSorting: false,
				header: () => null,
				cell: () => null,
				enableHiding: true,
			})
		}

		cols.push({
			id: 'actions',
			enableSorting: false,
			header: () => <div className='text-right'>Actions</div>,
			cell: info => {
				const item = info.row.original
				return (
					<div className='flex items-center justify-end gap-1 whitespace-nowrap'>
						{actionsExtra?.(item)}
						{onTogglePublish && (
							<IconButton
								title={item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
								aria-label={`${item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'} ${itemLabel(item)}`}
								onClick={() => onTogglePublish(item)}>
								{item.status === 'PUBLISHED' ? (
									<Eye className='text-success' />
								) : (
									<EyeOff className='text-warning' />
								)}
							</IconButton>
						)}
						{onEdit && (
							<IconButton
								title='Edit'
								aria-label={`Edit ${itemLabel(item)}`}
								onClick={() => onEdit(item)}>
								<Pencil />
							</IconButton>
						)}
						{onDelete && (
							<IconButton
								variant='danger'
								title='Delete'
								aria-label={`Delete ${itemLabel(item)}`}
								onClick={() => setDeleteItem(item)}>
								<Trash2 />
							</IconButton>
						)}
					</div>
				)
			},
		})

		return cols
	}, [columns, actionsExtra, onTogglePublish, onEdit, onDelete])

	const handleDeleteConfirm = async () => {
		if (!deleteItem || !onDelete) return
		setDeleting(true)
		try {
			await onDelete(deleteItem)
			setNotice(`Deleted "${itemLabel(deleteItem)}".`)
			setDeleteItem(null)
		} finally {
			setDeleting(false)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='font-display text-foreground text-2xl font-bold tracking-tight'>
						{title}
					</h1>
					{description && <p className='text-muted-foreground mt-1 text-sm'>{description}</p>}
				</div>
				{onCreate && (
					<Button type='button' variant='signal' onClick={onCreate} className='shrink-0'>
						<Plus className='size-4' />
						<span>{createLabel}</span>
					</Button>
				)}
			</div>

			{notice && (
				<div
					role='status'
					className='border-success/30 bg-success/10 text-success flex items-center justify-between rounded-xl border p-3 font-mono text-xs'>
					<span>{notice}</span>
					<button
						type='button'
						onClick={() => setNotice(null)}
						aria-label='Dismiss'
						className='hover:text-foreground rounded p-0.5'>
						<X className='size-3.5' />
					</button>
				</div>
			)}

			{error && !loading && (
				<div className='border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border p-4 font-mono text-xs'>
					<div>
						<span className='font-semibold'>API Error: </span>
						<span>{error}</span>
					</div>
					{onRetry && (
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={onRetry}
							className='h-7 text-xs'>
							Retry
						</Button>
					)}
				</div>
			)}

			<DataTable
				columns={tanstackColumns}
				data={items}
				loading={loading}
				totalCount={totalCount}
				pageSize={10}
				filters={statusFilterOptions}
				disableDateRange
				emptyState={{
					title: `No ${title.toLowerCase()} yet`,
					description: onCreate ? 'Create the first one to see it here.' : undefined,
					action: onCreate ? (
						<Button type='button' variant='signal' onClick={onCreate}>
							<Plus className='size-4' />
							<span>{createLabel}</span>
						</Button>
					) : undefined,
				}}
			/>

			<ConfirmDialog
				open={Boolean(deleteItem)}
				onOpenChange={open => !open && setDeleteItem(null)}
				title='Delete Record'
				description={`Delete "${deleteItem ? itemLabel(deleteItem) : ''}"? It disappears from the site and admin, and the delete is recorded in the audit log.`}
				confirmLabel='Delete Record'
				loading={deleting}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	)
}
