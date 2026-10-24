import type { DataTableBodyProps } from 'types/components'
import { Skeleton } from '../skeleton'
import { EmptyState } from '../empty-state'
import { STICKY_ACTIONS } from './data-table-styles'
import { TableBody, TableCell, TableRow } from './table'

const NO_MATCH = 'Nothing matches the selected filters. Try another search or clear the filters.'

export const DataTableBody = ({
	loading,
	skeletonRows,
	columnIds,
	rows,
	emptyState,
	hasActiveFilters,
}: DataTableBodyProps) => {
	if (loading)
		return (
			<TableBody>
				{Array.from({ length: skeletonRows }, (_, row) => `skeleton-${row}`).map(key => (
					<TableRow key={key} className='hover:bg-transparent'>
						{columnIds.map(id => (
							<TableCell key={id}>
								<Skeleton className='h-6 w-full rounded-sm' />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		)

	if (rows.length)
		return (
			<TableBody>
				{rows.map(row => (
					<TableRow key={row.id} className='group/row even:bg-surface-strong/40'>
						{row.cells.map(cell => (
							<TableCell key={cell.id} className={cell.sticky ? STICKY_ACTIONS : undefined}>
								{cell.content}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		)

	// The caller's empty state describes an empty collection, so it only shows while no filter is on.
	const custom = emptyState && !hasActiveFilters ? emptyState : undefined
	const fallback = hasActiveFilters ? NO_MATCH : 'There is nothing here yet.'

	return (
		<TableBody>
			<TableRow className='hover:bg-transparent'>
				<TableCell colSpan={Math.max(columnIds.length, 1)} className='p-0'>
					<EmptyState
						title={custom?.title ?? 'No data found'}
						description={custom ? custom.description : fallback}
						action={custom?.action}
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	)
}
