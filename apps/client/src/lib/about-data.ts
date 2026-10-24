import type { PublishedAbout } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedAbout } from 'actions/cache/about'
import { EMPTY_ABOUT } from 'constants/empty-content'

const text = (value: unknown): string => String(value ?? '')

const list = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : [])

const optionalText = (value: unknown): string | undefined => (value ? String(value) : undefined)

export const getAboutData = cache(async (): Promise<PublishedAbout> => {
	const result = unwrap(await getPublishedAbout(), 'about')

	if (!result) return EMPTY_ABOUT

	return {
		...EMPTY_ABOUT,
		title: text(result.title),
		leadStatement: text(result.leadStatement),
		content: text(result.content),
		biography: text(result.biography),
		location: text(result.location),
		coordinates: text(result.coordinates),
		timezone: text(result.timezone),
		status: text(result.status),
		highlights: list(result.highlights),
		skills: list(result.skills),
		profileImageUrl: result.profileImage?.url || null,
		stats: list(result.stats),
		ctaLabel: text(result.ctaLabel),
		ctaUrl: text(result.ctaUrl),
		createdAt: optionalText(result.createdAt),
		updatedAt: optionalText(result.updatedAt),
	}
})
