import { cache } from 'react'
import type { Metadata } from 'next'
import type { MetadataModel } from 'types/models'
import { fetchApi } from './api-client'

export const SITE_DOMAIN = 'https://koushikpuppala.com'
export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/images/projects/Koushikpuppala.webp`
export const TWITTER_HANDLE = '@puppala_koushik'

export const DEFAULT_KEYWORDS = [
	'Koushik Puppala',
	'Senior Full-Stack Engineer',
	'Software Engineer',
	'Distributed Systems',
	'NestJS 11',
	'Next.js 16',
	'React 19',
	'TypeScript',
	'PostgreSQL',
	'Redis',
	'AWS Cloud',
	'AI Systems',
]

export type AuthoritativeMetadataRecord = {
	key: string
	title: string
	description: string
	canonicalUrl: string
	ogImage: string
	keywords: string[]
}

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

export const AUTHORITATIVE_METADATA: Record<MetadataPageKey, AuthoritativeMetadataRecord> = {
	home: {
		key: 'home',
		title: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
		description:
			'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
		canonicalUrl: SITE_DOMAIN,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: DEFAULT_KEYWORDS,
	},
	about: {
		key: 'about',
		title: 'Biography & Systems Philosophy',
		description:
			'Background, engineering philosophy, and distributed systems leadership of Koushik Puppala. Formerly GDSC Lead and Tech Lead for IIIT Raichur Web Systems.',
		canonicalUrl: `${SITE_DOMAIN}/about`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'Koushik Puppala About',
			'Software Engineering Philosophy',
			'Distributed Systems',
			'IIIT Raichur',
			'GDSC Lead',
		],
	},
	experience: {
		key: 'experience',
		title: 'Professional Experience & Career Trajectory',
		description:
			'Verified professional employment history, software engineering roles at Upraised® and academic institutions, and production system achievements.',
		canonicalUrl: `${SITE_DOMAIN}/experience`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'Koushik Puppala Experience',
			'Software Engineer Upraised',
			'Career History',
			'Engineering Roles',
		],
	},
	projects: {
		key: 'projects',
		title: 'Selected Projects & Systems Architecture',
		description:
			'High-throughput architectures, full-stack web applications, and open-source systems engineered by Koushik Puppala.',
		canonicalUrl: `${SITE_DOMAIN}/projects`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'Projects Showcase',
			'Case Studies',
			'Full Stack Projects',
			'Systems Architecture',
			'Open Source',
		],
	},
	skills: {
		key: 'skills',
		title: 'Technical Competencies & Technology Matrix',
		description:
			'Core engineering proficiencies across TypeScript, NestJS, Next.js, PostgreSQL, Redis, AWS Cloud, and distributed systems architecture.',
		canonicalUrl: `${SITE_DOMAIN}/skills`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'Technical Skills',
			'Tech Stack',
			'TypeScript',
			'NestJS',
			'Next.js',
			'PostgreSQL',
			'Redis',
			'AWS',
		],
	},
	services: {
		key: 'services',
		title: 'Technical Services & Engineering Advisory',
		description:
			'End-to-end full-stack web engineering, cloud infrastructure, distributed microservices architecture, and technical consulting by Koushik Puppala.',
		canonicalUrl: `${SITE_DOMAIN}/services`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'Engineering Services',
			'Full-Stack Consulting',
			'Distributed Systems Advisory',
			'Cloud Architecture',
			'Koushik Puppala Services',
		],
	},
	education: {
		key: 'education',
		title: 'Academic Background & Milestones',
		description:
			'Higher education credentials, B.Tech in Computer Science & Engineering from Indian Institute of Information Technology Raichur, and academic coursework.',
		canonicalUrl: `${SITE_DOMAIN}/education`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'IIIT Raichur',
			'Computer Science Engineering',
			'Academic Qualifications',
			'Education Credentials',
		],
	},
	resume: {
		key: 'resume',
		title: 'Authoritative Resume & Professional Credentials',
		description:
			'Official curriculum vitae and verified engineering credentials of Koushik Puppala. Direct PDF download and comprehensive dossier.',
		canonicalUrl: `${SITE_DOMAIN}/resume`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'Resume',
			'Curriculum Vitae',
			'CV Download',
			'Software Engineer Credentials',
			'Engineering Qualifications',
		],
	},
	contact: {
		key: 'contact',
		title: 'Contact & Transmission',
		description:
			'Initiate a direct transmission with Koushik Puppala. Available for technical leadership, distributed systems engineering, and architecture advisory.',
		canonicalUrl: `${SITE_DOMAIN}/contact`,
		ogImage: DEFAULT_OG_IMAGE,
		keywords: [
			'Contact Koushik Puppala',
			'Engineering Inquiries',
			'Consulting',
			'Direct Message',
			'Hire Engineer',
		],
	},
}

/**
 * Construct static typed Metadata for any top-level portfolio route
 */
export function getPageMetadata(key: MetadataPageKey): Metadata {
	const meta = AUTHORITATIVE_METADATA[key]
	const isHome = key === 'home'
	const pageTitle = isHome ? { absolute: meta.title } : meta.title
	const socialTitle = isHome ? meta.title : `${meta.title} | Koushik Puppala`

	return {
		title: pageTitle,
		description: meta.description,
		keywords: meta.keywords,
		alternates: {
			canonical: meta.canonicalUrl,
		},
		openGraph: {
			title: socialTitle,
			description: meta.description,
			url: meta.canonicalUrl,
			siteName: 'Koushik Puppala',
			type: 'website',
			locale: 'en_US',
			images: [
				{
					url: meta.ogImage || DEFAULT_OG_IMAGE,
					width: 1200,
					height: 630,
					alt: socialTitle,
				},
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

/**
 * Fetch published SEO metadata by unique key (e.g. 'home', 'about', 'contact', 'resume')
 * Wrapped in React cache() for per-request deduplication.
 */
export const getMetadataByKey = cache(async (key: string): Promise<MetadataModel | null> => {
	const { data } = await fetchApi<MetadataModel>(`/api/v1/metadata/key/${key}`)
	return data
})

/**
 * Fetch all published metadata records.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getAllPublishedMetadata = cache(async (): Promise<MetadataModel[]> => {
	const { data } = await fetchApi<MetadataModel[]>('/api/v1/metadata/published')
	return Array.isArray(data) ? data : []
})

/**
 * Resolves Next.js Metadata object from backend metadata endpoint with authoritative fallback.
 * Wrapped in React cache() for per-request deduplication.
 */
export const resolvePageMetadata = cache(
	async (
		key: MetadataPageKey,
		customFallback?: Partial<AuthoritativeMetadataRecord>,
	): Promise<Metadata> => {
		const authoritative = AUTHORITATIVE_METADATA[key]
		const backend = await getMetadataByKey(key)

		const title = backend?.title || customFallback?.title || authoritative.title
		const description =
			backend?.description || customFallback?.description || authoritative.description
		const canonical =
			backend?.canonicalUrl || customFallback?.canonicalUrl || authoritative.canonicalUrl
		const ogImage = backend?.ogImage || customFallback?.ogImage || authoritative.ogImage
		const keywords =
			backend?.keywords && backend.keywords.length > 0
				? backend.keywords
				: customFallback?.keywords || authoritative.keywords

		return {
			title,
			description,
			keywords,
			alternates: {
				canonical,
			},
			openGraph: {
				title,
				description,
				url: canonical,
				siteName: 'Koushik Puppala',
				type: 'website',
				locale: 'en_US',
				images: [
					{
						url: ogImage,
						width: 1200,
						height: 630,
						alt: title,
					},
				],
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
