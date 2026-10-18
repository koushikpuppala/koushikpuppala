'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedHome } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished } from 'lib/fetch-published'

export const getPublishedHome = async (): Promise<ApiResponse<PublishedHome>> => {
	cacheLife('weeks')
	cacheTag('home')

	return fetchPublished<PublishedHome>('/api/v1/home/published', 'home data')
}
