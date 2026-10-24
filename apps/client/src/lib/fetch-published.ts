import type { ApiResponse } from 'types/api'
import { cacheLife } from 'next/cache'
import { BASE_URL } from 'constants/base-url'

export const withQuery = (path: string, params: Record<string, string | undefined>): string => {
	const query = new URLSearchParams()

	for (const [key, value] of Object.entries(params)) if (value) query.set(key, value)

	const search = query.toString()

	return search ? `${path}?${search}` : path
}

export const fetchPublished = async <T>(path: string, subject: string): Promise<ApiResponse<T>> => {
	try {
		const response = await fetch(`${BASE_URL}${path}`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || `Failed to fetch ${subject}.`)

		return data
	} catch (error) {
		// Inside a 'use cache' caller: cache a failure only briefly so the page recovers soon after the API does.
		cacheLife('minutes')

		return {
			error: true,
			message: (error as Error).message || `An error occurred while fetching ${subject}.`,
		}
	}
}
