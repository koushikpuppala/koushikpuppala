import type { PublishedHome } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedHome } from 'actions/cache/home'
import { EMPTY_HOME } from 'constants/empty-content'

export const getHomeData = cache(async (): Promise<PublishedHome> => {
	const result = unwrap(await getPublishedHome(), 'home')

	if (!result) return EMPTY_HOME

	return {
		title: result.title || '',
		separator: result.separator || '',
		subtitles: Array.isArray(result.subtitles) ? result.subtitles : [],
		content: result.content || '',
		ctaLabel: result.ctaLabel || '',
		ctaUrl: result.ctaUrl || '',
		secondaryCtaLabel: result.secondaryCtaLabel || '',
		secondaryCtaUrl: result.secondaryCtaUrl || '',
		featuredSkills: Array.isArray(result.featuredSkills) ? result.featuredSkills : [],
		stats: result.stats || {},
		profileImageUrl: result.profileImage?.url || null,
	}
})
