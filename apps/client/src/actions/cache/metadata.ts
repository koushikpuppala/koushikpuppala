'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedMetadata } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished, withQuery } from 'lib/fetch-published'

export const getPublishedMetadataByPath = async (
	pathname: string,
): Promise<ApiResponse<PublishedMetadata>> => {
	cacheLife('weeks')
	cacheTag('metadata', `metadata-${pathname.replace(/^\/+|\/+$/g, '') || 'home'}`)

	return fetchPublished<PublishedMetadata>(
		withQuery('/api/v1/metadata/by-path', { pathname }),
		'metadata',
	)
}
