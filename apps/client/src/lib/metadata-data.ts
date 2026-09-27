import type { Metadata } from 'next'
import type { PublishedMetadata } from 'types/models'

import { cache } from 'react'
import {
	getPublishedMetadataByKey,
	getPublishedMetadataByPath,
	getPublishedMetadata,
} from 'actions/cache/metadata'
import { API_METADATA_FALLBACK, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from 'constants/api-fallback'

export type MetadataPageKey =
	| 'home'
	| 'about'
	| 'experience'
	| 'projects'
	| 'skills'
	| 'services'
	| 'education'
	| 'resume'
	| 'contact'

export const pathToKeyMap: Record<string, MetadataPageKey> = {
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

export const getPageMetadata = (key: MetadataPageKey): Metadata => {
	const meta = API_METADATA_FALLBACK[key]

	const isHome = key === 'home'

	const pageTitle = isHome ? { absolute: meta.title || '' } : meta.title

	const socialTitle = isHome ? meta.title : `${meta.title} | Koushik Puppala`

	return {
		title: pageTitle,
		description: meta.description,
		keywords: meta.keywords,
		alternates: { canonical: meta.canonicalUrl },
		openGraph: {
			title: socialTitle,
			description: meta.description,
			url: meta.canonicalUrl,
			siteName: 'Koushik Puppala',
			type: 'website',
			locale: 'en_US',
			images: [
				{ url: meta.ogImage || DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: socialTitle },
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: socialTitle,
			description: meta.description,
			site: TWITTER_HANDLE,
			creator: TWITTER_HANDLE,
			images: [meta.ogImage || DEFAULT_OG_IMAGE],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
	}
}

export const getMetadataByKey = cache(async (key: string): Promise<PublishedMetadata | null> => {
	const { result } = await getPublishedMetadataByKey(key)

	return result || null
})

export const getMetadataData = cache(async (): Promise<PublishedMetadata[]> => {
	const { result } = await getPublishedMetadata()

	return Array.isArray(result) ? result : []
})

export const resolvePageMetadata = cache(
	async (key: MetadataPageKey, customFallback?: Partial<PublishedMetadata>): Promise<Metadata> => {
		const authoritative = API_METADATA_FALLBACK[key]

		const backend = await getMetadataByKey(key)

		const title = backend?.title || customFallback?.title || authoritative.title

		const description =
			backend?.description || customFallback?.description || authoritative.description

		const canonical =
			backend?.canonicalUrl || customFallback?.canonicalUrl || authoritative.canonicalUrl

		const ogImage = backend?.ogImage || customFallback?.ogImage || authoritative.ogImage || ''

		const keywords =
			backend?.keywords && backend.keywords.length > 0
				? backend.keywords
				: customFallback?.keywords || authoritative.keywords

		return {
			title,
			description,
			keywords,
			alternates: { canonical },
			openGraph: {
				title,
				description,
				url: canonical,
				siteName: 'Koushik Puppala',
				type: 'website',
				locale: 'en_US',
				images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
				site: TWITTER_HANDLE,
				creator: TWITTER_HANDLE,
				images: [ogImage],
			},
			robots: {
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					'max-video-preview': -1,
					'max-image-preview': 'large',
					'max-snippet': -1,
				},
			},
		}
	},
)

export const resolveMetadataByPath = cache(
	async (pathname: string, customFallback?: Partial<PublishedMetadata>): Promise<Metadata> => {
		const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
		const key = pathToKeyMap[cleanPath] || (cleanPath.replace(/^\//, '') as MetadataPageKey)
		const authoritative = API_METADATA_FALLBACK[key] || API_METADATA_FALLBACK.home

		let backend: PublishedMetadata | null = null
		try {
			const res = await getPublishedMetadataByPath(cleanPath)
			if (res && !res.error && res.result) {
				backend = res.result
			}
		} catch {
			// Backend offline/error fallback
		}

		const isHome = cleanPath === '/'
		const rawTitle =
			backend?.title || customFallback?.title || authoritative.title || 'Koushik Puppala'
		const title = isHome ? { absolute: rawTitle } : rawTitle
		const socialTitle = isHome ? rawTitle : `${rawTitle} — Koushik Puppala`

		const description =
			backend?.description || customFallback?.description || authoritative.description

		const canonical =
			backend?.canonicalUrl ||
			customFallback?.canonicalUrl ||
			`${authoritative.canonicalUrl}${isHome ? '' : cleanPath}`

		const ogImage =
			backend?.ogImage || customFallback?.ogImage || authoritative.ogImage || DEFAULT_OG_IMAGE

		const keywords =
			backend?.keywords && backend.keywords.length > 0
				? backend.keywords
				: customFallback?.keywords || authoritative.keywords

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
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					'max-video-preview': -1,
					'max-image-preview': 'large',
					'max-snippet': -1,
				},
			},
		}
	},
)
