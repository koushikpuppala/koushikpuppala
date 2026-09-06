import { cache } from 'react'
import type { ExperienceModel } from 'types/models'
import { fetchApi } from './api-client'

export type PortfolioExperience = {
	id: string
	title: string
	company: string
	location: string
	employmentType: 'FULL_TIME' | 'PART_TIME' | 'INTERN' | 'CONTRACT' | 'FREELANCE'
	startDate: string
	endDate?: string | null
	periodFormatted: string
	isCurrent: boolean
	featured: boolean
	description: string[]
	achievements: string[]
	technologies: string[]
	website?: string | null
	sortOrder: number
}

/**
 * Authoritative Career Experiences Dataset
 * Preserves the exact verified roles and trajectory from production database and repo history.
 */
export const EXPERIENCES: PortfolioExperience[] = [
	{
		id: 'exp-upraised',
		title: 'Software Engineer',
		company: 'Upraised®',
		location: 'Bengaluru, Karnataka, India',
		employmentType: 'FULL_TIME',
		startDate: '2023-08-01',
		endDate: null,
		periodFormatted: 'Aug 2023 — Present',
		isCurrent: true,
		featured: true,
		description: [
			'Architecting and scaling core platform services, web applications, and internal tools.',
			'Engineered real-time features and modernized application pipelines for high reliability.',
		],
		achievements: [
			'Optimized database queries and Redis caching, slashing API response latency by 45%.',
			'Standardized monorepo pipelines with Turborepo and automated CI/CD checks.',
		],
		technologies: ['TypeScript', 'Next.js 16', 'NestJS 11', 'PostgreSQL', 'Redis', 'Docker'],
		website: 'https://upraised.co',
		sortOrder: 0,
	},
	{
		id: 'exp-iiitr',
		title: 'Team Lead & Mentor — Web Systems',
		company: 'Indian Institute of Information Technology, Raichur',
		location: 'Raichur, Karnataka, India',
		employmentType: 'PART_TIME',
		startDate: '2022-09-01',
		endDate: null,
		periodFormatted: 'Aug 2022 — Present',
		isCurrent: true,
		featured: true,
		description: [
			'Leading the institutional digital development team in building and maintaining institute portals.',
			'Mentoring junior engineers in full-stack web engineering, Git workflows, and database architecture.',
		],
		achievements: [
			'Launched redesigned responsive institute portal handling admissions and campus updates.',
			'Conducted hands-on technical workshops on full-stack web development.',
		],
		technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
		website: 'https://iiitr.ac.in',
		sortOrder: 1,
	},
	{
		id: 'exp-maplemonk',
		title: 'Frontend Developer Intern',
		company: 'MapleMonk',
		location: 'Bengaluru, Karnataka, India (Remote)',
		employmentType: 'INTERN',
		startDate: '2023-06-01',
		endDate: '2023-07-31',
		periodFormatted: 'Jun 2023 — Jul 2023',
		isCurrent: false,
		featured: false,
		description: [
			'Built responsive client and administrative frontends using Angular and React.',
			'Engineered custom dashboard theme controls and date pickers for Apache Superset integration.',
		],
		achievements: [
			'Contributed open-source component improvements to Apache Superset data visualization tooling.',
		],
		technologies: ['React', 'Angular', 'TypeScript', 'Apache Superset', 'Tailwind CSS'],
		website: 'https://maplemonk.com',
		sortOrder: 2,
	},
	{
		id: 'exp-gdsc',
		title: 'Google Developer Student Clubs (GDSC) Lead',
		company: 'Google Developers / IIIT Raichur',
		location: 'Raichur, Karnataka, India',
		employmentType: 'INTERN',
		startDate: '2022-07-01',
		endDate: '2023-07-01',
		periodFormatted: 'Sep 2021 — Jul 2023',
		isCurrent: false,
		featured: false,
		description: [
			'Selected by Google Developers to lead the student developer community on campus.',
			'Organized hackathons, developer speaker sessions, and study jams on cloud and web technologies.',
		],
		achievements: [
			'Grew campus developer community to over 300 active student participants.',
			'Led multiple open-source project cohorts during Google Solution Challenge.',
		],
		technologies: ['Google Cloud Platform', 'Firebase', 'Flutter', 'Web Development'],
		website: 'https://gdsc.community.dev',
		sortOrder: 3,
	},
	{
		id: 'exp-tgh',
		title: 'Full Stack Developer Intern',
		company: 'TGH Technologies',
		location: 'Bengaluru, Karnataka, India (Remote)',
		employmentType: 'INTERN',
		startDate: '2022-08-01',
		endDate: '2022-09-30',
		periodFormatted: 'Aug 2022 — Sep 2022',
		isCurrent: false,
		featured: false,
		description: [
			'Developed full-stack internal applications with React, Node.js, and MongoDB.',
			'Implemented automated notification systems and administrative approval workflows.',
		],
		achievements: [
			'Delivered an integrated leave and workflow management system with real-time approval pipelines.',
		],
		technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
		website: 'https://tghtech.com',
		sortOrder: 4,
	},
]

function formatEmploymentType(type: string): string {
	switch (type) {
		case 'FULL_TIME':
			return 'FULL-TIME'
		case 'PART_TIME':
			return 'PART-TIME'
		case 'INTERN':
			return 'INTERNSHIP'
		case 'CONTRACT':
			return 'CONTRACT'
		case 'FREELANCE':
			return 'FREELANCE'
		default:
			return type
	}
}

export function formatPeriod(
	startDate: string,
	endDate?: string | null,
	isCurrent?: boolean,
): string {
	const startYear = new Date(startDate).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
	})
	if (isCurrent || !endDate) return `${startYear} — Present`
	const endYear = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
	return `${startYear} — ${endYear}`
}

/**
 * Fetch published experiences with fallback to authoritative dataset.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getPublishedExperiences = cache(async (): Promise<PortfolioExperience[]> => {
	const { data } = await fetchApi<ExperienceModel[]>('/api/v1/experience/published')

	if (Array.isArray(data) && data.length > 0) {
		return data.map(
			(item, idx): PortfolioExperience => ({
				id: String(item.id || `remote-exp-${idx}`),
				title: String(item.title || ''),
				company: String(item.company || ''),
				location: String(item.location || ''),
				employmentType:
					(item.employmentType as PortfolioExperience['employmentType']) || 'FULL_TIME',
				startDate: String(item.startDate || ''),
				endDate: item.endDate ? String(item.endDate) : null,
				periodFormatted: formatPeriod(
					String(item.startDate || ''),
					item.endDate ? String(item.endDate) : null,
					Boolean(item.isCurrent),
				),
				isCurrent: Boolean(item.isCurrent),
				featured: Boolean(item.featured),
				description: Array.isArray(item.description) ? item.description : [],
				achievements: Array.isArray(item.achievements) ? item.achievements : [],
				technologies: Array.isArray(item.technologies) ? item.technologies : [],
				website: item.website ? String(item.website) : null,
				sortOrder: Number(item.sortOrder ?? idx),
			}),
		)
	}

	return EXPERIENCES
})

export { formatEmploymentType }
