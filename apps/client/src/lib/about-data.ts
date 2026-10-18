import type { PublishedAbout } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedAbout } from 'actions/cache/about'
import { EMPTY_ABOUT } from 'constants/empty-content'

export const getAboutData = cache(async (): Promise<PublishedAbout> => {
	const result = unwrap(await getPublishedAbout(), 'about')

	if (!result) return EMPTY_ABOUT

	return {
		...EMPTY_ABOUT,
		title: String(result.title ?? ''),
		leadStatement: String(result.leadStatement ?? ''),
		content: String(result.content ?? ''),
		biography: String(result.biography ?? ''),
		location: String(result.location ?? ''),
		coordinates: String(result.coordinates ?? ''),
		timezone: String(result.timezone ?? ''),
		status: String(result.status ?? ''),
		highlights: Array.isArray(result.highlights) ? result.highlights : [],
		stats: Array.isArray(result.stats) ? result.stats : [],
		ctaLabel: String(result.ctaLabel ?? ''),
		ctaUrl: String(result.ctaUrl ?? ''),
	}
})
