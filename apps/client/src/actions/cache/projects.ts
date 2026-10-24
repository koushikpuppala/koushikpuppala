'use cache'

import type { ApiResponse, PublishedProjectQuery } from 'types/api'
import type { PublishedProject } from 'types/models'

import { cacheLife, cacheTag } from 'next/cache'
import { fetchPublished, withQuery } from 'lib/fetch-published'

export const getPublishedProjects = async (
	params?: PublishedProjectQuery,
): Promise<ApiResponse<PublishedProject[]>> => {
	cacheLife('weeks')
	cacheTag(
		'projects',
		`projects-${params?.category || 'all'}-${params?.featured === undefined ? 'all' : params.featured ? 'featured' : 'regular'}`,
	)

	return fetchPublished<PublishedProject[]>(
		withQuery('/api/v1/projects/published', {
			category: params?.category,
			featured: params?.featured === undefined ? undefined : String(params.featured),
		}),
		'projects data',
	)
}

export const getPublishedProjectBySlug = async (
	slug: string,
): Promise<ApiResponse<PublishedProject>> => {
	cacheLife('weeks')
	cacheTag('projects', `projects-${slug}`)

	return fetchPublished<PublishedProject>(`/api/v1/projects/published/${slug}`, 'project data')
}
