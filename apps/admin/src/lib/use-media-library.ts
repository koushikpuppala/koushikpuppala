'use client'

import type { Identified, MediaLibraryOptions } from 'types/components/admin'
import { useCallback, useEffect, useState } from 'react'
import { mediaActions } from 'actions/media'
import { toItems } from 'actions/collection'
import { useLatestRequest } from 'lib/use-server-list'

const SEARCH_DELAY = 300

export const useMediaLibrary = <T extends Identified>({
	enabled = true,
	type,
}: MediaLibraryOptions = {}) => {
	const nextSignal = useLatestRequest()

	const [search, setSearch] = useState('')
	const [term, setTerm] = useState('')
	const [items, setItems] = useState<T[]>([])
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(enabled)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Debounce typing so the API is queried once the user pauses.
	useEffect(() => {
		const timer = setTimeout(() => setTerm(search.trim()), SEARCH_DELAY)

		return () => clearTimeout(timer)
	}, [search])

	const load = useCallback(
		async (targetPage: number) => {
			const signal = nextSignal()
			const appending = targetPage > 1

			if (appending) setLoadingMore(true)
			else setLoading(true)
			setError(null)

			const query = new URLSearchParams()
			if (appending) query.set('page', String(targetPage))
			if (term) query.set('search', term)
			if (type) query.set('type', type)

			const res = await mediaActions.list<T>(query, signal)

			if (res.aborted) return

			if (res.data) {
				const next = toItems(res.data)

				// When appending, skip items already shown, e.g. ones that shifted pages after a new upload.
				setItems(prev =>
					appending
						? [...prev, ...next.filter(item => !prev.some(shown => shown.id === item.id))]
						: next,
				)
				setTotal((Array.isArray(res.data) ? undefined : res.data.pagination?.total) ?? next.length)
				setPage(targetPage)
			} else setError(res.error ?? 'Failed to load media assets from API.')

			setLoading(false)
			setLoadingMore(false)
		},
		[nextSignal, term, type],
	)

	useEffect(() => {
		if (enabled) load(1)
	}, [enabled, load])

	return {
		items,
		search,
		setSearch,
		loading,
		loadingMore,
		error,
		setError,
		hasMore: items.length < total,
		loadMore: () => load(page + 1),
		reload: () => load(1),
		prepend: (item: T) => {
			setItems(prev => [item, ...prev])
			setTotal(prev => prev + 1)
		},
	}
}
