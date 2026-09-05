import { cache } from 'react'
import type { SkillModel, ServiceModel } from 'types/models'
import { fetchApi } from './api-client'

export interface PortfolioSkill {
	id: string
	name: string
	category: string
	proficiency?: number
	icon?: string
	featured: boolean
	sortOrder: number
}

export interface SkillCluster {
	id: string
	index: string
	title: string
	categoryTag: string
	description: string
	skills: PortfolioSkill[]
}

/**
 * Authoritative Skills Dataset
 * Categorized into Lovable stack clusters using verified portfolio data.
 */
export const SKILL_CLUSTERS: SkillCluster[] = [
	{
		id: 'frontend',
		index: '01',
		title: 'Frontend Systems',
		categoryTag: 'CLIENT & RENDERING',
		description:
			'Modern component-driven architectures, reactive client state, and performance-tuned web rendering.',
		skills: [
			{
				id: 'sk-nextjs',
				name: 'Next.js 16',
				category: 'Frontend',
				proficiency: 95,
				featured: true,
				sortOrder: 0,
			},
			{
				id: 'sk-react',
				name: 'React 19',
				category: 'Frontend',
				proficiency: 95,
				featured: true,
				sortOrder: 1,
			},
			{
				id: 'sk-tailwind',
				name: 'Tailwind CSS v4',
				category: 'Frontend',
				proficiency: 95,
				featured: true,
				sortOrder: 2,
			},
			{
				id: 'sk-motion',
				name: 'Motion (Framer)',
				category: 'Frontend',
				proficiency: 85,
				featured: false,
				sortOrder: 3,
			},
			{
				id: 'sk-html-css',
				name: 'HTML5 / Modern CSS',
				category: 'Frontend',
				proficiency: 95,
				featured: false,
				sortOrder: 4,
			},
		],
	},
	{
		id: 'backend',
		index: '02',
		title: 'Backend & APIs',
		categoryTag: 'SERVER & DISTRIBUTED',
		description:
			'High-throughput microservices, robust REST APIs, authentication security, and event-driven architectures.',
		skills: [
			{
				id: 'sk-nestjs',
				name: 'NestJS 11',
				category: 'Backend',
				proficiency: 95,
				featured: true,
				sortOrder: 0,
			},
			{
				id: 'sk-nodejs',
				name: 'Node.js Runtime',
				category: 'Backend',
				proficiency: 90,
				featured: true,
				sortOrder: 1,
			},
			{
				id: 'sk-express',
				name: 'Express.js',
				category: 'Backend',
				proficiency: 90,
				featured: false,
				sortOrder: 2,
			},
			{
				id: 'sk-swagger',
				name: 'REST APIs & Swagger / OpenAPI',
				category: 'Backend',
				proficiency: 95,
				featured: true,
				sortOrder: 3,
			},
		],
	},
	{
		id: 'database',
		index: '03',
		title: 'Database & Storage',
		categoryTag: 'PERSISTENCE & CACHING',
		description:
			'Relational data modeling, atomicity, high-speed Redis session management, and object storage.',
		skills: [
			{
				id: 'sk-postgres',
				name: 'PostgreSQL',
				category: 'Database',
				proficiency: 90,
				featured: true,
				sortOrder: 0,
			},
			{
				id: 'sk-prisma',
				name: 'Prisma 7 ORM',
				category: 'Database',
				proficiency: 95,
				featured: true,
				sortOrder: 1,
			},
			{
				id: 'sk-redis',
				name: 'Redis Caching & Stores',
				category: 'Database',
				proficiency: 85,
				featured: true,
				sortOrder: 2,
			},
			{
				id: 'sk-s3',
				name: 'AWS S3 Object Storage',
				category: 'Database',
				proficiency: 85,
				featured: false,
				sortOrder: 3,
			},
		],
	},
	{
		id: 'cloud-devops',
		index: '04',
		title: 'Cloud & DevOps',
		categoryTag: 'DEPLOYMENT & INFRA',
		description:
			'Containerized deployments, monorepo automation, build optimizations, and continuous integration.',
		skills: [
			{
				id: 'sk-aws',
				name: 'AWS Cloud Services',
				category: 'Cloud & DevOps',
				proficiency: 80,
				featured: true,
				sortOrder: 0,
			},
			{
				id: 'sk-docker',
				name: 'Docker Containerization',
				category: 'Cloud & DevOps',
				proficiency: 85,
				featured: true,
				sortOrder: 1,
			},
			{
				id: 'sk-turborepo',
				name: 'Turborepo Monorepos',
				category: 'Cloud & DevOps',
				proficiency: 90,
				featured: false,
				sortOrder: 2,
			},
			{
				id: 'sk-git',
				name: 'Git & GitHub Actions CI/CD',
				category: 'Cloud & DevOps',
				proficiency: 95,
				featured: true,
				sortOrder: 3,
			},
		],
	},
	{
		id: 'languages-core',
		index: '05',
		title: 'Core Languages',
		categoryTag: 'PROGRAMMING RUNTIMES',
		description:
			'Strict typing disciplines, functional patterns, algorithmic problem solving, and data manipulation.',
		skills: [
			{
				id: 'sk-typescript',
				name: 'TypeScript',
				category: 'Languages',
				proficiency: 95,
				featured: true,
				sortOrder: 0,
			},
			{
				id: 'sk-javascript',
				name: 'JavaScript (ES6+)',
				category: 'Languages',
				proficiency: 95,
				featured: true,
				sortOrder: 1,
			},
			{
				id: 'sk-sql',
				name: 'SQL Query Optimization',
				category: 'Languages',
				proficiency: 90,
				featured: true,
				sortOrder: 2,
			},
			{
				id: 'sk-python',
				name: 'Python',
				category: 'Languages',
				proficiency: 80,
				featured: false,
				sortOrder: 3,
			},
		],
	},
]

/**
 * Fetch published skills grouped by cluster with static fallback.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getSkillClusters = cache(async (): Promise<SkillCluster[]> => {
	const { data } = await fetchApi<SkillModel[]>('/api/v1/skills/published')

	if (Array.isArray(data) && data.length > 0) {
		// Re-group remote skills by category while maintaining cluster layout
		const categoryMap: Record<string, PortfolioSkill[]> = {}
		for (const s of data) {
			const cat = String(s.category || 'General')
			if (!categoryMap[cat]) categoryMap[cat] = []
			categoryMap[cat].push({
				id: String(s.id),
				name: String(s.name),
				category: cat,
				proficiency: typeof s.proficiency === 'number' ? s.proficiency : undefined,
				icon: s.icon ? String(s.icon) : undefined,
				featured: Boolean(s.featured),
				sortOrder: Number(s.sortOrder ?? 0),
			})
		}

		return SKILL_CLUSTERS.map(cluster => {
			// Map category names to cluster
			const matchKey = Object.keys(categoryMap).find(
				k =>
					k.toLowerCase().includes(cluster.id.toLowerCase()) ||
					cluster.title.toLowerCase().includes(k.toLowerCase()) ||
					(cluster.id === 'languages-core' && k.toLowerCase().includes('languages')),
			)

			if (matchKey && categoryMap[matchKey]?.length) {
				return {
					...cluster,
					skills: categoryMap[matchKey].sort((a, b) => a.sortOrder - b.sortOrder),
				}
			}

			return cluster
		})
	}

	return SKILL_CLUSTERS
})

export interface PortfolioService {
	id: string
	title: string
	description: string
	features: string[]
	imageUrl?: string | null
	sortOrder: number
}

export const AUTHORITATIVE_SERVICES: PortfolioService[] = [
	{
		id: 'srv-fullstack',
		title: 'Full-Stack Web Engineering',
		description:
			'Design and delivery of end-to-end web applications combining modern Next.js frontends with robust NestJS REST API backends.',
		features: [
			'Responsive layouts and server-side rendering (SSR)',
			'PostgreSQL database modeling & caching optimization',
			'Clean modular code adhering to production best practices',
		],
		sortOrder: 0,
	},
	{
		id: 'srv-cloud-api',
		title: 'Cloud Infrastructure & API Architecture',
		description:
			'Architecting scalable RESTful backends, database schema optimizations, AWS storage integrations, and CI/CD pipelines.',
		features: [
			'High-performance NestJS microservices and monoliths',
			'AWS S3 presigned asset upload workflows',
			'Redis caching and session revocation management',
		],
		sortOrder: 1,
	},
]

/**
 * Fetch published services from authoritative backend API with static fallback.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getPublishedServices = cache(async (): Promise<PortfolioService[]> => {
	const { data } = await fetchApi<ServiceModel[]>('/api/v1/services/published')

	if (Array.isArray(data) && data.length > 0) {
		return data.map((s, idx) => ({
			id: String(s.id || `remote-srv-${idx}`),
			title: String(s.title || ''),
			description: String(s.description || ''),
			features: Array.isArray(s.features) ? s.features : [],
			imageUrl: s.image?.url || null,
			sortOrder: Number(s.sortOrder ?? idx),
		}))
	}

	return AUTHORITATIVE_SERVICES
})
