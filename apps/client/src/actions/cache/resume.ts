'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedResume } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedResume = async (): Promise<ApiResponse<PublishedResume>> => {
	cacheLife('weeks')
	cacheTag('resume')

	try {
		const response = await fetch(`${BASE_URL}/api/v1/resume/latest`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch resume data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching resume data.',
		}
	}
}
