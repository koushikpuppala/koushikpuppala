'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedSocial } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished } from 'lib/fetch-published'

export const getPublishedSocials = async (): Promise<ApiResponse<PublishedSocial[]>> => {
	cacheLife('weeks')
	cacheTag('socials')

	return fetchPublished<PublishedSocial[]>('/api/v1/socials/visible', 'socials data')
}
