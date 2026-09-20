import type { PublishedResume } from 'types/models'

import { cache } from 'react'
import { getPublishedResume } from 'actions/cache/resume'
import { API_RESUME_FALLBACK } from 'constants/api-fallback'

export const getResumeData = cache(async (): Promise<PublishedResume> => {
	const { result, error } = await getPublishedResume()

	if (error || !result) return API_RESUME_FALLBACK

	const size = Number(result.fileSize || API_RESUME_FALLBACK.fileSize)

	const sizeKb = Math.round(size / 1024)

	const dl = result.downloadUrl || result.media?.url || API_RESUME_FALLBACK.downloadUrl

	return {
		...API_RESUME_FALLBACK,
		id: String(result.id || API_RESUME_FALLBACK.id),
		title: result.title || API_RESUME_FALLBACK.title,
		versionName: result.versionName || API_RESUME_FALLBACK.versionName,
		fileSize: size,
		fileSizeFormatted: `${sizeKb} KB`,
		downloadUrl: dl,
		previewUrl: dl,
		headline: String(result.headline || API_RESUME_FALLBACK.headline),
		summary: String(result.summary || API_RESUME_FALLBACK.summary),
		highlights:
			Array.isArray(result.highlights) && result.highlights.length > 0
				? result.highlights
				: API_RESUME_FALLBACK.highlights,
		competencies:
			Array.isArray(result.competencies) && result.competencies.length > 0
				? result.competencies
				: API_RESUME_FALLBACK.competencies,
		stats:
			Array.isArray(result.stats) && result.stats.length > 0
				? result.stats
				: API_RESUME_FALLBACK.stats,
		isVerified: Boolean(result.isVerified || API_RESUME_FALLBACK.isVerified),
	}
})
