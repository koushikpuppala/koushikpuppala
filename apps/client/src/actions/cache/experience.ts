'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedExperience } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished } from 'lib/fetch-published'

export const getPublishedExperience = async (): Promise<ApiResponse<PublishedExperience[]>> => {
	cacheLife('weeks')
	cacheTag('experience')

	return fetchPublished<PublishedExperience[]>('/api/v1/experience/published', 'experience data')
}
