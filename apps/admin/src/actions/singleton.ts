import type { FetchResult, ListResult } from 'types/api'
import { adminFetch } from 'lib/api-client'
import { pickFields } from 'lib/utils'
import { toItems } from 'actions/collection'

export const createSingletonActions = <T>(base: string, fields?: readonly string[]) => ({
	// Edit the published record when there is one; otherwise fall back to the newest draft.
	get: async <R = T>(): Promise<FetchResult<R>> => {
		const live = await adminFetch<ListResult<R>>(`${base}?limit=1&isPublished=true`)
		if (live.error || !live.data) return { ...live, data: null }

		const [published] = toItems(live.data)
		if (published) return { ...live, data: published }

		const latest = await adminFetch<ListResult<R>>(`${base}?limit=1`)
		if (latest.error || !latest.data) return { ...latest, data: null }

		return { ...latest, data: toItems(latest.data)[0] ?? null }
	},

	save: (id: string | undefined, payload: object) =>
		adminFetch<T>(id ? `${base}/${id}` : base, {
			method: id ? 'PATCH' : 'POST',
			body: JSON.stringify(fields ? pickFields(payload, fields) : payload),
		}),

	togglePublish: (id: string) => adminFetch<T>(`${base}/${id}/publish`, { method: 'PATCH' }),
})
