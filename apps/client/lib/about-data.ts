import { cache } from 'react'
import type { AboutModel } from 'types/models'
import { fetchApi } from './api-client'

export interface AboutMetric {
	label: string
	value: string
	detail?: string
}

export interface PortfolioAbout {
	title: string
	leadStatement: string
	content: string
	biography: string
	location: string
	coordinates: string
	timezone: string
	status: string
	highlights: string[]
	stats: AboutMetric[]
	ctaLabel: string
	ctaUrl: string
}

/**
 * Authoritative About Dataset
 * Matches production seed and database model without inventing data.
 */
export const ABOUT_DATA: PortfolioAbout = {
	title: 'About Koushik Puppala',
	leadStatement:
		'Bridging intuitive, high-performance user interfaces with resilient, observable distributed backend systems.',
	content:
		'Hi there, I am Koushik Puppala! Software engineer at Upraised® and Team Lead & Mentor for the Indian Institute of Information Technology Raichur web systems team. Formerly served as Google Developer Student Clubs (GDSC) lead.',
	biography:
		'I specialize in designing and engineering high-throughput backend services, performant web interfaces, and modern cloud infrastructure. My work emphasizes architectural discipline, deterministic application state, sub-50ms API responses, and clean modular code with TypeScript, Next.js 16, NestJS 11, and PostgreSQL.',
	location: 'Bengaluru, Karnataka, India',
	coordinates: '12.9716° N, 77.5946° E',
	timezone: 'UTC+5:30 (IST)',
	status: 'AVAILABLE FOR WORK // GLOBAL REMOTE',
	highlights: [
		'Software Engineer at Upraised® scaling core platform services',
		'Head & Mentor for IIIT Raichur Web Systems Team',
		'Former Google Developer Student Clubs (GDSC) Lead',
		'Engineered production systems serving thousands of active users',
	],
	stats: [
		{ label: 'EXPERIENCE', value: '3+', detail: 'Years of Production Engineering' },
		{ label: 'SYSTEMS', value: '20+', detail: 'Projects & Platforms Delivered' },
		{ label: 'CONTRIBUTIONS', value: '1.8k+', detail: 'Open-Source Commits' },
		{ label: 'MENTORSHIP', value: '50+', detail: 'Junior Engineers Guided' },
	],
	ctaLabel: 'Read Full Biography',
	ctaUrl: '/about',
}

/**
 * Fetch published about record with static fallback.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getAboutData = cache(async (): Promise<PortfolioAbout> => {
	const { data } = await fetchApi<AboutModel>('/api/v1/about/published')

	if (data) {
		return {
			...ABOUT_DATA,
			title: String(data.title || ABOUT_DATA.title),
			content: String(data.content || ABOUT_DATA.content),
			biography: String(data.biography || ABOUT_DATA.biography),
			highlights:
				Array.isArray(data.highlights) && data.highlights.length > 0
					? data.highlights
					: ABOUT_DATA.highlights,
			ctaLabel: data.ctaLabel || ABOUT_DATA.ctaLabel,
			ctaUrl: data.ctaUrl || ABOUT_DATA.ctaUrl,
		}
	}

	return ABOUT_DATA
})
