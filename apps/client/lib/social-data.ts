import { cache } from 'react'
import type { SocialModel } from 'types/models'
import { fetchApi } from './api-client'
import type { DirectChannel } from './contact-data'

export interface PortfolioSocial {
	id: string
	platform: string
	url: string
	label: string
	handle?: string
	icon?: string | null
	featured: boolean
	sortOrder: number
}

/**
 * Authoritative Verified Social Channels Dataset
 * Matches database seed and production verified channels.
 */
export const AUTHORITATIVE_SOCIALS: PortfolioSocial[] = [
	{
		id: 'soc-github',
		platform: 'GITHUB',
		label: 'GitHub',
		handle: 'koushikpuppala',
		url: 'https://github.com/koushikpuppala',
		icon: 'si:github',
		featured: true,
		sortOrder: 0,
	},
	{
		id: 'soc-linkedin',
		platform: 'LINKEDIN',
		label: 'LinkedIn',
		handle: 'in/koushikpuppala',
		url: 'https://www.linkedin.com/in/koushikpuppala',
		icon: 'si:linkedin',
		featured: true,
		sortOrder: 1,
	},
	{
		id: 'soc-twitter',
		platform: 'TWITTER',
		label: 'Twitter / X',
		handle: '@puppala_koushik',
		url: 'https://twitter.com/puppala_koushik',
		icon: 'si:x',
		featured: false,
		sortOrder: 2,
	},
	{
		id: 'soc-discord',
		platform: 'DISCORD',
		label: 'Discord Hub',
		handle: 'koushikpuppala',
		url: 'https://discord.gg/MsJ99j5Bcv',
		icon: 'si:discord',
		featured: false,
		sortOrder: 3,
	},
	{
		id: 'soc-email',
		platform: 'EMAIL',
		label: 'Direct Email',
		handle: 'koushikpuppala@koushikpuppala.com',
		url: 'mailto:koushikpuppala@koushikpuppala.com',
		icon: 'si:gmail',
		featured: true,
		sortOrder: 4,
	},
]

/**
 * Format platform string into a friendly label if missing
 */
function formatPlatformLabel(platform: string): string {
	switch (platform.toUpperCase()) {
		case 'GITHUB':
			return 'GitHub'
		case 'LINKEDIN':
			return 'LinkedIn'
		case 'TWITTER':
			return 'Twitter / X'
		case 'DISCORD':
			return 'Discord Hub'
		case 'EMAIL':
			return 'Direct Email'
		case 'WEBSITE':
			return 'Official Website'
		case 'YOUTUBE':
			return 'YouTube'
		default:
			return platform
	}
}

/**
 * Format platform handle from URL
 */
function extractHandle(platform: string, url: string): string {
	try {
		if (platform.toUpperCase() === 'EMAIL' || url.startsWith('mailto:')) {
			return url.replace('mailto:', '')
		}
		const parsed = new URL(url)
		const pathname = parsed.pathname.replace(/^\/+|\/+$/g, '')
		if (platform.toUpperCase() === 'LINKEDIN') return pathname || 'koushikpuppala'
		if (platform.toUpperCase() === 'GITHUB') return `@${pathname || 'koushikpuppala'}`
		if (platform.toUpperCase() === 'TWITTER') return `@${pathname || 'puppala_koushik'}`
		return pathname || parsed.hostname
	} catch {
		return url
	}
}

/**
 * Fetch visible social links from authoritative backend API
 * with static fallback for offline generation.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getVisibleSocials = cache(async (): Promise<PortfolioSocial[]> => {
	const { data } = await fetchApi<SocialModel[]>('/api/v1/socials/visible')

	if (Array.isArray(data) && data.length > 0) {
		return data.map((item, idx) => ({
			id: String(item.id || `remote-soc-${idx}`),
			platform: String(item.platform || 'OTHER'),
			label: String(item.label || formatPlatformLabel(item.platform)),
			handle: extractHandle(item.platform, item.url),
			url: String(item.url),
			icon: item.icon ? String(item.icon) : null,
			featured: Boolean(item.featured),
			sortOrder: Number(item.sortOrder ?? idx),
		}))
	}

	return AUTHORITATIVE_SOCIALS
})

/**
 * Maps portfolio socials to contact channels structure
 */
export function socialsToDirectChannels(socials: PortfolioSocial[]): DirectChannel[] {
	return socials.map(s => {
		const isEmail = s.platform.toUpperCase() === 'EMAIL' || s.url.startsWith('mailto:')
		return {
			id: s.id,
			platform: s.platform.toUpperCase(),
			label: s.label,
			handle: s.handle || s.url,
			url: s.url,
			type: isEmail ? 'email' : 'link',
			featured: s.featured,
			description: isEmail
				? 'Direct channel for software architecture advisory, engineering roles, and inquiries.'
				: `${s.label} profile and updates.`,
		}
	})
}
