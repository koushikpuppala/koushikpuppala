import type { PublishedSocial } from 'types/models'

export const emailAddress = (socials: PublishedSocial[]): string | null => {
	const social = socials.find(item => item.platform === 'EMAIL')

	if (!social) return null

	return social.url.replace(/^mailto:/i, '').split('?')[0] || null
}
