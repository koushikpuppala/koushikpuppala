'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedService } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedServices = async (): Promise<ApiResponse<PublishedService[]>> => {
	cacheLife('weeks')
	cacheTag('services')

	try {
		const response = await fetch(`${BASE_URL}/api/v1/services/published`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch services data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching services data.',
		}
	}
}
