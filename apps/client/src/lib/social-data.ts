import type { PublishedSocial } from 'types/models'
import type { DirectChannel } from './contact-data'

import { cache } from 'react'
import { getPublishedSocials } from 'actions/cache/socials'
import { API_SOCIALS_FALLBACK } from 'constants/api-fallback'

const formatPlatformLabel = (platform: string): string => {
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

const extractHandle = (platform: string, url: string): string => {
	try {
		if (platform.toUpperCase() === 'EMAIL' || url.startsWith('mailto:'))
			return url.replace('mailto:', '')

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

export const getSocialsData = cache(async (): Promise<PublishedSocial[]> => {
	const { result, error } = await getPublishedSocials()

	if (error || !result) return API_SOCIALS_FALLBACK

	return result.map((item, idx) => ({
		id: String(item.id || `remote-soc-${idx}`),
		platform: String(item.platform || 'OTHER'),
		label: String(item.label || formatPlatformLabel(item.platform || '')),
		handle: extractHandle(item.platform || '', item.url || ''),
		url: String(item.url),
		icon: item.icon ? String(item.icon) : null,
		featured: Boolean(item.featured),
		sortOrder: Number(item.sortOrder ?? idx),
	}))
})

export const socialsToDirectChannels = (socials: PublishedSocial[]): DirectChannel[] => {
	return socials.map(s => {
		const isEmail = s.platform.toUpperCase() === 'EMAIL' || s.url.startsWith('mailto:')

		return {
			id: s.id,
			platform: s.platform.toUpperCase(),
			label: s.label,
			handle: s.handle || s.url,
			url: s.url,
			type: isEmail ? 'email' : 'link',
			featured: Boolean(s.featured),
			description: isEmail
				? 'Direct channel for software architecture advisory, engineering roles, and inquiries.'
				: `${s.label} profile and updates.`,
		}
	})
}
