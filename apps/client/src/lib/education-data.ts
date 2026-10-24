import type { PublishedEducation } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedEducation } from 'actions/cache/education'

export const getEducationData = cache(async (): Promise<PublishedEducation[]> => {
	const result = unwrap(await getPublishedEducation(), 'education')

	if (!result) return []

	return result.map((item, idx) => {
		const startYear = item.startDate ? new Date(String(item.startDate)).getFullYear() : ''
		const endYear = item.endDate ? new Date(String(item.endDate)).getFullYear() : 'Present'
		const period = startYear ? `${startYear} — ${endYear}` : ''

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
			focusAreas: Array.isArray(item.focusAreas) ? item.focusAreas : [],
			website: item.website ? String(item.website) : null,
			sortOrder: Number(item.sortOrder ?? idx),
		}
	})
})
