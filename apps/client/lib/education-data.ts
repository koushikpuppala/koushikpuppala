import { cache } from 'react'
import type { EducationModel } from 'types/models'
import { fetchApi } from './api-client'

export interface PortfolioEducation {
	id: string
	degree: string
	fieldOfStudy: string
	university: string
	location: string
	periodFormatted: string
	startDate: string
	endDate?: string | null
	isCurrent: boolean
	description: string[]
	achievements: string[]
	focusAreas: string[]
	website?: string | null
	sortOrder: number
}

/**
 * Authoritative Education Dataset
 * Preserves the exact verified academic history from database seed and portfolio records.
 */
export const EDUCATIONS: PortfolioEducation[] = [
	{
		id: 'edu-iiitr',
		degree: 'Bachelor of Technology (B.Tech)',
		fieldOfStudy: 'Computer Science and Engineering',
		university: 'Indian Institute of Information Technology Raichur',
		location: 'Raichur, Karnataka, India',
		periodFormatted: '2021 — 2025',
		startDate: '2021-08-01',
		endDate: '2025-05-01',
		isCurrent: false,
		description: [
			'Rigorous computer science curriculum emphasizing computational theory, distributed platforms, database engines, and scalable software engineering.',
		],
		achievements: [
			'Team Lead & Mentor for Institutional Web Systems Team',
			'Former Google Developer Student Clubs (GDSC) Lead',
		],
		focusAreas: [
			'Data Structures & Algorithms',
			'Distributed Systems',
			'Database Management',
			'Software Architecture',
			'Operating Systems',
		],
		website: 'https://iiitr.ac.in',
		sortOrder: 0,
	},
	{
		id: 'edu-tirumala-intermediate',
		degree: 'M.P.C Intermediate (Class XII)',
		fieldOfStudy: 'Mathematics, Physics, Chemistry',
		university: 'Tirumala IIT & Medical Academy',
		location: 'Rajahmundry, Andhra Pradesh, India',
		periodFormatted: '2018 — 2020',
		startDate: '2018-06-01',
		endDate: '2020-03-31',
		isCurrent: false,
		description: [
			'Intensive foundational training in advanced calculus, mechanics, optics, and quantitative problem solving.',
		],
		achievements: ['Academic Excellence in Mathematics and Analytical Problem Solving'],
		focusAreas: ['Advanced Mathematics', 'Physics', 'Analytical Problem Solving'],
		website: 'https://tirumalaedu.com',
		sortOrder: 1,
	},
	{
		id: 'edu-tirumala-school',
		degree: 'Secondary School Certificate (Class X)',
		fieldOfStudy: 'General Sciences & Mathematics',
		university: 'Tirumala Proactive (EM) High School',
		location: 'Rajahmundry, Andhra Pradesh, India',
		periodFormatted: '2017 — 2018',
		startDate: '2017-06-01',
		endDate: '2018-03-31',
		isCurrent: false,
		description: [
			'Secondary school education with distinction in STEM foundation curricula and analytical sciences.',
		],
		achievements: ['Graduated with Academic Distinction in State Board Examination'],
		focusAreas: ['Foundational Science', 'Mathematics', 'Computer Basics'],
		website: 'https://tirumalaedu.com',
		sortOrder: 2,
	},
]

/**
 * Fetch published education records with static fallback.
 * Wrapped in React cache() for per-request deduplication.
 */
export const getPublishedEducation = cache(async (): Promise<PortfolioEducation[]> => {
	const { data } = await fetchApi<EducationModel[]>('/api/v1/education/published')

	if (Array.isArray(data) && data.length > 0) {
		return data.map((item, idx): PortfolioEducation => {
			const startYear = item.startDate ? new Date(String(item.startDate)).getFullYear() : ''
			const endYear = item.endDate ? new Date(String(item.endDate)).getFullYear() : 'Present'
			const period = startYear ? `${startYear} — ${endYear}` : 'Verified'

			return {
				id: String(item.id || `remote-edu-${idx}`),
				degree: String(item.degree || ''),
				fieldOfStudy: String(item.fieldOfStudy || ''),
				university: String(item.university || ''),
				location: String(item.location || ''),
				periodFormatted: period,
				startDate: String(item.startDate || ''),
				endDate: item.endDate ? String(item.endDate) : null,
				isCurrent: Boolean(item.isCurrent),
				description: Array.isArray(item.description) ? item.description : [],
				achievements: Array.isArray(item.achievements) ? item.achievements : [],
				focusAreas: ['Computer Science', 'Algorithms', 'Distributed Systems'],
				website: item.website ? String(item.website) : null,
				sortOrder: Number(item.sortOrder ?? idx),
			}
		})
	}

	return EDUCATIONS
})
