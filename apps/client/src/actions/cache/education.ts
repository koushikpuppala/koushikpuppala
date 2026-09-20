'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedEducation } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedEducation = async (): Promise<ApiResponse<PublishedEducation[]>> => {
	cacheLife('weeks')
	cacheTag('education')

	try {
		const response = await fetch(`${BASE_URL}/api/v1/education/published`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch education data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching education data.',
		}
	}
}
