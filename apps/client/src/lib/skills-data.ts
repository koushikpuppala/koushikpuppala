import type { PublishedService, PublishedSkill, PublishedSkillCluster } from 'types/models'

import { cache } from 'react'
import { getPublishedSkills } from 'actions/cache/skills'
import { getPublishedServices } from 'actions/cache/services'
import { API_SERVICE_FALLBACK, API_SKILLS_FALLBACK } from 'constants/api-fallback'

export const getSkillClusters = cache(async (): Promise<PublishedSkillCluster[]> => {
	const { result, error } = await getPublishedSkills()

	if (error || !result) return API_SKILLS_FALLBACK

	const categoryMap: Record<string, PublishedSkill[]> = {}

	for (const s of result) {
		const cat = String(s.category || 'General')

		if (!categoryMap[cat]) categoryMap[cat] = []

		categoryMap[cat].push({
			id: String(s.id),
			name: String(s.name),
			category: cat,
			proficiency: typeof s.proficiency === 'number' ? s.proficiency : undefined,
			icon: s.icon ? String(s.icon) : undefined,
			featured: Boolean(s.featured),
			sortOrder: Number(s.sortOrder ?? 0),
		})
	}

	return API_SKILLS_FALLBACK.map(cluster => {
		const matchKey = Object.keys(categoryMap).find(
			k =>
				k.toLowerCase().includes(cluster.id.toLowerCase()) ||
				cluster.title.toLowerCase().includes(k.toLowerCase()) ||
				(cluster.id === 'languages-core' && k.toLowerCase().includes('languages')),
		)

		if (matchKey && categoryMap[matchKey]?.length)
			return {
				...cluster,
				skills: categoryMap[matchKey].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
			}

		return cluster
	})
})

export const getServicesData = cache(async (): Promise<PublishedService[]> => {
	const { result, error } = await getPublishedServices()

	if (error || !result) return API_SERVICE_FALLBACK

	return result.map((s, idx) => ({
		id: String(s.id || `remote-srv-${idx}`),
		title: String(s.title || ''),
		description: String(s.description || ''),
		features: Array.isArray(s.features) ? s.features : [],
		imageUrl: s.image?.url || null,
		sortOrder: Number(s.sortOrder ?? idx),
	}))
})
