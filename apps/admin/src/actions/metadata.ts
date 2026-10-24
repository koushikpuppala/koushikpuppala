import type { ListResult } from 'types/api'
import { DTO_FIELDS } from 'types/api'
import { adminFetch } from 'lib/api-client'
import { pickFields } from 'lib/utils'

const BASE = '/api/v1/metadata'

export const metadataActions = {
	list: <T>(query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<ListResult<T>>(`${BASE}?${query.toString()}`, { signal }),

	findByKeys: <T>(keys: string[], signal?: AbortSignal) => {
		const query = new URLSearchParams({ limit: String(keys.length) })

		for (const key of keys) query.append('key', key)

		return adminFetch<ListResult<T>>(`${BASE}?${query.toString()}`, { signal })
	},

	create: <T>(payload: object) =>
		adminFetch<T>(BASE, {
			method: 'POST',
			body: JSON.stringify(pickFields(payload, DTO_FIELDS.metadata)),
		}),

	update: <T>(id: string, payload: object) =>
		adminFetch<T>(`${BASE}/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(pickFields(payload, DTO_FIELDS.metadata)),
		}),
}
