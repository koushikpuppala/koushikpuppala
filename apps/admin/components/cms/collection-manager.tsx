'use client'

import { useState, useMemo, type ReactNode } from 'react'
import type { ColumnDef as TanstackColumnDef } from '@tanstack/react-table'
import type { DataTableFilters } from 'types/components'
import { DataTable } from 'ui/designs/data-table'
import { Eye, EyeOff, Pencil, Plus, Trash2 } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/cms/confirm-dialog'

export type ColumnDef<T> = {
	key: string
	header: string
	render?: (item: T) => ReactNode
	className?: string
}

type CollectionManagerProps<T extends { id: string; status?: string }> = {
	title: string
	description?: string
	items: T[]
	columns: ColumnDef<T>[]
	loading?: boolean
	error?: string | null
	onRetry?: () => void
	searchKey?: (item: T) => string
	statusFilterKey?: (item: T) => string
	onCreate?: () => void
	onEdit?: (item: T) => void
	onDelete?: (item: T) => void | Promise<void>
	onTogglePublish?: (item: T) => void | Promise<void>
	createLabel?: string
	actionsExtra?: (item: T) => ReactNode
}

export function CollectionManager<T extends { id: string; status?: string }>({
	title,
	description,
	items,
	columns,
	loading = false,
	error = null,
	onRetry,
	statusFilterKey = item => item.status || 'PUBLISHED',
	onCreate,
	onEdit,
	onDelete,
	onTogglePublish,
	createLabel = 'Create New',
	actionsExtra,
}: CollectionManagerProps<T>) {
	const [deleteItem, setDeleteItem] = useState<T | null>(null)
	const [deleting, setDeleting] = useState(false)

	const statusFilterOptions: DataTableFilters[] = [
		{
			id: 'status',
			label: 'Status',
			type: 'select',
			options: [
				{ label: 'All Statuses', value: '' },
				{ label: 'Published', value: 'PUBLISHED' },
				{ label: 'Draft', value: 'DRAFT' },
				{ label: 'Archived', value: 'ARCHIVED' },
			],
		},
	]

	const tanstackColumns = useMemo<TanstackColumnDef<T>[]>(() => {
		const cols: TanstackColumnDef<T>[] = columns.map(col => ({
			id: col.key,
			header: col.header,
			accessorFn: item => (item as Record<string, unknown>)[col.key],
			cell: info =>
				col.render
					? col.render(info.row.original)
					: String((info.row.original as Record<string, unknown>)[col.key] ?? ''),
		}))

		if (!cols.some(c => c.id === 'status')) {
			cols.unshift({
				id: 'status',
				accessorFn: item => statusFilterKey(item),
				header: () => null,
				cell: () => null,
				enableHiding: true,
			})
		}

		cols.push({
			id: 'actions',
			header: () => <div className='text-right'>Actions</div>,
			cell: info => {
				const item = info.row.original
				return (
					<div className='flex items-center justify-end gap-1.5 whitespace-nowrap'>
						{actionsExtra?.(item)}
						{onTogglePublish && (
							<button
								type='button'
								title={item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
								onClick={() => onTogglePublish(item)}
								className='rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer'>
								{item.status === 'PUBLISHED' ? (
									<Eye className='size-4 text-emerald-500' />
								) : (
									<EyeOff className='size-4 text-amber-500' />
								)}
							</button>
						)}
						{onEdit && (
							<button
								type='button'
								title='Edit'
								onClick={() => onEdit(item)}
								className='rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer'>
								<Pencil className='size-4' />
							</button>
						)}
						{onDelete && (
							<button
								type='button'
								title='Delete'
								onClick={() => setDeleteItem(item)}
								className='rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive cursor-pointer'>
								<Trash2 className='size-4' />
							</button>
						)}
					</div>
				)
			},
		})

		return cols
	}, [columns, statusFilterKey, actionsExtra, onTogglePublish, onEdit, onDelete])

	async function handleDeleteConfirm() {
		if (!deleteItem || !onDelete) return
		setDeleting(true)
		try {
			await onDelete(deleteItem)
			setDeleteItem(null)
		} finally {
			setDeleting(false)
		}
	}

	return (
		<div className='space-y-6'>
			{/* Header bar */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='font-display text-2xl font-bold tracking-tight text-foreground'>
						{title}
					</h1>
					{description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
				</div>
				{onCreate && (
					<Button type='button' variant='signal' onClick={onCreate} className='shrink-0'>
						<Plus className='size-4' />
						<span>{createLabel}</span>
					</Button>
				)}
			</div>

			{/* Error Alert */}
			{error && !loading && (
				<div className='flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-mono text-destructive'>
					<div>
						<span className='font-semibold'>API Error: </span>
						<span>{error}</span>
					</div>
					{onRetry && (
						<Button type='button' variant='outline' size='sm' onClick={onRetry} className='h-7 text-xs'>
							Retry
						</Button>
					)}
				</div>
			)}

			{/* Data Table */}
			<DataTable
				columns={tanstackColumns}
				data={items}
				loading={loading}
				totalCount={items.length}
				pageSize={10}
				filters={statusFilterOptions}
				manualFiltering={false}
				manualSorting={false}
				manualPagination={false}
				disableDateRange
			/>

			{/* Confirm Delete Dialog */}
			<ConfirmDialog
				open={Boolean(deleteItem)}
				onOpenChange={open => !open && setDeleteItem(null)}
				title='Delete Record'
				description='Are you sure you want to remove this item? This action will soft-delete the entity and be recorded in the audit log.'
				confirmLabel='Delete Record'
				loading={deleting}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	)
}
