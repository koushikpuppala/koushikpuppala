import type { Metadata } from 'next'
import type { PublishedMetadata } from 'types/models'
import type { MetadataPageKey, PageDefaults } from 'types/components/client'

import { cache } from 'react'
import { getPublishedMetadataByPath } from 'actions/cache/metadata'
import { DEFAULT_KEYWORDS, DEFAULT_OG_IMAGE, SITE_DOMAIN, TWITTER_HANDLE } from 'constants/site'

const pathToKeyMap: Record<string, MetadataPageKey> = {
	'/': 'home',
	'/about': 'about',
	'/experience': 'experience',
	'/projects': 'projects',
	'/skills': 'skills',
	'/services': 'services',
	'/education': 'education',
	'/resume': 'resume',
	'/contact': 'contact',
}

const PAGE_DEFAULTS: Record<MetadataPageKey, PageDefaults> = {
	home: { title: 'Koushik Puppala', canonicalUrl: SITE_DOMAIN },
	about: { title: 'About', canonicalUrl: `${SITE_DOMAIN}/about` },
	experience: { title: 'Experience', canonicalUrl: `${SITE_DOMAIN}/experience` },
	projects: { title: 'Projects', canonicalUrl: `${SITE_DOMAIN}/projects` },
	skills: { title: 'Skills', canonicalUrl: `${SITE_DOMAIN}/skills` },
	services: { title: 'Services', canonicalUrl: `${SITE_DOMAIN}/services` },
	education: { title: 'Education', canonicalUrl: `${SITE_DOMAIN}/education` },
	resume: { title: 'Resume', canonicalUrl: `${SITE_DOMAIN}/resume` },
	contact: { title: 'Contact', canonicalUrl: `${SITE_DOMAIN}/contact` },
}

export const resolveMetadataByPath = cache(
	async (pathname: string, customFallback?: Partial<PublishedMetadata>): Promise<Metadata> => {
		const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
		const key = pathToKeyMap[cleanPath] || (cleanPath.replace(/^\//, '') as MetadataPageKey)
		const defaults = PAGE_DEFAULTS[key] ?? { title: 'Koushik Puppala', canonicalUrl: SITE_DOMAIN }

		let backend: PublishedMetadata | null = null
		try {
			const res = await getPublishedMetadataByPath(cleanPath)
			// The API falls back to the site-wide record when a page has none. Only accept an exact
			// match, so each page keeps its own title and canonical URL from PAGE_DEFAULTS.
			if (res && !res.error && res.result && [key, cleanPath].includes(res.result.key ?? ''))
				backend = res.result
		} catch {}

		const isHome = cleanPath === '/'
		const robots = (backend?.robots ?? '').toLowerCase()
		const index = !robots.includes('noindex')
		const follow = !robots.includes('nofollow')
		const rawTitle = backend?.title || customFallback?.title || defaults.title
		// The home page title skips the layout's title template.
		const title = isHome ? { absolute: rawTitle } : rawTitle
		const socialTitle = isHome ? rawTitle : `${rawTitle} — Koushik Puppala`

		const description = backend?.description || customFallback?.description || undefined

		const canonical =
			backend?.canonicalUrl ||
			customFallback?.canonicalUrl ||
			(PAGE_DEFAULTS[key] ? defaults.canonicalUrl : `${SITE_DOMAIN}${cleanPath}`)

		const ogImage = backend?.ogImage || customFallback?.ogImage || DEFAULT_OG_IMAGE

		const keywords =
			backend?.keywords && backend.keywords.length > 0
				? backend.keywords
				: customFallback?.keywords || DEFAULT_KEYWORDS

		return {
			title,
			description,
			keywords,
			alternates: { canonical },
			openGraph: {
				title: socialTitle,
				description,
				url: canonical,
				siteName: 'Koushik Puppala',
				type: 'website',
				locale: 'en_US',
				images: [{ url: ogImage, width: 1200, height: 630, alt: rawTitle }],
			},
			twitter: {
				card: 'summary_large_image',
				title: socialTitle,
				description,
				site: TWITTER_HANDLE,
				creator: TWITTER_HANDLE,
				images: [ogImage],
			},
			robots: {
				index,
				follow,
				googleBot: {
					index,
					follow,
					'max-video-preview': -1,
					'max-image-preview': 'large',
					'max-snippet': -1,
				},
			},
		}
	},
)
