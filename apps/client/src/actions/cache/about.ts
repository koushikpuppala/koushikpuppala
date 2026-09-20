'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedAbout } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedAbout = async (): Promise<ApiResponse<PublishedAbout>> => {
	cacheLife('weeks')
	cacheTag('about')

	try {
		const response = await fetch(`${BASE_URL}/api/v1/about/published`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch about data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching about data.',
		}
	}
}
