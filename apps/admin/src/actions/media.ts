import type { ListResult } from 'types/api'
import { adminFetch } from 'lib/api-client'

const BASE = '/api/v1/media'

export const mediaActions = {
	list: <T>(query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<ListResult<T>>(`${BASE}?${query.toString()}`, { signal }),

	remove: (id: string) => adminFetch(`${BASE}/${id}`, { method: 'DELETE' }),
}
