import { http, HttpResponse } from 'msw'
import { API } from './msw'

export const home = {
	id: 'home-1',
	title: 'Ada Lovelace',
	separator: '//',
	subtitles: ['Software Engineer', 'Full Stack'],
	content: 'Builds analytical engines and the web apps that run on them.',
	ctaLabel: 'View projects',
	ctaUrl: '/projects',
	secondaryCtaLabel: 'Get in touch',
	secondaryCtaUrl: '/contact',
	featuredSkills: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
	stats: [
		{ label: 'Years', value: '3', detail: 'shipping' },
		{ label: 'Projects', value: '12' },
	],
	profileImage: { url: 'https://assets.example.com/ada.webp' },
}

export const about = {
	id: 'about-1',
	title: 'Engineer and mathematician',
	leadStatement: 'I turn ideas into working systems.',
	content: 'Long form about content.',
	biography: 'Born in London, wrote the first program.',
	location: 'London, UK',
	coordinates: '51.5072° N, 0.1276° W',
	timezone: 'Europe/London',
	status: 'Open to work',
	highlights: ['First program', 'Analytical engine notes'],
	stats: [{ label: 'Papers', value: '1', detail: 'famous' }],
	ctaLabel: 'Say hello',
	ctaUrl: '/contact',
}

export const experience = [
	{
		id: 'exp-1',
		title: 'Software Engineer',
		organization: 'Analytical Co',
		location: 'Remote',
		employmentType: 'FULL_TIME',
		startDate: '2024-01-01T00:00:00.000Z',
		endDate: null,
		isCurrent: true,
		featured: true,
		description: ['Built the payments platform.', 'Led the API redesign.'],
		achievements: ['Cut latency by 45%'],
		technologies: ['NestJS', 'React'],
		website: 'https://analytical.example.com',
		sortOrder: 0,
	},
	{
		id: 'exp-2',
		title: 'Engineering Intern',
		organization: 'Difference Labs',
		location: 'London',
		employmentType: 'INTERN',
		startDate: '2022-05-01T00:00:00.000Z',
		endDate: '2022-08-01T00:00:00.000Z',
		isCurrent: false,
		featured: false,
		description: ['Shipped an internal tool.'],
		achievements: [],
		technologies: ['Python'],
		website: null,
		sortOrder: 1,
	},
	{
		id: 'exp-3',
		title: 'Student Lead',
		organization: 'University Club',
		location: 'London',
		employmentType: 'PART_TIME',
		startDate: '2021-01-01T00:00:00.000Z',
		endDate: '2022-01-01T00:00:00.000Z',
		isCurrent: false,
		featured: false,
		description: ['Led the student platform team.'],
		achievements: ['Grew members to 500'],
		technologies: ['Vue'],
		sortOrder: 2,
	},
]

export const education = [
	{
		id: 'edu-1',
		degree: 'B.Tech',
		fieldOfStudy: 'Computer Science',
		university: 'University of London',
		location: 'London',
		startDate: '2019-08-01T00:00:00.000Z',
		endDate: '2023-05-01T00:00:00.000Z',
		isCurrent: false,
		description: ['Graduated with honours.'],
		achievements: ['Dean list'],
		focusAreas: ['Algorithms', 'Distributed systems'],
		website: 'https://london.example.edu',
		sortOrder: 0,
	},
]

export const projects = [
	{
		id: 'p1',
		slug: 'payments',
		title: 'Payments Platform — Card issuing and settlement',
		subtitle: 'Fintech',
		role: 'Lead engineer',
		category: 'Product',
		projectType: 'Professional',
		featured: true,
		status: 'COMPLETED',
		shortDescription: 'Card issuing and settlement for employee benefits.',
		descriptions: ['Designed the ledger.', 'Integrated the card processor.'],
		caseStudy: '## Problem\n\nPayments were slow.\n\n## Solution\n\nA new ledger.',
		tags: ['fintech', 'payments'],
		technologies: ['NestJS', 'PostgreSQL', 'React', 'Redis', 'AWS', 'Docker'],
		metrics: { latency: '-45%', uptime: '99.9%' },
		startDate: '2024-03-01T00:00:00.000Z',
		endDate: '2025-01-01T00:00:00.000Z',
		github: 'https://github.com/example/payments',
		liveUrl: 'https://payments.example.com',
		sortOrder: 0,
		thumbnail: { url: 'https://assets.example.com/p1.webp' },
		heroImage: { url: 'https://assets.example.com/p1-hero.webp' },
		gallery: [
			{ id: 'g1', altText: 'Dashboard', caption: 'The dashboard', media: { url: 'https://assets.example.com/g1.webp' } },
		],
	},
	{
		id: 'p2',
		slug: 'travel',
		title: 'Travel Booking',
		subtitle: 'Travel',
		category: 'Product',
		projectType: 'Professional',
		featured: true,
		status: 'IN_PROGRESS',
		shortDescription: 'Flight search and booking.',
		descriptions: ['Built search.'],
		tags: ['travel'],
		technologies: ['Next.js'],
		startDate: '2023-01-01T00:00:00.000Z',
		sortOrder: 1,
	},
	{
		id: 'p3',
		slug: 'portfolio',
		title: 'Portfolio — Personal Website',
		subtitle: 'Personal',
		category: 'Open source',
		projectType: 'Personal',
		featured: false,
		status: 'IN_PROGRESS',
		shortDescription: 'This site.',
		descriptions: ['Maintained since 2020.'],
		tags: ['open source'],
		technologies: ['Next.js', 'TypeScript'],
		startDate: '2020-12-01T00:00:00.000Z',
		sortOrder: 2,
	},
]

export const services = [
	{
		id: 's1',
		title: 'Frontend',
		description: 'Interfaces people enjoy.',
		features: ['React', 'Next.js', 'Tailwind CSS'],
		sortOrder: 0,
	},
	{
		id: 's2',
		title: 'Backend',
		description: 'APIs that stay up.',
		features: ['NestJS', 'PostgreSQL', 'Redis'],
		image: { url: 'https://assets.example.com/backend.webp' },
		sortOrder: 1,
	},
]

export const socials = [
	{ id: 'so1', platform: 'GITHUB', url: 'https://github.com/ada', label: null, sortOrder: 0, featured: true },
	{ id: 'so2', platform: 'LINKEDIN', url: 'https://linkedin.com/in/ada/', label: null, sortOrder: 1 },
	{ id: 'so3', platform: 'EMAIL', url: 'mailto:ada@example.com', label: null, sortOrder: 2 },
	{ id: 'so4', platform: 'TWITTER', url: 'https://x.com/ada', label: null, sortOrder: 3 },
]

export const resume = {
	id: 'r1',
	title: 'Ada Lovelace Resume',
	versionName: 'v3',
	fileSize: 204800,
	fileType: 'application/pdf',
	hasFile: true,
	headline: 'Full stack engineer',
	summary: 'Three years building products.',
	highlights: [{ number: '01', title: 'Payments', description: 'Built a ledger.' }],
	competencies: ['TypeScript', 'System design'],
	stats: [{ label: 'Years', value: '3' }],
	updatedAt: '2026-10-01T00:00:00.000Z',
}

export const metadata = {
	title: 'Ada Lovelace',
	description: 'Portfolio of Ada Lovelace.',
	keywords: ['Ada', 'Engineer'],
	ogImage: 'https://assets.example.com/og.png',
}

const ok = (result: unknown) => HttpResponse.json({ result, statusCode: 200 })

// Every public endpoint the site reads, answering with the fixtures above unless a test overrides one.
export const publishedApi = (overrides: Record<string, unknown> = {}) => {
	const data: Record<string, unknown> = {
		home,
		about,
		experience,
		education,
		projects,
		services,
		socials,
		resume,
		metadata,
		...overrides,
	}

	return [
		http.get(`${API}/api/v1/home/published`, () => ok(data.home)),
		http.get(`${API}/api/v1/about/published`, () => ok(data.about)),
		http.get(`${API}/api/v1/experience/published`, () => ok(data.experience)),
		http.get(`${API}/api/v1/education/published`, () => ok(data.education)),
		http.get(`${API}/api/v1/services/published`, () => ok(data.services)),
		http.get(`${API}/api/v1/socials/visible`, () => ok(data.socials)),
		http.get(`${API}/api/v1/resume/latest`, () => ok(data.resume)),
		http.get(`${API}/api/v1/metadata/by-path`, () => ok(data.metadata)),
		http.get(`${API}/api/v1/projects/published`, () => ok(data.projects)),
		http.get(`${API}/api/v1/projects/published/:slug`, ({ params }) => {
			const project = (data.projects as typeof projects).find(p => p.slug === params.slug)
			return project
				? ok(project)
				: HttpResponse.json({ message: 'Project not found', statusCode: 404 }, { status: 404 })
		}),
	]
}

// The same endpoints, all failing, to check every page still renders its empty states.
export const failingApi = () =>
	[
		'home/published',
		'about/published',
		'experience/published',
		'education/published',
		'services/published',
		'socials/visible',
		'resume/latest',
		'metadata/by-path',
		'projects/published',
		'projects/published/:slug',
	].map(path =>
		http.get(`${API}/api/v1/${path}`, () =>
			HttpResponse.json({ message: 'Service unavailable', statusCode: 503 }, { status: 503 }),
		),
	)
