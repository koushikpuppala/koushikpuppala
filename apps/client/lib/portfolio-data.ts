'use cache'

import { cache } from 'react'
import { fetchApi } from './api-client'
import type {
	About,
	Education,
	Experience,
	Home,
	Project,
	ProjectGalleryItem,
	Resume,
	Service,
	Social,
} from './api-types'
import {
	fallbackAbout,
	fallbackEducation,
	fallbackExperience,
	fallbackHome,
	fallbackProjects,
	fallbackResume,
	fallbackServices,
	fallbackSocials,
} from './api-fallback'

type RawHome = {
	id?: string
	title?: string
	separator?: string
	subtitles?: string[]
	content?: string
	profileImageUrl?: string | null
	profileImage?: { url?: string | null } | null
	ctas?: Array<{ label: string; href: string; variant?: 'primary' | 'outline' | 'ghost' }>
	ctaLabel?: string
	ctaUrl?: string
	secondaryCtaLabel?: string | null
	secondaryCtaUrl?: string | null
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	updatedAt?: string
}

type RawAbout = {
	id?: string
	heading?: string
	bio?: string
	description?: string
	highlights?: string[]
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	updatedAt?: string
}

type RawExperience = {
	id?: string
	organization?: string
	company?: string
	role?: string
	position?: string
	location?: string | null
	startDate?: string
	startYear?: string
	endDate?: string | null
	endYear?: string | null
	description?: string
	technologies?: string[]
	highlights?: string[]
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	order?: number
	sortOrder?: number
}

type RawGalleryItem = {
	id?: string
	url?: string
	caption?: string | null
	altText?: string | null
	order?: number
	sortOrder?: number
}

type RawProject = {
	id?: string
	slug?: string
	title?: string
	summary?: string
	shortDescription?: string
	content?: string
	descriptions?: string[]
	caseStudy?: string
	tags?: string[]
	stack?: string[]
	technologies?: string[]
	repoUrl?: string | null
	github?: string | null
	liveUrl?: string | null
	coverImageUrl?: string | null
	imageUrl?: string | null
	heroImageUrl?: string | null
	featured?: boolean
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	gallery?: RawGalleryItem[]
	updatedAt?: string
}

type RawEducation = {
	id?: string
	institution?: string
	degree?: string
	field?: string | null
	startDate?: string
	endDate?: string | null
	grade?: string | null
	mentor?: string | null
	description?: string | null
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	order?: number
	sortOrder?: number
}

type RawService = {
	id?: string
	title?: string
	description?: string
	icon?: string | null
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	order?: number
	sortOrder?: number
}

type RawResume = {
	id?: string
	title?: string
	version?: string
	fileUrl?: string
	file?: { url?: string } | null
	summary?: string
	updatedAt?: string
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

type RawSocial = {
	id?: string
	platform?: string
	label?: string
	name?: string
	url?: string
	handle?: string | null
	order?: number
	sortOrder?: number
	status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export const getHome = cache(async (): Promise<Home> => {
	const { data } = await fetchApi<RawHome>('/api/v1/home/published')
	if (data) {
		return {
			id: data.id ?? fallbackHome.id,
			title: data.title ?? fallbackHome.title,
			separator: data.separator ?? fallbackHome.separator,
			subtitles:
				Array.isArray(data.subtitles) && data.subtitles.length > 0
					? data.subtitles
					: fallbackHome.subtitles,
			content: data.content ?? fallbackHome.content,
			profileImageUrl:
				data.profileImageUrl ?? data.profileImage?.url ?? fallbackHome.profileImageUrl,
			ctas:
				Array.isArray(data.ctas) && data.ctas.length > 0
					? data.ctas
					: [
							{
								label: data.ctaLabel ?? 'View projects',
								href: data.ctaUrl ?? '/projects',
								variant: 'primary',
							},
							{
								label: data.secondaryCtaLabel ?? 'Get in touch',
								href: data.secondaryCtaUrl ?? '/contact',
								variant: 'ghost',
							},
						],
			status: data.status ?? 'PUBLISHED',
			updatedAt: data.updatedAt ?? fallbackHome.updatedAt,
		}
	}
	return fallbackHome
})

export const getAbout = cache(async (): Promise<About> => {
	const { data } = await fetchApi<RawAbout>('/api/v1/about/published')
	if (data) {
		return {
			id: data.id ?? fallbackAbout.id,
			heading: data.heading ?? fallbackAbout.heading,
			bio: data.bio ?? fallbackAbout.bio,
			description: data.description ?? fallbackAbout.description,
			highlights:
				Array.isArray(data.highlights) && data.highlights.length > 0
					? data.highlights
					: fallbackAbout.highlights,
			status: data.status ?? 'PUBLISHED',
			updatedAt: data.updatedAt ?? fallbackAbout.updatedAt,
		}
	}
	return fallbackAbout
})

export const getExperience = cache(async (): Promise<Experience[]> => {
	const { data } = await fetchApi<RawExperience[]>('/api/v1/experience/published')
	if (Array.isArray(data) && data.length > 0) {
		return data.map((item, i) => ({
			id: item.id ?? `exp-${i + 1}`,
			organization: item.organization ?? item.company ?? '',
			role: item.role ?? item.position ?? '',
			location: item.location ?? null,
			startDate: item.startDate ?? item.startYear ?? '',
			endDate: item.endDate ?? item.endYear ?? null,
			description: item.description ?? '',
			technologies: Array.isArray(item.technologies) ? item.technologies : [],
			highlights: Array.isArray(item.highlights)
				? item.highlights
				: item.description
					? [item.description]
					: [],
			status: item.status ?? 'PUBLISHED',
			order: item.order ?? item.sortOrder ?? i + 1,
		}))
	}
	return fallbackExperience
})

export const getProjects = cache(async (): Promise<Project[]> => {
	const { data } = await fetchApi<RawProject[]>('/api/v1/projects/published')
	if (Array.isArray(data) && data.length > 0) {
		return data.map((p, i) => ({
			id: p.id ?? `prj-${i + 1}`,
			slug: p.slug ?? `project-${i + 1}`,
			title: p.title ?? '',
			summary: p.summary ?? p.shortDescription ?? '',
			content:
				p.content ??
				(Array.isArray(p.descriptions)
					? p.descriptions.join('\n')
					: (p.caseStudy ?? p.summary ?? '')),
			tags: Array.isArray(p.tags) ? p.tags : [],
			stack: Array.isArray(p.stack) ? p.stack : Array.isArray(p.technologies) ? p.technologies : [],
			repoUrl: p.repoUrl ?? p.github ?? null,
			liveUrl: p.liveUrl ?? null,
			coverImageUrl: p.coverImageUrl ?? p.imageUrl ?? p.heroImageUrl ?? null,
			featured: Boolean(p.featured),
			status: p.status ?? 'PUBLISHED',
			gallery: Array.isArray(p.gallery)
				? p.gallery.map(
						(g: RawGalleryItem, gi: number): ProjectGalleryItem => ({
							id: g.id ?? `gal-${gi + 1}`,
							url: g.url ?? '',
							caption: g.caption ?? g.altText ?? null,
							order: g.order ?? g.sortOrder ?? gi + 1,
						}),
					)
				: [],
			updatedAt: p.updatedAt ?? fallbackProjects[0]?.updatedAt ?? '2026-03-01T00:00:00.000Z',
		}))
	}
	return fallbackProjects
})

export const getProject = cache(async (slug: string): Promise<Project | null> => {
	const { data } = await fetchApi<RawProject>(`/api/v1/projects/published/${slug}`)
	if (data) {
		return {
			id: data.id ?? slug,
			slug: data.slug ?? slug,
			title: data.title ?? '',
			summary: data.summary ?? data.shortDescription ?? '',
			content:
				data.content ??
				(Array.isArray(data.descriptions)
					? data.descriptions.join('\n')
					: (data.caseStudy ?? data.summary ?? '')),
			tags: Array.isArray(data.tags) ? data.tags : [],
			stack: Array.isArray(data.stack)
				? data.stack
				: Array.isArray(data.technologies)
					? data.technologies
					: [],
			repoUrl: data.repoUrl ?? data.github ?? null,
			liveUrl: data.liveUrl ?? null,
			coverImageUrl: data.coverImageUrl ?? data.imageUrl ?? data.heroImageUrl ?? null,
			featured: Boolean(data.featured),
			status: data.status ?? 'PUBLISHED',
			gallery: Array.isArray(data.gallery)
				? data.gallery.map(
						(g: RawGalleryItem, gi: number): ProjectGalleryItem => ({
							id: g.id ?? `gal-${gi + 1}`,
							url: g.url ?? '',
							caption: g.caption ?? g.altText ?? null,
							order: g.order ?? g.sortOrder ?? gi + 1,
						}),
					)
				: [],
			updatedAt: data.updatedAt ?? fallbackProjects[0]?.updatedAt ?? '2026-03-01T00:00:00.000Z',
		}
	}
	const fallback = fallbackProjects.find(p => p.slug === slug)
	return fallback ?? null
})

export const getEducation = cache(async (): Promise<Education[]> => {
	const { data } = await fetchApi<RawEducation[]>('/api/v1/education/published')
	if (Array.isArray(data) && data.length > 0) {
		return data.map((edu, i) => ({
			id: edu.id ?? `edu-${i + 1}`,
			institution: edu.institution ?? '',
			degree: edu.degree ?? '',
			field: edu.field ?? null,
			startDate: edu.startDate ?? '',
			endDate: edu.endDate ?? null,
			grade: edu.grade ?? null,
			mentor: edu.mentor ?? null,
			description: edu.description ?? null,
			status: edu.status ?? 'PUBLISHED',
			order: edu.order ?? edu.sortOrder ?? i + 1,
		}))
	}
	return fallbackEducation
})

export const getServices = cache(async (): Promise<Service[]> => {
	const { data } = await fetchApi<RawService[]>('/api/v1/services/published')
	if (Array.isArray(data) && data.length > 0) {
		return data.map((s, i) => ({
			id: s.id ?? `svc-${i + 1}`,
			title: s.title ?? '',
			description: s.description ?? '',
			icon: s.icon ?? null,
			status: s.status ?? 'PUBLISHED',
			order: s.order ?? s.sortOrder ?? i + 1,
		}))
	}
	return fallbackServices
})

export const getResume = cache(async (): Promise<Resume> => {
	const { data } = await fetchApi<RawResume>('/api/v1/resume/latest')
	if (data) {
		return {
			id: data.id ?? fallbackResume.id,
			title: data.title ?? fallbackResume.title,
			version: data.version ?? fallbackResume.version,
			fileUrl: data.fileUrl ?? data.file?.url ?? fallbackResume.fileUrl,
			summary: data.summary ?? fallbackResume.summary,
			updatedAt: data.updatedAt ?? fallbackResume.updatedAt,
			status: data.status ?? 'PUBLISHED',
		}
	}
	return fallbackResume
})

export const getSocials = cache(async (): Promise<Social[]> => {
	const { data } = await fetchApi<RawSocial[]>('/api/v1/socials/visible')
	if (Array.isArray(data) && data.length > 0) {
		return data.map((s, i) => ({
			id: s.id ?? `soc-${i + 1}`,
			platform: s.platform ?? 'github',
			label: s.label ?? s.name ?? '',
			url: s.url ?? '#',
			handle: s.handle ?? null,
			order: s.order ?? s.sortOrder ?? i + 1,
			status: s.status ?? 'PUBLISHED',
		}))
	}
	return fallbackSocials
})
