'use client'

import type { DataTableColumnDef } from 'types/components'
import type { MetadataRecord } from 'types/models'
import type { MetadataTableProps } from 'types/components/admin'
import { useMemo } from 'react'
import { Button } from 'ui/button'
import { Pencil } from 'components/icons'
import { Badge } from 'components/ui/badge'
import { DataTable } from 'ui/designs/data-table'

export const MetadataTable = ({ items, loading, total, onLoad }: MetadataTableProps) => {
	const columns = useMemo<DataTableColumnDef<MetadataRecord>[]>(
		() => [
			{
				accessorKey: 'key',
				enableSorting: true,
				header: 'Key / Identifier',
				cell: ({ row }) => (
					<span className='text-signal-ink font-mono text-xs font-semibold'>
						{row.original.key}
					</span>
				),
			},
			{
				accessorKey: 'type',
				enableSorting: true,
				header: 'Type',
				cell: ({ row }) => (
					<Badge variant={row.original.type === 'LAYOUT' ? 'signal' : 'secondary'}>
						{row.original.type}
					</Badge>
				),
			},
			{
				accessorKey: 'title',
				enableSorting: true,
				header: 'SEO Title',
				cell: ({ row }) => (
					<span className='text-foreground block max-w-xs truncate text-xs font-medium'>
						{row.original.title || 'Untitled'}
					</span>
				),
			},
			{
				accessorKey: 'robots',
				header: 'Robots Directives',
				cell: ({ row }) => (
					<span className='text-muted-foreground font-mono text-xs'>
						{row.original.robots || 'index,follow'}
					</span>
				),
			},
			{
				accessorKey: 'isPublished',
				header: 'Status',
				cell: ({ row }) => (
					<Badge variant={row.original.isPublished ? 'success' : 'outline'}>
						{row.original.isPublished ? 'Published' : 'Draft'}
					</Badge>
				),
			},
			{
				id: 'actions',
				header: () => <div className='text-right'>Actions</div>,
				cell: ({ row }) => (
					<div className='text-right'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => onLoad(row.original)}
							className='text-signal-ink hover:bg-foreground/5 h-auto rounded-lg px-2 py-1 text-sm font-medium'>
							<Pencil className='mr-1 size-3.5' />
							Load in Form
						</Button>
					</div>
				),
			},
		],
		[onLoad],
	)

	return (
		<div className='space-y-4'>
			<div>
				<h2 className='font-display text-foreground text-lg font-bold tracking-tight'>
					Metadata Audit & Configuration Records
				</h2>
				<p className='text-muted-foreground text-xs'>
					Inspect and manage stored layout and page SEO configuration records.
				</p>
			</div>

			<DataTable
				columns={columns}
				data={items}
				loading={loading}
				totalCount={total}
				pageSize={10}
				disableDateRange
				disableSearch
			/>
		</div>
	)
}
