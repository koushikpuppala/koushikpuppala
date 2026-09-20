import type { PublishedHome } from 'types/models'

import { cache } from 'react'
import { getPublishedHome } from 'actions/cache/home'
import { API_HOME_FALLBACK } from 'constants/api-fallback'

export const getHomeData = cache(async (): Promise<PublishedHome> => {
	const { result, error } = await getPublishedHome()

	if (error || !result) return API_HOME_FALLBACK

	return {
		title: result.title || API_HOME_FALLBACK.title,
		separator: result.separator || API_HOME_FALLBACK.separator,
		subtitles:
			Array.isArray(result.subtitles) && result.subtitles.length > 0
				? result.subtitles
				: API_HOME_FALLBACK.subtitles,
		content: result.content || API_HOME_FALLBACK.content,
		ctaLabel: result.ctaLabel || API_HOME_FALLBACK.ctaLabel,
		ctaUrl: result.ctaUrl || API_HOME_FALLBACK.ctaUrl,
		secondaryCtaLabel: result.secondaryCtaLabel || API_HOME_FALLBACK.secondaryCtaLabel,
		secondaryCtaUrl: result.secondaryCtaUrl || API_HOME_FALLBACK.secondaryCtaUrl,
		featuredSkills:
			Array.isArray(result.featuredSkills) && result.featuredSkills.length > 0
				? result.featuredSkills
				: API_HOME_FALLBACK.featuredSkills,
		stats: result.stats || API_HOME_FALLBACK.stats,
		profileImageUrl: result.profileImage?.url || null,
	}
})
