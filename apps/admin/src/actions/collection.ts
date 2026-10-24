import type { ListResult } from 'types/api'
import { pickFields } from 'lib/utils'
import { adminFetch } from 'lib/api-client'

export const toItems = <T>(data: ListResult<T>): T[] =>
	Array.isArray(data) ? data : data.items || []

export const createCollectionActions = <T extends object>(
	base: string,
	fields: readonly string[],
) => ({
	list: (query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<ListResult<T>>(`${base}?${query.toString()}`, { signal }),

	save: (id: string | undefined, data: Partial<T>) => {
		// Send only the fields the server DTO accepts; it rejects unknown ones (forbidNonWhitelisted).
		const body = JSON.stringify(pickFields(data, fields))

		return id
			? adminFetch<T>(`${base}/${id}`, { method: 'PATCH', body })
			: adminFetch<T>(base, { method: 'POST', body })
	},

	remove: (id: string) => adminFetch(`${base}/${id}`, { method: 'DELETE' }),

	togglePublish: (id: string) => adminFetch<T>(`${base}/${id}/publish`, { method: 'PATCH' }),
})
