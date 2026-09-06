'use client'

import { useState, useMemo, type ReactNode } from 'react'
import type { ColumnDef as TanstackColumnDef } from '@tanstack/react-table'
import { DataTable } from 'ui/designs/data-table'
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/cms/confirm-dialog'
import { cn } from '@/lib/utils'

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
	searchKey,
	statusFilterKey = item => item.status || 'PUBLISHED',
	onCreate,
	onEdit,
	onDelete,
	onTogglePublish,
	createLabel = 'Create New',
	actionsExtra,
}: CollectionManagerProps<T>) {
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>(
		'ALL',
	)
	const [deleteItem, setDeleteItem] = useState<T | null>(null)
	const [deleting, setDeleting] = useState(false)

	const filtered = items.filter(item => {
		const matchesQuery = searchKey
			? searchKey(item).toLowerCase().includes(query.toLowerCase())
			: true
		const currentStatus = statusFilterKey(item)
		const matchesStatus = statusFilter === 'ALL' ? true : currentStatus === statusFilter
		return matchesQuery && matchesStatus
	})

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
	}, [columns, actionsExtra, onTogglePublish, onEdit, onDelete])

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

			{/* Filter & Search Toolbar */}
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-surface/60 p-3'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='size-4 text-muted-foreground absolute left-3 top-2.5' />
					<Input
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder={`Search ${title.toLowerCase()}…`}
						className='pl-9 h-9'
					/>
				</div>

				{/* Status Filters */}
				<div className='flex items-center gap-1.5 overflow-x-auto font-mono text-xs'>
					{(['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map(tab => (
						<button
							key={tab}
							type='button'
							onClick={() => setStatusFilter(tab)}
							className={cn(
								'rounded-lg px-2.5 py-1 transition-colors cursor-pointer',
								statusFilter === tab
									? 'bg-primary text-primary-foreground font-semibold shadow-xs'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground',
							)}>
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Data Table */}
			<DataTable
				columns={tanstackColumns}
				data={filtered}
				loading={loading}
				totalCount={filtered.length}
				pageSize={10}
				disableDateRange
				disableSearch
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
