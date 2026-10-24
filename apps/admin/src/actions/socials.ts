import type { ListResult } from 'types/api'
import type { Social } from 'types/models'

import { DTO_FIELDS } from 'types/api'
import { adminFetch } from 'lib/api-client'
import { pickFields } from 'lib/utils'

const BASE = '/api/v1/socials'

export const socialsActions = {
	list: (query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<ListResult<Social>>(`${BASE}?${query.toString()}`, { signal }),

	save: (id: string | undefined, data: Partial<Social>) => {
		const body = JSON.stringify(pickFields(data, DTO_FIELDS.social))

		return id
			? adminFetch<Social>(`${BASE}/${id}`, { method: 'PATCH', body })
			: adminFetch<Social>(BASE, { method: 'POST', body })
	},

	remove: (id: string) => adminFetch(`${BASE}/${id}`, { method: 'DELETE' }),

	setVisible: (id: string, isVisible: boolean) =>
		adminFetch<Social>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify({ isVisible }) }),
}
