import type { ColumnDef, RowData } from '@tanstack/react-table'

export type DataTablePaginationProps =
	{ disablePagination?: false; pageSize?: number } | { disablePagination: true; pageSize: number }

export type DataTableFilterOptions = { label: string; value: string }

export type DataTableFilters = { id: string; label: string } & (
	| { type: 'search'; options?: never }
	| { type: 'select' | 'search-select'; options: DataTableFilterOptions[] }
)

export type DataTableProps<TData extends RowData = any, TValue = any> = {
	data: TData[]
	loading?: boolean
	pageSize?: number
	totalCount: number
	identifier?: string
	disableSearch?: boolean
	disableSorting?: boolean
	disableDateRange?: boolean
	filters?: DataTableFilters[]
	disableClearFilters?: boolean
	disablePageSizeOptions?: boolean
	disableColumnVisibility?: boolean
	columns: ColumnDef<TData, TValue>[]
} & DataTablePaginationProps
