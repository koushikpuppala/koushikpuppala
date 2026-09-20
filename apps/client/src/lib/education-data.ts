import type { PublishedEducation } from 'types/models'

import { cache } from 'react'
import { getPublishedEducation } from 'actions/cache/education'
import { API_EDUCATION_FALLBACK } from 'constants/api-fallback'

export const getEducationData = cache(async (): Promise<PublishedEducation[]> => {
	const { result, error } = await getPublishedEducation()

	if (error || !result) return API_EDUCATION_FALLBACK

	return result.map((item, idx) => {
		const startYear = item.startDate ? new Date(String(item.startDate)).getFullYear() : ''
		const endYear = item.endDate ? new Date(String(item.endDate)).getFullYear() : 'Present'
		const period = startYear ? `${startYear} — ${endYear}` : 'Verified'

		return {
			id: String(item.id || `remote-edu-${idx}`),
			degree: String(item.degree || ''),
			fieldOfStudy: String(item.fieldOfStudy || ''),
			university: String(item.university || ''),
			location: String(item.location || ''),
			periodFormatted: period,
			startDate: String(item.startDate || ''),
			endDate: item.endDate ? String(item.endDate) : null,
			isCurrent: Boolean(item.isCurrent),
			description: Array.isArray(item.description) ? item.description : [],
			achievements: Array.isArray(item.achievements) ? item.achievements : [],
			focusAreas:
				Array.isArray(item.description) && item.description.length > 0
					? item.description
					: [item.fieldOfStudy || 'Computer Science', 'Algorithms', 'Distributed Systems'],
			website: item.website ? String(item.website) : null,
			sortOrder: Number(item.sortOrder ?? idx),
		}
	})
})
