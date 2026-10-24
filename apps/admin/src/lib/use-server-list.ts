'use client'

import type { ListResult } from 'types/api'
import type { ItemOf, ListFetcher, ListQueryOptions } from 'types/components/admin'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toItems } from 'actions/collection'
import { toListQuery } from 'lib/list-query'

// Returns a fresh AbortSignal each call and aborts the previous request, so a slow response
// for old filters can never overwrite the results for the current ones.
export const useLatestRequest = (): (() => AbortSignal) => {
	const controller = useRef<AbortController | null>(null)

	useEffect(() => () => controller.current?.abort(), [])

	return useCallback(() => {
		controller.current?.abort()
		controller.current = new AbortController()

		return controller.current.signal
	}, [])
}

// Fetches a list page from the API whenever the table's URL parameters change.
export const useServerList = <R extends ListResult<unknown>>(
	fetchPage: ListFetcher<R>,
	options?: ListQueryOptions,
) => {
	const searchParams = useSearchParams()
	const nextSignal = useLatestRequest()

	const query = toListQuery(searchParams, options).toString()

	const [data, setData] = useState<R | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const reload = useCallback(async () => {
		const signal = nextSignal()

		setLoading(true)
		setError(null)

		const res = await fetchPage(new URLSearchParams(query), signal)

		if (res.aborted || signal.aborted) return

		if (res.data) setData(res.data)
		else setError(res.error ?? 'Failed to load the list from the API.')

		setLoading(false)
	}, [fetchPage, nextSignal, query])

	useEffect(() => {
		reload()
	}, [reload])

	const items = useMemo(() => (data ? toItems(data as ListResult<ItemOf<R>>) : []), [data])

	const total = (data && !Array.isArray(data) ? data.pagination?.total : undefined) ?? items.length

	return { data, items, total, loading, error, setError, reload }
}
