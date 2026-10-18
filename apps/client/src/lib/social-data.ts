import type { PublishedSocial } from 'types/models'

import { cache } from 'react'
import { trimSlashes } from 'utils/trimSlashes'
import { unwrap } from 'lib/api-result'
import { getPublishedSocials } from 'actions/cache/socials'

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

		const pathname = trimSlashes(parsed.pathname)

		if (platform.toUpperCase() === 'LINKEDIN') return pathname || parsed.hostname

		if (platform.toUpperCase() === 'GITHUB') return pathname ? `@${pathname}` : parsed.hostname

		if (platform.toUpperCase() === 'TWITTER') return pathname ? `@${pathname}` : parsed.hostname

		return pathname || parsed.hostname
	} catch {
		return url
	}
}

export const getSocialsData = cache(async (): Promise<PublishedSocial[]> => {
	const result = unwrap(await getPublishedSocials(), 'socials')

	if (!result) return []

	return result.map((item, idx) => ({
		id: String(item.id || `remote-soc-${idx}`),
		platform: item.platform,
		label: String(item.label || formatPlatformLabel(item.platform || '')),
		handle: item.handle ? String(item.handle) : extractHandle(item.platform || '', item.url || ''),
		url: String(item.url),
		icon: item.icon ? String(item.icon) : null,
		featured: Boolean(item.featured),
		sortOrder: Number(item.sortOrder ?? idx),
	}))
})
