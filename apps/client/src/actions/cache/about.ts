'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedAbout } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished } from 'lib/fetch-published'

export const getPublishedAbout = async (): Promise<ApiResponse<PublishedAbout>> => {
	cacheLife('weeks')
	cacheTag('about')

	return fetchPublished<PublishedAbout>('/api/v1/about/published', 'about data')
}
