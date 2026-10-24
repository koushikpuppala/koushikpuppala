import type { ContactListResult } from 'types/api'
import { DTO_FIELDS } from 'types/api'
import { adminFetch } from 'lib/api-client'
import { pickFields } from 'lib/utils'

const BASE = '/api/v1/contacts'

export const contactsActions = {
	list: <T>(query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<ContactListResult<T>>(`${BASE}?${query.toString()}`, { signal }),

	get: <T>(id: string, signal?: AbortSignal) => adminFetch<T>(`${BASE}/${id}`, { signal }),

	update: <T>(id: string, data: object) =>
		adminFetch<T>(`${BASE}/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(pickFields(data, DTO_FIELDS.contactUpdate)),
		}),

	remove: (id: string) => adminFetch(`${BASE}/${id}`, { method: 'DELETE' }),
}
