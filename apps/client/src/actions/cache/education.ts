'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedEducation } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished } from 'lib/fetch-published'

export const getPublishedEducation = async (): Promise<ApiResponse<PublishedEducation[]>> => {
	cacheLife('weeks')
	cacheTag('education')

	return fetchPublished<PublishedEducation[]>('/api/v1/education/published', 'education data')
}
