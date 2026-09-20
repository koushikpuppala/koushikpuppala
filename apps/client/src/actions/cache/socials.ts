'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedSocial } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedSocials = async (): Promise<ApiResponse<PublishedSocial[]>> => {
	cacheLife('weeks')
	cacheTag('socials')

	try {
		const response = await fetch(`${BASE_URL}/api/v1/socials/visible`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch socials data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching socials data.',
		}
	}
}
