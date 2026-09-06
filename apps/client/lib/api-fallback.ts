/**
 * Realistic placeholder content used ONLY as a read-time fallback when the
 * API is unreachable (preview / static build / outage). Every value maps 1:1 to an API field,
 * so switching to live data requires no component changes. Never written to.
 */
import type {
	About,
	Education,
	Experience,
	Home,
	Project,
	Resume,
	Service,
	Social,
} from './api-types'

export const fallbackHome: Home = {
	id: 'home',
	title: 'Koushik Puppala',
	separator: '//',
	subtitles: ['Software Engineer – Full Stack', 'React · Next.js · Node.js', 'PostgreSQL'],
	content:
		'Full Stack Developer with 3 years of experience building end-to-end web features with React, Next.js, Node.js and PostgreSQL. I focus on scalable, high-performance applications — frontend performance, clean architecture and solid backend integration. Currently building at Earnest Data Analytics.',
	profileImageUrl: null,
	ctas: [
		{ label: 'View projects', href: '/projects', variant: 'primary' },
		{ label: 'Get in touch', href: '/contact', variant: 'ghost' },
	],
	status: 'PUBLISHED',
	updatedAt: '2026-08-14T09:12:00.000Z',
}

export const fallbackAbout: About = {
	id: 'about',
	heading: 'Full-stack engineering, end to end',
	bio: 'Software Engineer – Full Stack with 3 years of experience building end-to-end web features using React, Next.js, Node.js and PostgreSQL.',
	description:
		"I build scalable, high-performance web applications — from the rendering layer through to the APIs and data behind them. My work centres on frontend performance, clean architecture and dependable backend integration.\nI'm currently a Full Stack Developer at Earnest Data Analytics, where I work on SEO-friendly Next.js architecture, Node.js and Express APIs, and AWS infrastructure for production workloads. Before that I worked across internships and a long-running university web team, and I've been maintaining my own open-source portfolio since 2020.\nI'm based in India and reachable at koushikpuppala@koushikpuppala.com.",
	highlights: [
		'Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS',
		'Backend: Node.js, Express, REST APIs, Authentication & Authorization',
		'Database: PostgreSQL, MongoDB, MySQL',
		'Cloud & DevOps: AWS, Docker, Firebase, Vercel',
		'Engineering: System design basics, performance optimization, API design',
		'Tools: Git, GitHub, CI/CD',
	],
	status: 'PUBLISHED',
	updatedAt: '2026-08-02T11:00:00.000Z',
}

export const fallbackExperience: Experience[] = [
	{
		id: 'exp-1',
		organization: 'Earnest Data Analytics',
		role: 'Full Stack Developer',
		location: 'Noida, India',
		startDate: '2024-10-01',
		endDate: null,
		description:
			'Full stack development across Next.js frontends, Node.js APIs and AWS infrastructure for production workloads.',
		technologies: ['Next.js', 'React', 'Node.js', 'Express', 'AWS'],
		highlights: [
			'Designed and established a scalable, SEO-friendly frontend architecture using Next.js features including App Router, Server Components and optimized data fetching',
			'Led AWS infrastructure optimization to improve system reliability, scalability and cost efficiency for production workloads',
			'Built and maintained backend APIs using Node.js and Express, implementing secure authentication, efficient data handling and frontend-backend integration',
			'Improved application performance, page load times and search engine visibility through architectural, rendering and data-flow optimizations',
			'Collaborated with product, design and engineering teams to deliver robust, user-centric features at scale',
		],
		status: 'PUBLISHED',
		order: 1,
	},
	{
		id: 'exp-2',
		organization: 'Upraised®',
		role: 'Software Development Internship',
		location: 'Remote, India',
		startDate: '2023-12-01',
		endDate: '2024-09-01',
		description: 'Worked on authentication and payment flows and supported production releases.',
		technologies: ['React', 'TypeScript', 'Node.js', 'Docker'],
		highlights: [
			'Built authentication and payment flows using React, TypeScript, Node.js and Docker, resulting in ~30% performance improvement',
			'Contributed to production deployments and system stability',
		],
		status: 'PUBLISHED',
		order: 2,
	},
	{
		id: 'exp-3',
		organization: 'MapleMonk Pvt Ltd',
		role: 'Frontend Development Internship',
		location: 'Remote, India',
		startDate: '2023-06-01',
		endDate: '2023-07-01',
		description: 'Frontend work on the internal dashboard and support tooling.',
		technologies: ['Angular'],
		highlights: [
			'Implemented a support system and customized the dashboard theme using Angular, leading to a 20% improvement in performance',
		],
		status: 'PUBLISHED',
		order: 3,
	},
	{
		id: 'exp-4',
		organization: 'Indian Institute of Information Technology, Raichur',
		role: 'Full Stack Web Development (Team Lead & Mentor)',
		location: 'Raichur, India',
		startDate: '2022-08-01',
		endDate: '2024-05-01',
		description: 'Led and mentored the team maintaining the institute website.',
		technologies: ['React', 'Node.js'],
		highlights: [
			'Led a team of developers with guidance and support, with a 20% improvement in team productivity and website performance',
			'Collaborated with a dedicated team of 10 members on the website',
			'Enhanced website traffic by 15% through SEO optimization and user-centric design enhancements',
		],
		status: 'PUBLISHED',
		order: 4,
	},
	{
		id: 'exp-5',
		organization: 'Google Developer Student Clubs',
		role: 'Google Developer Student Clubs Lead',
		location: 'Raichur, India',
		startDate: '2022-07-01',
		endDate: '2023-06-01',
		description: 'Community leadership role alongside studies.',
		technologies: [],
		highlights: [
			'Led the GDSC club with a focus on innovation and collaboration within the technology community',
		],
		status: 'PUBLISHED',
		order: 5,
	},
	{
		id: 'exp-6',
		organization: 'TGH Technologies Pvt Ltd',
		role: 'Full Stack Development Internship',
		location: 'Remote, India',
		startDate: '2022-08-01',
		endDate: '2022-09-01',
		description: 'Built an internal leave management product end to end.',
		technologies: ['React', 'Node.js', 'MongoDB'],
		highlights: [
			'Implemented a Leave Management System using React, Node.js and MongoDB with admin/manager approval workflows and push notifications, increasing productivity by 20%',
		],
		status: 'PUBLISHED',
		order: 6,
	},
]

export const fallbackProjects: Project[] = [
	{
		id: 'prj-1',
		slug: 'expensewise',
		title: 'ExpenseWise — Employee Benefits & Payment Instrument Integration',
		summary:
			'Employee benefits platform with e-RUPI and CBDC integrations and end-to-end voucher workflows.',
		content:
			'ExpenseWise integrates e-RUPI and CBDC payment instruments to power employee benefits. It covers end-to-end voucher workflows including creation, orders, disbursement, redemption and transaction processing, along with Scan & Pay, wallet, virtual account and fund disbursement flows. The integration layer works with NPCI/RBI payment instrument and banking APIs, handling JWE/JWS encryption, authentication, digital signatures and request/response processing.',
		tags: ['Payments', 'Fintech'],
		stack: ['Node.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'REST APIs'],
		repoUrl: null,
		liveUrl: null,
		coverImageUrl: null,
		featured: true,
		status: 'PUBLISHED',
		gallery: [],
		updatedAt: '2026-07-28T10:00:00.000Z',
	},
	{
		id: 'prj-2',
		slug: 'travel-flight-booking-platform',
		title: 'Travel & Flight Booking Platform',
		summary:
			'Flight booking and travel API integration with search, seat selection and booking workflows.',
		content:
			'A travel platform covering flight search, flight segments, passenger details, seat selection, fare information and booking workflows. It integrates external travel APIs behind typed API models, with authentication and optimized data fetching and caching.',
		tags: ['Travel', 'Integrations'],
		stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'REST APIs'],
		repoUrl: null,
		liveUrl: null,
		coverImageUrl: null,
		featured: true,
		status: 'PUBLISHED',
		gallery: [],
		updatedAt: '2026-06-11T10:00:00.000Z',
	},
	{
		id: 'prj-3',
		slug: 'saferidex',
		title: 'SafeRideX — Blockchain-based Cab Booking System',
		summary:
			'Mini project implementing a blockchain-based cab booking workflow (Mar 2023 – Jun 2023).',
		content:
			'SafeRideX is a blockchain-based cab booking system built as a mini project between March and June 2023. It implements the core cab booking workflow and achieved a performance score above 80%.',
		tags: ['Mini Project', 'Blockchain'],
		stack: ['Next.js', 'Tailwind CSS', 'Express', 'MongoDB', 'Firebase'],
		repoUrl: null,
		liveUrl: null,
		coverImageUrl: '/images/projects/SafeRideX.webp',
		featured: false,
		status: 'PUBLISHED',
		gallery: [],
		updatedAt: '2026-05-04T10:00:00.000Z',
	},
	{
		id: 'prj-4',
		slug: 'portfolio',
		title: 'Portfolio — Personal Website',
		summary: 'Open-source personal portfolio, maintained since Dec 2020.',
		content:
			'My personal portfolio, maintained as an open-source application since December 2020. The current version delivers a 10% performance improvement compared with the previous version.',
		tags: ['Open Source', 'Personal'],
		stack: ['Next.js', 'TypeScript'],
		repoUrl: null,
		liveUrl: 'https://koushikpuppala.com',
		coverImageUrl: '/images/projects/Koushikpuppala.webp',
		featured: false,
		status: 'PUBLISHED',
		gallery: [],
		updatedAt: '2026-03-19T10:00:00.000Z',
	},
]

export const fallbackEducation: Education[] = [
	{
		id: 'edu-1',
		institution: 'Indian Institute of Information Technology, Raichur',
		degree: 'B.Tech',
		field: 'Computer Science and Engineering',
		startDate: '2020-12-01',
		endDate: '2024-05-01',
		grade: null,
		mentor: null,
		description: 'Karnataka, India.',
		status: 'PUBLISHED',
		order: 1,
	},
	{
		id: 'edu-2',
		institution: 'Tirumala IIT & Medical Academy',
		degree: 'Intermediate',
		field: 'M.P.C',
		startDate: '2018-06-01',
		endDate: '2020-03-01',
		grade: null,
		mentor: null,
		description: 'Andhra Pradesh, India.',
		status: 'PUBLISHED',
		order: 2,
	},
]

export const fallbackServices: Service[] = [
	{
		id: 'svc-1',
		title: 'Frontend',
		description: 'React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS.',
		icon: 'layout',
		status: 'PUBLISHED',
		order: 1,
	},
	{
		id: 'svc-2',
		title: 'Backend',
		description: 'Node.js, Express, REST APIs, Authentication & Authorization.',
		icon: 'server',
		status: 'PUBLISHED',
		order: 2,
	},
	{
		id: 'svc-3',
		title: 'Database',
		description: 'PostgreSQL, MongoDB, MySQL.',
		icon: 'file-text',
		status: 'PUBLISHED',
		order: 3,
	},
	{
		id: 'svc-4',
		title: 'Cloud & DevOps',
		description: 'AWS, Docker, Firebase, Vercel.',
		icon: 'cloud',
		status: 'PUBLISHED',
		order: 4,
	},
	{
		id: 'svc-5',
		title: 'Engineering',
		description: 'System Design Basics, Performance Optimization, API Design.',
		icon: 'server',
		status: 'PUBLISHED',
		order: 5,
	},
	{
		id: 'svc-6',
		title: 'Tools',
		description: 'Git, GitHub, CI/CD.',
		icon: 'file-text',
		status: 'PUBLISHED',
		order: 6,
	},
]

export const fallbackResume: Resume = {
	id: 'resume',
	title: 'Koushik Puppala — Resume',
	version: 'Software Engineer – Full Stack',
	fileUrl: '#',
	summary:
		'Full Stack Developer with 3 years of experience building end-to-end web features using React, Next.js, Node.js and PostgreSQL, with a focus on scalable, high-performance applications, frontend performance, clean architecture and backend integration.',
	updatedAt: '2026-08-14T09:12:00.000Z',
	status: 'PUBLISHED',
}

export const fallbackSocials: Social[] = [
	{
		id: 'soc-1',
		platform: 'github',
		label: 'GitHub',
		url: 'https://github.com/koushikpuppala',
		handle: '@koushikpuppala',
		order: 1,
		status: 'PUBLISHED',
	},
	{
		id: 'soc-2',
		platform: 'linkedin',
		label: 'LinkedIn',
		url: 'https://linkedin.com/in/koushikpuppala',
		handle: 'in/koushikpuppala',
		order: 2,
		status: 'PUBLISHED',
	},
	{
		id: 'soc-3',
		platform: 'mail',
		label: 'Email',
		url: 'mailto:koushikpuppala@koushikpuppala.com',
		handle: 'koushikpuppala@koushikpuppala.com',
		order: 3,
		status: 'PUBLISHED',
	},
]
