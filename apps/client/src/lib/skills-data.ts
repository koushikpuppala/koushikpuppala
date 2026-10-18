import type { PublishedService } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedServices } from 'actions/cache/services'

export const getServicesData = cache(async (): Promise<PublishedService[]> => {
	const result = unwrap(await getPublishedServices(), 'services')

	if (!result) return []

	return result.map((s, idx) => ({
		id: String(s.id || `remote-srv-${idx}`),
		title: String(s.title || ''),
		description: String(s.description || ''),
		features: Array.isArray(s.features) ? s.features : [],
		imageUrl: s.image?.url || null,
		sortOrder: Number(s.sortOrder ?? idx),
	}))
})
