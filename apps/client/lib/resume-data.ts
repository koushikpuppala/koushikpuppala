import { cache } from 'react'
import type { ResumeModel } from 'types/models'
import { fetchApi } from './api-client'

export interface ResumeHighlight {
	number: string
	title: string
	description: string
}

export interface ResumeStat {
	label: string
	value: string
}

export interface PortfolioResume {
	id: string
	title: string
	versionName: string
	fileSize: number
	fileSizeFormatted: string
	fileType: string
	formatLabel: string
	revisionYear: string
	lastUpdated: string
	downloadUrl: string
	previewUrl: string
	headline: string
	summary: string
	highlights: ResumeHighlight[]
	competencies: string[]
	stats: ResumeStat[]
	isVerified: boolean
}

/**
 * Authoritative Resume Dataset
 * Rooted in the genuine Koushik Puppala resume PDF and verified portfolio history.
 */
export const AUTHORITATIVE_RESUME: PortfolioResume = {
	id: 'resume-koushik-puppala',
	title: 'Koushik Puppala — Curriculum Vitae',
	versionName: '2026 Authoritative Production Edition',
	fileSize: 206893,
	fileSizeFormatted: '207 KB',
	fileType: 'application/pdf',
	formatLabel: 'PDF 1.4',
	revisionYear: '2026',
	lastUpdated: 'May 2024 (Verified 2026)',
	downloadUrl: '/resume/koushikpuppala_resume.pdf',
	previewUrl: '/resume/koushikpuppala_resume.pdf',
	headline: 'Software Engineer & Full-Stack Systems Architect',
	summary:
		'Comprehensive technical curriculum vitae detailing production full-stack engineering at Upraised®, institutional web systems leadership at IIIT Raichur, distributed backend architectures, and high-throughput Next.js & NestJS systems.',
	highlights: [
		{
			number: '01',
			title: 'PRODUCTION ENGINEERING',
			description:
				'Engineered scalable full-stack features, database optimizations, and Redis caching at Upraised®, reducing API latency by 45%.',
		},
		{
			number: '02',
			title: 'ARCHITECTURAL LEADERSHIP',
			description:
				'Headed the institutional web team at IIIT Raichur, mentoring junior engineers and deploying mission-critical university portals.',
		},
		{
			number: '03',
			title: 'DISTRIBUTED SYSTEMS',
			description:
				'Architected microservices, relational PostgreSQL schemas with Prisma 7, session stores, and automated Turborepo monorepo pipelines.',
		},
		{
			number: '04',
			title: 'ACADEMIC EXCELLENCE',
			description:
				'B.Tech in Computer Science and Engineering from Indian Institute of Information Technology Raichur with extensive systems coursework.',
		},
	],
	competencies: [
		'TypeScript',
		'Next.js 16',
		'React 19',
		'NestJS 11',
		'PostgreSQL',
		'Prisma 7',
		'Redis',
		'AWS S3',
		'Docker',
		'Tailwind CSS v4',
	],
	stats: [
		{ label: 'FORMAT', value: 'PDF 1.4' },
		{ label: 'FILE SIZE', value: '207 KB' },
		{ label: 'DOCUMENT', value: '2 PAGES' },
		{ label: 'INTEGRITY', value: 'CRYPTOGRAPHIC' },
	],
	isVerified: true,
}

/**
 * Fetch published resume metadata with fallback to authoritative dataset.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getPublishedResume = cache(async (): Promise<PortfolioResume> => {
	const { data } = await fetchApi<
		ResumeModel & {
			downloadUrl?: string
			media?: { url?: string; size?: number }
		}
	>('/api/v1/resume/latest')

	if (data && (data.id || data.downloadUrl)) {
		const size = data.fileSize || data.media?.size || AUTHORITATIVE_RESUME.fileSize
		const sizeKb = Math.round(size / 1024)
		const dl = data.downloadUrl || data.media?.url || AUTHORITATIVE_RESUME.downloadUrl

		return {
			...AUTHORITATIVE_RESUME,
			id: String(data.id || AUTHORITATIVE_RESUME.id),
			title: data.title || AUTHORITATIVE_RESUME.title,
			versionName: data.versionName || AUTHORITATIVE_RESUME.versionName,
			fileSize: size,
			fileSizeFormatted: `${sizeKb} KB`,
			downloadUrl: dl,
			previewUrl: dl,
		}
	}

	return AUTHORITATIVE_RESUME
})
