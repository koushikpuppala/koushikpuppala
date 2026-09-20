'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedProject } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedProjects = async (params?: {
	category?: string
	featured?: boolean
}): Promise<ApiResponse<PublishedProject[]>> => {
	cacheLife('weeks')
	cacheTag(`projects-${params?.category || 'all'}-${params?.featured ? 'featured' : 'all'}`)

	try {
		const queryParams = new URLSearchParams()

		if (params?.category) queryParams.set('category', params.category)
		if (params?.featured) queryParams.set('featured', String(params.featured))

		const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''

		const response = await fetch(`${BASE_URL}/api/v1/projects/published${queryString}`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch projects data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching projects data.',
		}
	}
}

export const getPublishedProjectBySlug = async (
	slug: string,
): Promise<ApiResponse<PublishedProject>> => {
	cacheLife('weeks')
	cacheTag(`projects-${slug}`)

	try {
		const response = await fetch(`${BASE_URL}/api/v1/projects/published/${slug}`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch project data.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching project data.',
		}
	}
}
