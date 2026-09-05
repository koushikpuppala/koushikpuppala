import { cache } from 'react'
import type { ProjectModel } from 'types/models'
import { fetchApi } from './api-client'

export interface ProjectGalleryItem {
	id: string
	url: string
	altText?: string | null
	caption?: string | null
	title?: string | null
	description?: string | null
	sortOrder: number
}

export interface PortfolioProject {
	id: string
	slug: string
	title: string
	subtitle: string
	category: string
	projectType: string
	featured: boolean
	status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED'
	shortDescription: string
	descriptions: string[]
	caseStudy?: string
	tags: string[]
	technologies: string[]
	imageUrl?: string | null
	heroImageUrl?: string | null
	gallery?: ProjectGalleryItem[]
	liveUrl?: string | null
	github?: string | null
	metrics?: Record<string, string>
	role?: string
	year: string
	sortOrder: number
}

/**
 * Authoritative Projects Dataset
 * Strictly aligned with database seed and verified portfolio projects:
 * 1. Personal Portfolio & CMS Platform (2026)
 * 2. ExpenseWise (2025)
 * 3. Travel & Flight Booking Platform (2024)
 * 4. SafeRideX (2023)
 * 5. Advanced Discord Automation Bots (2024)
 */
export const ALL_PROJECTS: PortfolioProject[] = [
	{
		id: 'prj-portfolio-cms',
		slug: 'koushikpuppala-portfolio-cms',
		title: 'Personal Portfolio & CMS Platform',
		subtitle: 'Production Monorepo with Next.js 16, NestJS 11, PostgreSQL & AWS S3',
		category: 'FULL STACK & CLOUD',
		projectType: 'Flagship Platform',
		featured: true,
		status: 'IN_PROGRESS',
		shortDescription:
			'An enterprise-grade portfolio and custom CMS with RBAC authorization, audit logging, direct S3 media uploads, and Redis session caching.',
		descriptions: [
			'Designed from the ground up using pnpm workspaces and Turborepo for strict workspace isolation and zero configuration leakage.',
			'Features Next.js 16 with React 19 for the public client, alongside a secure NestJS 11 backend with OpenAPI/Swagger documentation.',
			'Eliminates third-party CMS dependencies through self-hosted PostgreSQL via Prisma 7 and cryptographic Firebase Admin token verification.',
		],
		caseStudy:
			'Architected to eliminate dependencies on third-party CMS platforms. Incorporates PostgreSQL via Prisma 7, Redis caching, Firebase token verification, and AWS S3 direct client uploads. Monorepo caching reduces build and validation latency by over 60%.',
		tags: ['Next.js 16', 'NestJS 11', 'Prisma 7', 'PostgreSQL', 'AWS S3', 'Turborepo'],
		technologies: [
			'TypeScript',
			'Next.js 16',
			'NestJS 11',
			'Tailwind CSS v4',
			'Docker',
			'Redis',
			'Prisma 7',
		],
		metrics: {
			architecture: 'Turborepo Monorepo',
			codeQuality: 'Biome Strict',
			infrastructure: 'AWS S3 + CloudFront',
			performance: '100% Lighthouse Score',
		},
		imageUrl: '/images/projects/Koushikpuppala.webp',
		heroImageUrl: '/images/projects/Koushikpuppala.webp',
		liveUrl: 'https://koushikpuppala.com',
		github: 'https://github.com/koushikpuppala/koushikpuppala',
		role: 'Lead Architect & Engineer',
		year: '2026',
		sortOrder: 0,
	},
	{
		id: 'prj-expensewise',
		slug: 'expensewise',
		title: 'ExpenseWise',
		subtitle: 'AI-Powered Financial Intelligence & Automated Expense Analytics',
		category: 'FULL STACK & AI',
		projectType: 'Financial Platform',
		featured: true,
		status: 'COMPLETED',
		shortDescription:
			'Comprehensive expense intelligence platform with automated receipt OCR scanning, predictive budget forecasting, and multi-currency transaction telemetry.',
		descriptions: [
			'Engineered with Next.js, TypeScript, and NestJS featuring automated transaction categorization and real-time budget forecasting.',
			'Designed resilient data schemas in PostgreSQL with Redis caching for instant analytical query delivery.',
			'Integrated optical character recognition pipelines to parse receipts and calculate tax breakdowns automatically.',
		],
		caseStudy:
			'Built an end-to-end intelligent financial management system featuring automated OCR scanning of receipts, dynamic monthly spending forecasts, and granular budget limit alerting. Sub-45ms query response times were achieved via indexed PostgreSQL queries and warm Redis cache tiers.',
		tags: ['Next.js 16', 'NestJS 11', 'PostgreSQL', 'Prisma 7', 'Redis', 'AI / OCR'],
		technologies: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Redis'],
		metrics: {
			accuracy: '99.2% OCR Precision',
			latency: '<45ms Query Latency',
			concurrency: '500+ Concurrent Forecasts',
		},
		imageUrl: null, // Lovable technical visual canvas
		liveUrl: 'https://expensewise.koushikpuppala.com',
		github: 'https://github.com/koushikpuppala/expensewise',
		role: 'Full-Stack & Systems Lead',
		year: '2025',
		sortOrder: 1,
	},
	{
		id: 'prj-travel-flight',
		slug: 'travel-flight-booking-platform',
		title: 'Travel & Flight Booking Platform',
		subtitle: 'Real-time Multi-carrier Flight Search & Dynamic Itinerary Engine',
		category: 'DISTRIBUTED SYSTEMS',
		projectType: 'Web Platform',
		featured: true,
		status: 'COMPLETED',
		shortDescription:
			'High-concurrency travel booking system featuring live seat map reservation, multi-segment routing, atomic fare locking, and automated ticketing.',
		descriptions: [
			'Built robust booking transaction pipelines with atomic state guarantees to prevent double-booking across concurrent seat reservations.',
			'Implemented responsive seat maps and instant fare calculations across multi-city routes with dynamic currency conversions.',
			'Integrated payment gateway webhooks with idempotent reconciliation pipelines to guarantee financial consistency.',
		],
		caseStudy:
			'Architected a distributed flight search and booking engine capable of aggregating dynamic carrier fares and managing seat hold sessions with distributed Redis locks. The platform comfortably sustains over 1,200 requests per second at peak loads with 99.98% operational uptime.',
		tags: ['React 19', 'Next.js 16', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
		technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Redis', 'Stripe'],
		metrics: {
			throughput: '1.2k req/sec peak',
			availability: '99.98% uptime',
			holdTimeout: '10-minute atomic hold',
		},
		imageUrl: null, // Lovable technical visual canvas
		github: 'https://github.com/koushikpuppala/flight-booking-platform',
		role: 'Backend & Systems Engineer',
		year: '2024',
		sortOrder: 2,
	},
	{
		id: 'prj-saferidex',
		slug: 'saferidex',
		title: 'SafeRideX',
		subtitle: 'Smart Mobility & Verifiable Transportation Infrastructure',
		category: 'WEB3 & MOBILITY',
		projectType: 'Smart Mobility',
		featured: true,
		status: 'COMPLETED',
		shortDescription:
			'Decentralized ride-hailing and fleet coordination platform with automated fare escrow, verifiable driver telemetry, and transparent trip settlements.',
		descriptions: [
			'Built with Next.js and Tailwind CSS on the frontend, with Node.js, Express, and Firebase on the backend.',
			'Integrated decentralized identity and verifiable credentials for rider safety and driver credential verification.',
			'Engineered smart escrow contracts ensuring zero-dispute driver payouts and verifiable GPS distance tracking.',
		],
		caseStudy:
			'Developed a trustless transportation protocol offering peer-to-peer ride matching, cryptographic driver validation, and real-time trip route monitoring. The system achieved a driver matching latency of under 2.1 seconds with complete auditability on transparent ledger records.',
		tags: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Web3'],
		technologies: ['Next.js', 'Node.js', 'Tailwind CSS', 'Firebase', 'MongoDB', 'Express'],
		metrics: {
			consensus: 'Instant Finality',
			dispatch: '<2.1s Driver Match',
			performance: '80%+ Performance Rating',
		},
		imageUrl: '/images/projects/SafeRideX.webp',
		heroImageUrl: '/images/projects/SafeRideX.webp',
		github: 'https://github.com/koushikpuppala/saferidex',
		role: 'Lead Full-Stack Developer',
		year: '2023',
		sortOrder: 3,
	},
	{
		id: 'prj-discord-bots',
		slug: 'discord-custom-bots',
		title: 'Advanced Discord Automation Bots',
		subtitle: 'High-reliability community bots with custom command architectures and REST APIs',
		category: 'BACKEND & AUTOMATION',
		projectType: 'Open Source',
		featured: false,
		status: 'COMPLETED',
		shortDescription:
			'High-reliability community bots providing server customization, automated moderation, audio streaming, and third-party API integrations.',
		descriptions: [
			'Built with modern asynchronous Node.js and TypeScript, handling real-time WebSocket events with zero downtime.',
			'Features over 250 commands, 40 configurable parameters, extensive logging, and automated moderation pipelines.',
			'Includes custom web dashboard for server administrators to configure permission tiers and command aliases.',
		],
		caseStudy:
			'Implemented event-driven design to handle concurrent guild interactions, stateful voice channels, and persistent configurations in PostgreSQL. High-volume WebSocket connection lifecycles are preserved through resilient backoff reconnection strategies.',
		tags: ['Node.js', 'Discord.js', 'TypeScript', 'PostgreSQL', 'WebSockets'],
		technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Discord.js'],
		metrics: {
			uptime: '99.9% Online',
			commands: '250+ Custom Commands',
			concurrency: 'Multi-Guild Sharding',
		},
		imageUrl: null, // Lovable technical visual canvas
		github: 'https://github.com/koushikpuppala?tab=repositories',
		role: 'Open Source Maintainer',
		year: '2024',
		sortOrder: 4,
	},
]

export const FEATURED_PROJECTS = ALL_PROJECTS.filter(p => p.featured)

/**
 * Fetch all published projects with fallback to authoritative dataset.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getAllProjects = cache(async (): Promise<PortfolioProject[]> => {
	const { data } = await fetchApi<ProjectModel[]>('/api/v1/projects/published')

	if (Array.isArray(data) && data.length > 0) {
		return data.map(
			(item, idx): PortfolioProject => ({
				id: String(item.id || `remote-${idx}`),
				slug: String(item.slug || ''),
				title: String(item.title || ''),
				subtitle: String(item.subtitle || ''),
				category: String(item.category || 'Engineering'),
				projectType: String(item.projectType || 'Project'),
				featured: Boolean(item.featured),
				status: (item.status as PortfolioProject['status']) || 'COMPLETED',
				shortDescription: String(item.shortDescription || ''),
				descriptions: Array.isArray(item.descriptions) ? item.descriptions : [],
				caseStudy: item.caseStudy ? String(item.caseStudy) : undefined,
				tags: Array.isArray(item.tags) ? item.tags : [],
				technologies: Array.isArray(item.technologies) ? item.technologies : [],
				imageUrl: item.thumbnail?.url || item.heroImage?.url || null,
				heroImageUrl: item.heroImage?.url || null,
				liveUrl: item.liveUrl ? String(item.liveUrl) : null,
				github: item.github ? String(item.github) : null,
				metrics:
					item.metrics && typeof item.metrics === 'object'
						? (item.metrics as Record<string, string>)
						: undefined,
				role: 'Lead Architect & Engineer',
				year: item.startDate ? String(new Date(String(item.startDate)).getFullYear()) : '2025',
				sortOrder: Number(item.sortOrder ?? idx),
			}),
		)
	}

	return ALL_PROJECTS
})

/**
 * Fetch featured projects derived from cached getAllProjects to prevent redundant network requests.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getFeaturedProjects = cache(async (): Promise<PortfolioProject[]> => {
	const all = await getAllProjects()
	const featured = all.filter(p => p.featured)
	return featured.length > 0 ? featured : FEATURED_PROJECTS
})

/**
 * Fetch a single published project by its slug with gallery media.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getProjectBySlug = cache(async (slug: string): Promise<PortfolioProject | null> => {
	const { data: item } = await fetchApi<ProjectModel>(`/api/v1/projects/published/${slug}`)

	if (item?.id) {
		const galleryItems: ProjectGalleryItem[] = Array.isArray(item.gallery)
			? item.gallery.map(g => ({
					id: String(g.mediaId || g.media?.id || Math.random()),
					url: String(g.media?.url || ''),
					altText: String(g.altText || g.media?.altText || item.title),
					caption: g.caption ? String(g.caption) : undefined,
					title: g.title ? String(g.title) : undefined,
					description: g.description ? String(g.description) : undefined,
					sortOrder: Number(g.sortOrder || 0),
				}))
			: []

		return {
			id: String(item.id),
			slug: String(item.slug),
			title: String(item.title),
			subtitle: String(item.subtitle || ''),
			category: String(item.category || 'Engineering'),
			projectType: String(item.projectType || 'Platform'),
			featured: Boolean(item.featured),
			status: (item.status as PortfolioProject['status']) || 'COMPLETED',
			shortDescription: String(item.shortDescription || ''),
			descriptions: Array.isArray(item.descriptions) ? item.descriptions : [],
			caseStudy: item.caseStudy ? String(item.caseStudy) : undefined,
			tags: Array.isArray(item.tags) ? item.tags : [],
			technologies: Array.isArray(item.technologies) ? item.technologies : [],
			imageUrl: item.thumbnail?.url || item.heroImage?.url || null,
			heroImageUrl: item.heroImage?.url || null,
			gallery: galleryItems.length > 0 ? galleryItems : undefined,
			liveUrl: item.liveUrl ? String(item.liveUrl) : null,
			github: item.github ? String(item.github) : null,
			metrics:
				item.metrics && typeof item.metrics === 'object'
					? (item.metrics as Record<string, string>)
					: undefined,
			role: 'Lead Architect & Engineer',
			year: item.startDate ? String(new Date(String(item.startDate)).getFullYear()) : '2025',
			sortOrder: Number(item.sortOrder || 0),
		}
	}

	const fallback = ALL_PROJECTS.find(p => p.slug === slug)
	return fallback || null
})

/**
 * Get adjacent (previous and next) projects for navigation.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getAdjacentProjects = cache(
	async (
		slug: string,
	): Promise<{ prev: PortfolioProject | null; next: PortfolioProject | null }> => {
		const all = await getAllProjects()
		const index = all.findIndex(p => p.slug === slug)

		if (index === -1 || all.length <= 1) {
			return { prev: null, next: null }
		}

		const prevIndex = (index - 1 + all.length) % all.length
		const nextIndex = (index + 1) % all.length

		return {
			prev: all[prevIndex] || null,
			next: all[nextIndex] || null,
		}
	},
)
