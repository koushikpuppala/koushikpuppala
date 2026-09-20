import type { PublishedProject, PublishedProjectGalleryItem } from 'types/models'

import { cache } from 'react'
import { API_PROJECT_FALLBACK } from 'constants/api-fallback'
import { getPublishedProjects, getPublishedProjectBySlug } from 'actions/cache/projects'

export const FEATURED_PROJECTS = API_PROJECT_FALLBACK.filter(p => p.featured)

export const getProjectsData = cache(async (): Promise<PublishedProject[]> => {
	const { result, error } = await getPublishedProjects()

	if (error || !result) return API_PROJECT_FALLBACK

	return result.map((item, idx): PublishedProject => ({
		id: String(item.id || `remote-${idx}`),
		slug: String(item.slug || ''),
		title: String(item.title || ''),
		subtitle: String(item.subtitle || ''),
		category: String(item.category || 'Engineering'),
		projectType: String(item.projectType || 'Project'),
		featured: Boolean(item.featured),
		status: (item.status as PublishedProject['status']) || 'COMPLETED',
		shortDescription: String(item.shortDescription || ''),
		descriptions: Array.isArray(item.descriptions) ? item.descriptions : [],
		caseStudy: item.caseStudy ? String(item.caseStudy) : undefined,
		tags: Array.isArray(item.tags) ? item.tags : [],
		technologies: Array.isArray(item.technologies) ? item.technologies : [],
		imageUrl: item.thumbnail?.url || item.heroImage?.url || null,
		heroImageUrl: item.heroImage?.url || null,
		liveUrl: item.liveUrl ? String(item.liveUrl) : null,
		github: item.github ? String(item.github) : null,
		metrics:
			item.metrics && typeof item.metrics === 'object'
				? (item.metrics as Record<string, string>)
				: undefined,
		role: String(item.role || 'Lead Architect & Engineer'),
		year: item.startDate ? String(new Date(String(item.startDate)).getFullYear()) : '2025',
		sortOrder: Number(item.sortOrder ?? idx),
	}))
})

export const getFeaturedProjects = cache(async (): Promise<PublishedProject[]> => {
	const all = await getProjectsData()

	const featured = all.filter(p => p.featured)

	return featured.length > 0 ? featured : FEATURED_PROJECTS
})

export const getProjectBySlug = cache(async (slug: string): Promise<PublishedProject | null> => {
	const { result, error } = await getPublishedProjectBySlug(slug)

	if (error || !result) return API_PROJECT_FALLBACK.find(p => p.slug === slug) || null

	const galleryItems: PublishedProjectGalleryItem[] = Array.isArray(result.gallery)
		? result.gallery.map(g => ({
				id: String(g.mediaId || g.media?.id || Math.random()),
				url: String(g.media?.url || ''),
				altText: String(g.altText || g.media?.altText || result.title),
				caption: g.caption ? String(g.caption) : undefined,
				title: g.title ? String(g.title) : undefined,
				description: g.description ? String(g.description) : undefined,
				sortOrder: Number(g.sortOrder || 0),
			}))
		: []

	return {
		id: String(result.id),
		slug: String(result.slug),
		title: String(result.title),
		subtitle: String(result.subtitle || ''),
		category: String(result.category || 'Engineering'),
		projectType: String(result.projectType || 'Platform'),
		featured: Boolean(result.featured),
		status: (result.status as PublishedProject['status']) || 'COMPLETED',
		shortDescription: String(result.shortDescription || ''),
		descriptions: Array.isArray(result.descriptions) ? result.descriptions : [],
		caseStudy: result.caseStudy ? String(result.caseStudy) : undefined,
		tags: Array.isArray(result.tags) ? result.tags : [],
		technologies: Array.isArray(result.technologies) ? result.technologies : [],
		imageUrl: result.thumbnail?.url || result.heroImage?.url || null,
		heroImageUrl: result.heroImage?.url || null,
		gallery: galleryItems.length > 0 ? galleryItems : undefined,
		liveUrl: result.liveUrl ? String(result.liveUrl) : null,
		github: result.github ? String(result.github) : null,
		metrics:
			result.metrics && typeof result.metrics === 'object'
				? (result.metrics as Record<string, string>)
				: undefined,
		role: String(result.role || 'Lead Architect & Engineer'),
		year: result.startDate ? String(new Date(String(result.startDate)).getFullYear()) : '2025',
		sortOrder: Number(result.sortOrder || 0),
	}
})

export const getAdjacentProjects = cache(
	async (
		slug: string,
	): Promise<{ prev: PublishedProject | null; next: PublishedProject | null }> => {
		const all = await getProjectsData()

		const index = all.findIndex(p => p.slug === slug)

		if (index === -1 || all.length <= 1) return { prev: null, next: null }

		const prevIndex = (index - 1 + all.length) % all.length

		const nextIndex = (index + 1) % all.length

		return { prev: all[prevIndex] || null, next: all[nextIndex] || null }
	},
)
