import type { PublishedAbout } from 'types/models'

import { cache } from 'react'
import { getPublishedAbout } from 'actions/cache/about'
import { API_ABOUT_FALLBACK } from 'constants/api-fallback'

export const getAboutData = cache(async (): Promise<PublishedAbout> => {
	const { result, error } = await getPublishedAbout()

	if (error || !result) return API_ABOUT_FALLBACK

	return {
		...API_ABOUT_FALLBACK,
		title: String(result.title ?? API_ABOUT_FALLBACK.title),
		leadStatement: String(result.leadStatement ?? API_ABOUT_FALLBACK.leadStatement),
		content: String(result.content ?? API_ABOUT_FALLBACK.content),
		biography: String(result.biography ?? API_ABOUT_FALLBACK.biography),
		location: String(result.location ?? API_ABOUT_FALLBACK.location),
		coordinates: String(result.coordinates ?? API_ABOUT_FALLBACK.coordinates),
		timezone: String(result.timezone ?? API_ABOUT_FALLBACK.timezone),
		status: String(result.status ?? API_ABOUT_FALLBACK.status),
		highlights:
			Array.isArray(result.highlights) && result.highlights.length > 0
				? result.highlights
				: API_ABOUT_FALLBACK.highlights,
		stats:
			Array.isArray(result.stats) && result.stats.length > 0
				? result.stats
				: API_ABOUT_FALLBACK.stats,
		ctaLabel: String(result.ctaLabel ?? API_ABOUT_FALLBACK.ctaLabel),
		ctaUrl: String(result.ctaUrl ?? API_ABOUT_FALLBACK.ctaUrl),
	}
})
