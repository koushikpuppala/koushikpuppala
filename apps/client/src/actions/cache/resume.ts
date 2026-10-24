'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedResume } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished } from 'lib/fetch-published'

export const getPublishedResume = async (): Promise<ApiResponse<PublishedResume>> => {
	cacheLife('weeks')
	cacheTag('resume')

	return fetchPublished<PublishedResume>('/api/v1/resume/latest', 'resume data')
}
