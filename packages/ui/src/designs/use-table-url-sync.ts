'use client'

import type { TableUrlSyncOptions } from 'types/components'
import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const sortedQuery = (params: URLSearchParams) => new URLSearchParams([...params.entries()].sort())

// The table's own parameters. Default values are left out so a fresh table has a clean URL.
const tableEntries = ({
	defaultPageSize,
	pagination,
	search,
	date,
	sorting,
	disableSearch,
	disableDateRange,
	disablePageSizeOptions,
}: TableUrlSyncOptions): Array<[string, string | false | undefined]> => {
	const sort = sorting.filter(entry => entry.id && entry.desc !== undefined).at(-1)
	const customPageSize = !disablePageSizeOptions && pagination.pageSize !== defaultPageSize

	return [
		['page', pagination.pageIndex !== 0 && String(pagination.pageIndex + 1)],
		['pageSize', customPageSize && String(pagination.pageSize)],
		['search', !disableSearch && search],
		['from', !disableDateRange && date.from],
		['to', !disableDateRange && date.to],
		['sortBy', sort?.id],
		['order', sort && (sort.desc ? 'desc' : 'asc')],
	]
}

export const buildTableQuery = (
	current: URLSearchParams,
	options: TableUrlSyncOptions,
): URLSearchParams => {
	const { prefix, columnFilters, columnVisibility } = options
	const hidden = `hide_${prefix}`
	const query = new URLSearchParams()

	// Keep parameters owned by other tables on the page (different prefix) untouched.
	for (const [key, value] of current.entries())
		if (!key.startsWith(prefix) && !key.startsWith(hidden)) query.set(key, value)

	for (const [key, value] of tableEntries(options)) if (value) query.set(`${prefix}${key}`, value)

	for (const [key, visible] of Object.entries(columnVisibility))
		if (!visible) query.set(`${hidden}${key}`, 'true')

	for (const filter of columnFilters)
		if (filter.value) query.set(`${prefix}${filter.id?.trim()}`, String(filter.value))

	return query
}

export const useTableUrlSync = ({
	prefix,
	defaultPageSize,
	pagination,
	search,
	date,
	sorting,
	columnFilters,
	columnVisibility,
	disableSearch,
	disableDateRange,
	disablePageSizeOptions,
}: TableUrlSyncOptions) => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const query = buildTableQuery(searchParams, {
			prefix,
			defaultPageSize,
			pagination: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize },
			search,
			date: { from: date.from, to: date.to },
			sorting,
			columnFilters,
			columnVisibility,
			disableSearch,
			disableDateRange,
			disablePageSizeOptions,
		})

		// Compare queries independent of parameter order, so an unchanged state never triggers a navigation.
		const next = `${pathname}?${sortedQuery(query).toString()}`
		const current = `${pathname}?${sortedQuery(searchParams).toString()}`

		if (next !== current) router.replace(next, { scroll: false })
	}, [
		prefix,
		router,
		pathname,
		searchParams,
		pagination.pageSize,
		pagination.pageIndex,
		search,
		sorting,
		date.to,
		date.from,
		columnFilters,
		columnVisibility,
		disableSearch,
		disableDateRange,
		defaultPageSize,
		disablePageSizeOptions,
	])
}
