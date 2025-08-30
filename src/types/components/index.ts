import type { HTMLAttributes } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

export type FlipWordsProps = { words: string[]; duration?: number; className?: string }

export type TextGenerateEffectProps = { strings: string[]; className?: string }

export type CardProps = HTMLAttributes<HTMLElement> & {
	children?: React.ReactNode
	className?: string
}

export type CardContainerProps = CardProps & {
	containerClassName?: string
	options?: { max?: number; scale?: number; speed?: number }
}

export type CardBodyProps = CardProps

export type CardItemProps = CardProps & {
	as?: React.ElementType
	translateX?: number | string
	translateY?: number | string
	translateZ?: number | string
	rotateX?: number | string
	rotateY?: number | string
	rotateZ?: number | string
	[key: string]: unknown
}

export type ProjectCardProps = { data: unknown[] }

export type BackgroundBeamsProps = { className?: string }

export type AnimationProps<T> = Partial<T> &
	(
		| { direction: 'left' | 'right' | 'up' | 'down'; delay: number }
		| { direction?: never; delay?: never }
	)

export type LinkProps = {
	label: string
	href: string
	icon: React.JSX.Element | React.ReactNode
}

export type SidebarLinkProps = { link: LinkProps; className?: string } & React.ComponentProps<'a'>

export type DataTablePaginationProps =
	| { disablePagination?: false; pageSize?: number }
	| { disablePagination: true; pageSize: number }

export type DataTableFilterOptions = { label: string; value: string }

export type DataTableFilters = {
	id: string
	label: string
} & (
	| { type: 'search'; options?: never }
	| { type: 'select' | 'search-select'; options: DataTableFilterOptions[] }
)

export type DataTableProps<TData, TValue> = {
	data: TData[]
	pageSize?: number
	totalCount: number
	disableSearch?: boolean
	disableDateRange?: boolean
	filters?: DataTableFilters[]
	disableColumnVisibility?: boolean
	columns: ColumnDef<TData, TValue>[]
} & DataTablePaginationProps
