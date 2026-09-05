import { cache } from 'react'
import type { HomeModel } from 'types/models'
import { fetchApi } from './api-client'

export interface PortfolioHome {
	title: string
	separator: string
	subtitles: string[]
	content: string
	ctaLabel: string
	ctaUrl: string
	secondaryCtaLabel?: string | null
	secondaryCtaUrl?: string | null
	featuredSkills: string[]
	stats?: Record<string, unknown> | null
	profileImageUrl?: string | null
}

/**
 * Authoritative Fallback Homepage Dataset
 * Preserves the exact verified identity and trajectory.
 */
export const AUTHORITATIVE_HOME: PortfolioHome = {
	title: 'KOUSHIK PUPPALA',
	separator: '|',
	subtitles: [
		'Senior Full-Stack & AI Systems Engineer',
		'Software Engineer at Upraised®',
		'Team Lead & Mentor — IIIT Raichur Web Systems',
		'Former Google Developer Student Clubs (GDSC) Lead',
	],
	content:
		'Architecting resilient distributed platforms, high-throughput web systems, and AI-enabled digital experiences. Engineering with TypeScript, Next.js 16, NestJS, and PostgreSQL.',
	ctaLabel: 'Explore Selected Work',
	ctaUrl: '#projects',
	secondaryCtaLabel: 'Get In Touch',
	secondaryCtaUrl: '#contact',
	featuredSkills: ['TypeScript', 'Next.js 16', 'NestJS 11', 'PostgreSQL', 'Redis', 'AWS'],
	stats: {
		yearsOfExperience: '3+',
		projectsDelivered: '20+',
		openSourceCommits: '1.8k+',
		menteesGuided: '50+',
	},
	profileImageUrl: null,
}

/**
 * Fetch published homepage content from authoritative backend API
 * with resilient fallback for static prerendering when backend is offline.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getHomeData = cache(async (): Promise<PortfolioHome> => {
	const { data } = await fetchApi<HomeModel>('/api/v1/home/published')

	if (data) {
		return {
			title: data.title || AUTHORITATIVE_HOME.title,
			separator: data.separator || AUTHORITATIVE_HOME.separator,
			subtitles:
				Array.isArray(data.subtitles) && data.subtitles.length > 0
					? data.subtitles
					: AUTHORITATIVE_HOME.subtitles,
			content: data.content || AUTHORITATIVE_HOME.content,
			ctaLabel: data.ctaLabel || AUTHORITATIVE_HOME.ctaLabel,
			ctaUrl: data.ctaUrl || AUTHORITATIVE_HOME.ctaUrl,
			secondaryCtaLabel: data.secondaryCtaLabel || AUTHORITATIVE_HOME.secondaryCtaLabel,
			secondaryCtaUrl: data.secondaryCtaUrl || AUTHORITATIVE_HOME.secondaryCtaUrl,
			featuredSkills:
				Array.isArray(data.featuredSkills) && data.featuredSkills.length > 0
					? data.featuredSkills
					: AUTHORITATIVE_HOME.featuredSkills,
			stats: data.stats || AUTHORITATIVE_HOME.stats,
			profileImageUrl: data.profileImage?.url || null,
		}
	}

	return AUTHORITATIVE_HOME
})
