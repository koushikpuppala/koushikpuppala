import type { Metadata } from 'next'
import type { PublishedMetadata } from 'types/models'
import type { MetadataPageKey, PageDefaults, ResolvedPageMetadata } from 'types/components/client'

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

const FALLBACK_DEFAULTS: PageDefaults = { title: 'Koushik Puppala', canonicalUrl: SITE_DOMAIN }

// The API falls back to the site-wide record when a page has none. Only accept an exact match, so
// each page keeps its own title and canonical URL from PAGE_DEFAULTS.
const fetchPageMetadata = async (path: string, key: string): Promise<PublishedMetadata | null> => {
	try {
		const res = await getPublishedMetadataByPath(path)

		return !res?.error && res?.result && [key, path].includes(res.result.key ?? '')
			? res.result
			: null
	} catch {
		return null
	}
}

const resolveFields = (
	path: string,
	key: MetadataPageKey,
	backend: PublishedMetadata | null,
	fallback: Partial<PublishedMetadata> | undefined,
): ResolvedPageMetadata => {
	const defaults = PAGE_DEFAULTS[key]
	const robots = (backend?.robots ?? '').toLowerCase()

	return {
		title: backend?.title || fallback?.title || (defaults ?? FALLBACK_DEFAULTS).title,
		description: backend?.description || fallback?.description || undefined,
		canonical:
			backend?.canonicalUrl ||
			fallback?.canonicalUrl ||
			(defaults ? defaults.canonicalUrl : `${SITE_DOMAIN}${path}`),
		ogImage: backend?.ogImage || fallback?.ogImage || DEFAULT_OG_IMAGE,
		keywords: backend?.keywords?.length ? backend.keywords : fallback?.keywords || DEFAULT_KEYWORDS,
		isHome: path === '/',
		index: !robots.includes('noindex'),
		follow: !robots.includes('nofollow'),
	}
}

const toMetadata = (page: ResolvedPageMetadata): Metadata => {
	const { title, description, canonical, ogImage, keywords, isHome, index, follow } = page
	const socialTitle = isHome ? title : `${title} — Koushik Puppala`

	return {
		// The home page title skips the layout's title template.
		title: isHome ? { absolute: title } : title,
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
			images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
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
}

export const resolveMetadataByPath = cache(
	async (pathname: string, customFallback?: Partial<PublishedMetadata>): Promise<Metadata> => {
		const path = pathname.startsWith('/') ? pathname : `/${pathname}`
		const key = pathToKeyMap[path] || (path.replace(/^\//, '') as MetadataPageKey)
		const backend = await fetchPageMetadata(path, key)

		return toMetadata(resolveFields(path, key, backend, customFallback))
	},
)
