import type { CreateUserPayload, UpdateUserPayload, UserListResult } from 'types/api'
import { adminFetch } from 'lib/api-client'

const BASE = '/api/v1/users'

export const usersActions = {
	list: <T>(query: URLSearchParams, signal?: AbortSignal) =>
		adminFetch<UserListResult<T>>(`${BASE}?${query.toString()}`, { signal }),

	create: <T>(payload: CreateUserPayload) =>
		adminFetch<T>(BASE, { method: 'POST', body: JSON.stringify(payload) }),

	update: <T>(id: string, payload: UpdateUserPayload) =>
		adminFetch<T>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

	remove: (id: string) => adminFetch(`${BASE}/${id}`, { method: 'DELETE' }),
}
