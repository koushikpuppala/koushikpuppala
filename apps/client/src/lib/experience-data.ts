import type { PublishedExperience } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedExperience } from 'actions/cache/experience'

const formatPeriod = (startDate: string, endDate?: string | null, isCurrent?: boolean): string => {
	const startYear = new Date(startDate).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
	})

	if (isCurrent || !endDate) return `${startYear} — Present`

	const endYear = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

	return `${startYear} — ${endYear}`
}

export const getExperienceData = cache(async (): Promise<PublishedExperience[]> => {
	const result = unwrap(await getPublishedExperience(), 'experience')

	if (!result) return []

	return result.map((item, idx) => ({
		id: String(item.id || `remote-exp-${idx}`),
		title: String(item.title || ''),
		organization: String(item.organization || ''),
		location: String(item.location || ''),
		employmentType: item.employmentType || 'FULL_TIME',
		startDate: String(item.startDate || ''),
		endDate: item.endDate ? String(item.endDate) : null,
		periodFormatted: formatPeriod(
			String(item.startDate || ''),
			item.endDate ? String(item.endDate) : null,
			Boolean(item.isCurrent),
		),
		isCurrent: Boolean(item.isCurrent),
		featured: Boolean(item.featured),
		description: Array.isArray(item.description) ? item.description : [],
		achievements: Array.isArray(item.achievements) ? item.achievements : [],
		technologies: Array.isArray(item.technologies) ? item.technologies : [],
		website: item.website ? String(item.website) : null,
		sortOrder: Number(item.sortOrder ?? idx),
	}))
})
