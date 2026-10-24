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

const text = (value: unknown): string => String(value || '')

const optionalText = (value: unknown): string | undefined => (value ? String(value) : undefined)

const nullableText = (value: unknown): string | null => (value ? String(value) : null)

const strings = (value: unknown): string[] => (Array.isArray(value) ? value : [])

const yearOf = (date: unknown): string => (date ? String(new Date(String(date)).getFullYear()) : '')

const metricsOf = (value: unknown): Record<string, string> | undefined =>
	value && typeof value === 'object' ? (value as Record<string, string>) : undefined

const toProject = (item: PublishedProject, index: number): PublishedProject => ({
	id: String(item.id || `remote-${index}`),
	slug: text(item.slug),
	title: text(item.title),
	subtitle: text(item.subtitle),
	category: text(item.category),
	projectType: text(item.projectType),
	featured: Boolean(item.featured),
	status: (item.status as PublishedProject['status']) || 'COMPLETED',
	shortDescription: text(item.shortDescription),
	descriptions: strings(item.descriptions),
	caseStudy: optionalText(item.caseStudy),
	tags: strings(item.tags),
	technologies: strings(item.technologies),
	imageUrl: toImageSrc(item.thumbnail?.url || item.heroImage?.url),
	heroImageUrl: toImageSrc(item.heroImage?.url),
	liveUrl: nullableText(item.liveUrl),
	github: nullableText(item.github),
	metrics: metricsOf(item.metrics),
	role: text(item.role),
	year: yearOf(item.startDate),
	startDate: optionalText(item.startDate),
	publishedAt: optionalText(item.publishedAt),
	sortOrder: Number(item.sortOrder ?? index),
})

const toGallery = (project: PublishedProject): PublishedProjectGalleryItem[] =>
	(Array.isArray(project.gallery) ? project.gallery : []).map((g, idx) => ({
		id: String(g.mediaId || g.media?.id || idx),
		url: toImageSrc(g.media?.url) ?? '',
		altText: String(g.altText || g.media?.altText || project.title),
		caption: optionalText(g.caption),
		title: optionalText(g.title),
		description: optionalText(g.description),
		sortOrder: Number(g.sortOrder || 0),
	}))

export const getProjectsData = cache(async (): Promise<PublishedProject[]> => {
	const result = unwrap(await getPublishedProjects(), 'projects')

	return result ? result.map(toProject) : []
})

export const getFeaturedProjects = cache(async (): Promise<PublishedProject[]> => {
	const all = await getProjectsData()

	return all.filter(p => p.featured)
})

export const getProjectBySlug = cache(async (slug: string): Promise<PublishedProject | null> => {
	const { result, error, message } = await getPublishedProjectBySlug(slug)

	if (error) console.error(`[projects] API request for '${slug}' failed:`, message)

	if (error || !result) return null

	const gallery = toGallery(result)

	return {
		...toProject(result, 0),
		gallery: gallery.length > 0 ? gallery : undefined,
		updatedAt: optionalText(result.updatedAt),
	}
})
