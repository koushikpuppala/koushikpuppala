import type { PublishedExperience } from 'types/models'

import { cache } from 'react'
import { API_EXPERIENCE_FALLBACK } from 'constants/api-fallback'
import { getPublishedExperience } from 'actions/cache/experience'

export const formatEmploymentType = (type: string): string => {
	switch (type) {
		case 'FULL_TIME':
			return 'FULL-TIME'
		case 'PART_TIME':
			return 'PART-TIME'
		case 'INTERN':
			return 'INTERNSHIP'
		case 'CONTRACT':
			return 'CONTRACT'
		case 'FREELANCE':
			return 'FREELANCE'
		default:
			return type
	}
}

export const formatPeriod = (
	startDate: string,
	endDate?: string | null,
	isCurrent?: boolean,
): string => {
	const startYear = new Date(startDate).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
	})

	if (isCurrent || !endDate) return `${startYear} — Present`

	const endYear = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

	return `${startYear} — ${endYear}`
}

export const getExperienceData = cache(async (): Promise<PublishedExperience[]> => {
	const { result, error } = await getPublishedExperience()

	if (error || !result) return API_EXPERIENCE_FALLBACK

	return result.map((item, idx) => ({
		id: String(item.id || `remote-exp-${idx}`),
		title: String(item.title || ''),
		company: String(item.company || ''),
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
