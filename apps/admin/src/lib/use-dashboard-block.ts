'use client'

import type { FetchResult } from 'types/api'
import type { DashboardBlock, DashboardBlockState, DashboardBlocks } from 'types/components/admin'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLatestRequest } from 'lib/use-server-list'
import {
	loadAudits,
	loadContacts,
	loadHealth,
	loadMedia,
	loadProjects,
} from 'lib/dashboard-loaders'

export const useDashboardBlock = <T>(
	load: (signal: AbortSignal) => Promise<FetchResult<T>>,
): DashboardBlock<T> => {
	const router = useRouter()
	const nextSignal = useLatestRequest()
	const [state, setState] = useState<DashboardBlockState<T>>({
		status: 'loading',
		data: null,
		error: null,
		refreshing: true,
	})

	// Kept in a ref so a new router object on each render does not retrigger the load.
	const routerRef = useRef(router)

	useEffect(() => {
		routerRef.current = router
	})

	const reload = useCallback(async () => {
		const signal = nextSignal()

		setState(prev => ({ ...prev, refreshing: true }))

		const res = await load(signal)

		if (res.aborted || signal.aborted) return

		if (res.statusCode === 401 || res.statusCode === 403) {
			routerRef.current.replace('/login')

			return
		}

		// A failed reload keeps the last data so the attention strip can keep its stale items.
		setState(prev =>
			res.data
				? { status: 'ready', data: res.data, error: null, refreshing: false }
				: { status: 'error', data: prev.data, error: res.error, refreshing: false },
		)
	}, [load, nextSignal])

	useEffect(() => {
		reload()
	}, [reload])

	return { ...state, reload }
}

export const useDashboardBlocks = (): DashboardBlocks => ({
	projects: useDashboardBlock(loadProjects),
	contacts: useDashboardBlock(loadContacts),
	media: useDashboardBlock(loadMedia),
	audits: useDashboardBlock(loadAudits),
	health: useDashboardBlock(loadHealth),
})
