import type {
	ButtonHTMLAttributes,
	ElementType,
	HTMLAttributes,
	LabelHTMLAttributes,
	ReactNode,
} from 'react'
import type {
	ColumnDef,
	ColumnFiltersState,
	ColumnVisibilityState,
	RowData,
	SortingState,
	TableFeatures,
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_arrIncludes,
	filterFn_equals,
	filterFn_inDateRange,
	filterFn_inNumberRange,
	filterFn_includesString,
	filterFn_weakEquals,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_basic,
	sortFn_datetime,
	sortFn_text,
} from '@tanstack/react-table'
import type { DataTableFilters, DataTableOptions } from '../index'

export type ButtonVariant =
	'default' | 'signal' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

export type ButtonSize = 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm'

export type ButtonVariantOptions = {
	variant?: ButtonVariant
	size?: ButtonSize
	className?: string
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant
	size?: ButtonSize
	asChild?: boolean
}

export type IconButtonVariant = 'neutral' | 'primary' | 'danger'

export type IconButtonSize = 'sm' | 'md'

export type IconButtonVariantOptions = {
	variant?: IconButtonVariant
	size?: IconButtonSize
	className?: string
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	'aria-label': string
	variant?: IconButtonVariant
	size?: IconButtonSize
	asChild?: boolean
}

export type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode
	className?: string
	as?: ElementType
	noPadding?: boolean
}

export type EmptyStateProps = {
	title: string
	description?: string
	icon?: ReactNode
	action?: ReactNode
	className?: string
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export type LogoMarkProps = {
	className?: string
	glyphClassName?: string
}

export type SelectOption<V extends string> = { label: string; value: V }

export type SelectProps<V extends string> = {
	id?: string
	value: V | '' | null | undefined
	onChange: (value: V) => void
	options: ReadonlyArray<SelectOption<V>>
	disabled?: boolean
	placeholder?: string
	className?: string
	'aria-label'?: string
}

export type DatePickerProps = {
	id?: string
	value: string | null | undefined
	onChange: (value: string) => void
	min?: string
	max?: string
	disabled?: boolean
	required?: boolean
	placeholder?: string
	className?: string
}

export type ChangeShownDate = (
	value: Date | number | string,
	mode?: 'set' | 'setYear' | 'setMonth' | 'monthOffset',
) => void

export type SkeletonProps = { className?: string }

export type SkeletonTextProps = {
	lines?: number
	className?: string
	lineClassName?: string
}

export type LoadingRegionProps = {
	label: string
	children: ReactNode
	className?: string
}

export type SurfaceProps = HTMLAttributes<HTMLElement> & {
	children: ReactNode
	className?: string
	as?: ElementType
	variant?: 'flat' | 'bordered' | 'strong' | 'transparent' | 'card'
	interactive?: boolean
	glow?: boolean
}

export type DataTableFeatures = {
	columnFilteringFeature: typeof columnFilteringFeature
	globalFilteringFeature: typeof globalFilteringFeature
	columnVisibilityFeature: typeof columnVisibilityFeature
	rowSortingFeature: typeof rowSortingFeature
	rowPaginationFeature: typeof rowPaginationFeature
	filteredRowModel: ReturnType<typeof createFilteredRowModel<TableFeatures>>
	sortedRowModel: ReturnType<typeof createSortedRowModel<TableFeatures, RowData>>
	paginatedRowModel: ReturnType<typeof createPaginatedRowModel<TableFeatures>>
	filterFns: {
		includesString: typeof filterFn_includesString
		inNumberRange: typeof filterFn_inNumberRange
		equals: typeof filterFn_equals
		arrIncludes: typeof filterFn_arrIncludes
		inDateRange: typeof filterFn_inDateRange
		weakEquals: typeof filterFn_weakEquals
	}
	sortFns: {
		datetime: typeof sortFn_datetime
		alphanumeric: typeof sortFn_alphanumeric
		text: typeof sortFn_text
		basic: typeof sortFn_basic
	}
}

export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData>

export type DataTableEmptyState = { title: string; description?: string; action?: ReactNode }

export type DataTableProps<TData extends RowData> = DataTableOptions<TData> & {
	columns: DataTableColumnDef<TData>[]
	emptyState?: DataTableEmptyState
}

export type ClassNameProps = { className?: string }

export type TablePagination = { pageIndex: number; pageSize: number }

export type DateRangeValue = { from: string; to: string }

export type TableUrlSyncOptions = {
	prefix: string
	defaultPageSize: number
	pagination: TablePagination
	search: string
	date: DateRangeValue
	sorting: SortingState
	columnFilters: ColumnFiltersState
	columnVisibility: ColumnVisibilityState
	disableSearch: boolean
	disableDateRange: boolean
	disablePageSizeOptions: boolean
}

export type FilterControlProps = {
	filter: DataTableFilters
	value: string | undefined
	onChange: (value: string) => void
}

export type DateRangeFilterProps = {
	value: DateRangeValue
	onChange: (value: DateRangeValue) => void
	hidden: boolean
}

export type VisibleColumn = { id: string; label: string; visible: boolean; toggle: () => void }

export type ColumnVisibilityMenuProps = { columns: VisibleColumn[]; hidden: boolean }

export type DataTableInitialStateOptions = {
	searchParams: URLSearchParams
	prefix: string
	filters: DataTableFilters[] | undefined
	pageSize: number
}

export type DataTableInitialState = {
	sorting: SortingState
	columnVisibility: ColumnVisibilityState
	columnFilters: ColumnFiltersState
	search: string
	date: DateRangeValue
	pagination: TablePagination
}

export type DataTableToolbarProps = {
	search: string
	onSearch: (search: string) => void
	disableSearch: boolean
	filters: DataTableFilters[] | undefined
	filterValue: (id: string) => string | undefined
	onFilter: (id: string, value: string) => void
	date: DateRangeValue
	onDate: (date: DateRangeValue) => void
	disableDateRange: boolean
	onClear: () => void
	disableClearFilters: boolean
	columns: VisibleColumn[]
	disableColumnVisibility: boolean
}

export type DataTableSortDirection = 'asc' | 'desc'

export type DataTableHeadCellProps = {
	label: string
	sortable: boolean
	sorted: DataTableSortDirection | false
	onSort: ((event: unknown) => void) | undefined
	sticky: boolean
	children: ReactNode
}

export type DataTableBodyCell = { id: string; sticky: boolean; content: ReactNode }

export type DataTableBodyRow = { id: string; cells: DataTableBodyCell[] }

export type DataTableBodyProps = {
	loading: boolean
	skeletonRows: number
	columnIds: string[]
	rows: DataTableBodyRow[]
	emptyState: DataTableEmptyState | undefined
	hasActiveFilters: boolean
}

export type DataTablePagerProps = {
	pagination: TablePagination
	totalCount: number
	canPrevious: boolean
	canNext: boolean
	onPrevious: () => void
	onNext: () => void
	onPageSize: (pageSize: number) => void
	disablePageSizeOptions: boolean
}
