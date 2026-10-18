import type { PublishedProject, PublishedProjectGalleryItem } from 'types/models'

import { cache } from 'react'
import { unwrap } from 'lib/api-result'
import { getPublishedProjects, getPublishedProjectBySlug } from 'actions/cache/projects'
import { SITE_DOMAIN } from 'constants/site'

// Images hosted on this site are turned into relative paths so next/image serves them locally.
const toImageSrc = (url: string | null | undefined): string | null => {
	if (!url) return null

	return url.startsWith(`${SITE_DOMAIN}/`) ? url.slice(SITE_DOMAIN.length) : url
}

export const getProjectsData = cache(async (): Promise<PublishedProject[]> => {
	const result = unwrap(await getPublishedProjects(), 'projects')

	if (!result) return []

	return result.map((item, idx): PublishedProject => ({
		id: String(item.id || `remote-${idx}`),
		slug: String(item.slug || ''),
		title: String(item.title || ''),
		subtitle: String(item.subtitle || ''),
		category: String(item.category || ''),
		projectType: String(item.projectType || ''),
		featured: Boolean(item.featured),
		status: (item.status as PublishedProject['status']) || 'COMPLETED',
		shortDescription: String(item.shortDescription || ''),
		descriptions: Array.isArray(item.descriptions) ? item.descriptions : [],
		caseStudy: item.caseStudy ? String(item.caseStudy) : undefined,
		tags: Array.isArray(item.tags) ? item.tags : [],
		technologies: Array.isArray(item.technologies) ? item.technologies : [],
		imageUrl: toImageSrc(item.thumbnail?.url || item.heroImage?.url),
		heroImageUrl: toImageSrc(item.heroImage?.url),
		liveUrl: item.liveUrl ? String(item.liveUrl) : null,
		github: item.github ? String(item.github) : null,
		metrics:
			item.metrics && typeof item.metrics === 'object'
				? (item.metrics as Record<string, string>)
				: undefined,
		role: String(item.role || ''),
		year: item.startDate ? String(new Date(String(item.startDate)).getFullYear()) : '',
		sortOrder: Number(item.sortOrder ?? idx),
	}))
})

export const getFeaturedProjects = cache(async (): Promise<PublishedProject[]> => {
	const all = await getProjectsData()

	return all.filter(p => p.featured)
})

export const getProjectBySlug = cache(async (slug: string): Promise<PublishedProject | null> => {
	const { result, error, message } = await getPublishedProjectBySlug(slug)

	if (error || !result) {
		if (error) console.error(`[projects] API request for '${slug}' failed:`, message)
		return null
	}

	const galleryItems: PublishedProjectGalleryItem[] = Array.isArray(result.gallery)
		? result.gallery.map((g, idx) => ({
				id: String(g.mediaId || g.media?.id || idx),
				url: toImageSrc(g.media?.url) ?? '',
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
		category: String(result.category || ''),
		projectType: String(result.projectType || ''),
		featured: Boolean(result.featured),
		status: (result.status as PublishedProject['status']) || 'COMPLETED',
		shortDescription: String(result.shortDescription || ''),
		descriptions: Array.isArray(result.descriptions) ? result.descriptions : [],
		caseStudy: result.caseStudy ? String(result.caseStudy) : undefined,
		tags: Array.isArray(result.tags) ? result.tags : [],
		technologies: Array.isArray(result.technologies) ? result.technologies : [],
		imageUrl: toImageSrc(result.thumbnail?.url || result.heroImage?.url),
		heroImageUrl: toImageSrc(result.heroImage?.url),
		gallery: galleryItems.length > 0 ? galleryItems : undefined,
		liveUrl: result.liveUrl ? String(result.liveUrl) : null,
		github: result.github ? String(result.github) : null,
		metrics:
			result.metrics && typeof result.metrics === 'object'
				? (result.metrics as Record<string, string>)
				: undefined,
		role: String(result.role || ''),
		year: result.startDate ? String(new Date(String(result.startDate)).getFullYear()) : '',
		sortOrder: Number(result.sortOrder || 0),
		updatedAt: result.updatedAt ? String(result.updatedAt) : undefined,
	}
})
