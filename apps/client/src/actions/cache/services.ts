'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedService } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished } from 'lib/fetch-published'

export const getPublishedServices = async (): Promise<ApiResponse<PublishedService[]>> => {
	cacheLife('weeks')
	cacheTag('services')

	return fetchPublished<PublishedService[]>('/api/v1/services/published', 'services data')
}
