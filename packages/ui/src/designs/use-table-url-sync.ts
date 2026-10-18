'use client'

import type { TableUrlSyncOptions } from 'types/components'
import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Compare queries independent of parameter order, so an unchanged state never triggers a navigation.
const sortedQuery = (params: URLSearchParams) => new URLSearchParams([...params.entries()].sort())

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
		const query = new URLSearchParams()
		const put = (key: string, value: string | false | undefined) => {
			if (value) query.set(`${prefix}${key}`, value)
		}

		// Keep parameters owned by other tables on the page (different prefix) untouched.
		for (const [key, value] of searchParams.entries())
			if (!key.startsWith(prefix) && !key.startsWith(`hide_${prefix}`)) query.set(key, value)

		// Default values are left out so a fresh table has a clean URL.
		put('page', pagination.pageIndex !== 0 && String(pagination.pageIndex + 1))
		put(
			'pageSize',
			!disablePageSizeOptions &&
				pagination.pageSize !== defaultPageSize &&
				String(pagination.pageSize),
		)
		put('search', !disableSearch && search)
		put('from', !disableDateRange && date.from)
		put('to', !disableDateRange && date.to)

		for (const [key, visible] of Object.entries(columnVisibility))
			if (!visible) query.set(`hide_${prefix}${key}`, 'true')

		for (const sort of sorting)
			if (sort.id && sort.desc !== undefined) {
				put('sortBy', sort.id)
				put('order', sort.desc ? 'desc' : 'asc')
			}

		for (const filter of columnFilters)
			if (filter.value) query.set(`${prefix}${filter.id?.trim()}`, String(filter.value))

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
