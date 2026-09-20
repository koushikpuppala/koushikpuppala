'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedSkill } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedSkills = async (
	category?: string,
): Promise<ApiResponse<PublishedSkill[]>> => {
	cacheLife('weeks')
	cacheTag(`skills-${category || 'all'}`)

	try {
		const queryString = category ? `?category=${encodeURIComponent(category)}` : ''

		const response = await fetch(`${BASE_URL}/api/v1/skills/published${queryString}`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch skills data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching skills data.',
		}
	}
}
