import type { PublishedResume } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedResume } from 'actions/cache/resume'
import { EMPTY_RESUME } from 'constants/empty-content'

export const getResumeData = cache(async (): Promise<PublishedResume> => {
	const result = unwrap(await getPublishedResume(), 'resume')

	if (!result) return EMPTY_RESUME

	const size = Number(result.fileSize || result.media?.size || 0)

	const dl = result.downloadUrl || result.media?.url || ''

	return {
		...EMPTY_RESUME,
		id: String(result.id || ''),
		title: result.title || '',
		versionName: result.versionName || '',
		fileSize: size,
		fileSizeFormatted: size ? `${Math.round(size / 1024)} KB` : '',
		fileType: result.fileType || '',
		downloadUrl: dl,
		previewUrl: dl,
		headline: String(result.headline || ''),
		summary: String(result.summary || ''),
		highlights: Array.isArray(result.highlights) ? result.highlights : [],
		competencies: Array.isArray(result.competencies) ? result.competencies : [],
		stats: Array.isArray(result.stats) ? result.stats : [],
		updatedAt: result.updatedAt ? String(result.updatedAt) : undefined,
	}
})
