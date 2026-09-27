'use cache'

import type { ApiResponse } from 'types/api'
import type { PublishedMetadata } from 'types/models'

import { BASE_URL } from 'constants/base-url'
import { cacheLife, cacheTag } from 'next/cache'

export const getPublishedMetadataByKey = async (
	key: string,
): Promise<ApiResponse<PublishedMetadata>> => {
	cacheLife('weeks')
	cacheTag(`metadata-${key}`)

	try {
		const response = await fetch(`${BASE_URL}/api/v1/metadata/key/${encodeURIComponent(key)}`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch metadata.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching metadata.',
		}
	}
}

export const getPublishedMetadataByPath = async (
	pathname: string,
): Promise<ApiResponse<PublishedMetadata>> => {
	cacheLife('weeks')
	const normalizedKey = pathname.replace(/^\/+|\/+$/g, '') || 'home'
	cacheTag(`metadata-${normalizedKey}`)

	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/metadata/by-path?pathname=${encodeURIComponent(pathname)}`,
			{
				headers: { 'Content-Type': 'application/json' },
			},
		)

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch metadata.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching metadata.',
		}
	}
}

export const getAllPublishedMetadata = async (): Promise<ApiResponse<PublishedMetadata[]>> => {
	cacheLife('weeks')
	cacheTag('metadata')

	try {
		const response = await fetch(`${BASE_URL}/api/v1/metadata/published`, {
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok) throw new Error(data.message || 'Failed to fetch metadata list.')

		return data
	} catch (error) {
		return {
			error: true,
			message: (error as Error).message || 'An error occurred while fetching metadata list.',
		}
	}
}

export const getPublishedMetadata = getAllPublishedMetadata
