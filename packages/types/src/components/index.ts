import type { ReactNode } from 'react'

export type ChildrenProps = { children: ReactNode }

export type ErrorPageProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export type DataTablePaginationProps =
	{ disablePagination?: false; pageSize?: number } | { disablePagination: true; pageSize: number }

export type DataTableFilterOptions = { label: string; value: string }

export type DataTableFilters = { id: string; label: string } & (
	| { type: 'search'; options?: never }
	| { type: 'select' | 'search-select'; options: DataTableFilterOptions[] }
)

export type DataTableOptions<TData> = {
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
	manualFiltering?: boolean
	manualSorting?: boolean
	manualPagination?: boolean
} & DataTablePaginationProps

export * from './ui/index'
