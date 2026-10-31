import { EmploymentType, ProjectStatus, SocialPlatform, Prisma } from '../generated/client'

export const SITE_DOMAIN = 'https://koushikpuppala.com'

export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/images/brand/og-image.png`

export const published = () => ({ isPublished: true, publishedAt: new Date() })

export const home = {
	title: 'Koushik Puppala',
	separator: '//',
	subtitles: ['Software Engineer – Full Stack', 'React · Next.js · Node.js', 'PostgreSQL'],
	content:
		'Full Stack Developer with 3 years of experience building end-to-end web features with React, Next.js, Node.js and PostgreSQL. I focus on scalable, high-performance applications — frontend performance, clean architecture and solid backend integration. Currently building at Earnest Data Analytics.',
	ctaLabel: 'View projects',
	ctaUrl: '/projects',
	secondaryCtaLabel: 'Get in touch',
	secondaryCtaUrl: '/contact',
	featuredSkills: ['TypeScript', 'Next.js 16', 'NestJS 11', 'PostgreSQL', 'Redis', 'AWS'],
	stats: {
		yearsOfExperience: '3+',
		projectsDelivered: '20+',
		openSourceCommits: '1.8k+',
		menteesGuided: '50+',
	},
	sortOrder: 0,
} satisfies Prisma.HomeUncheckedCreateInput

export const about = {
	title: 'About Koushik Puppala',
	leadStatement:
		'Software Engineer – Full Stack with 3 years of experience building end-to-end web features using React, Next.js, Node.js and PostgreSQL.',
	content:
		"I build scalable, high-performance web applications — from the rendering layer through to the APIs and data behind them. My work centres on frontend performance, clean architecture and dependable backend integration.\nI'm currently a Full Stack Developer at Earnest Data Analytics, where I work on SEO-friendly Next.js architecture, Node.js and Express APIs, and AWS infrastructure for production workloads. Before that I worked across internships and a long-running university web team, and I've been maintaining my own open-source portfolio since 2020.\nI'm based in India and reachable at koushikpuppala@koushikpuppala.com.",
	biography:
		'I specialize in designing and engineering high-throughput backend services, performant web interfaces, and modern cloud infrastructure. My work emphasizes architectural discipline, clean modular code, and dependable integration with TypeScript, Next.js, NestJS and PostgreSQL.',
	location: 'Noida, India',
	coordinates: null,
	timezone: 'UTC+5:30 (IST)',
	status: 'PUBLISHED',
	highlights: [
		'Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS',
		'Backend: Node.js, Express, REST APIs, Authentication & Authorization',
		'Database: PostgreSQL, MongoDB, MySQL',
		'Cloud & DevOps: AWS, Docker, Firebase, Vercel',
		'Engineering: System design basics, performance optimization, API design',
		'Tools: Git, GitHub, CI/CD',
	],
	stats: [
		{ label: 'EXPERIENCE', value: '3+', detail: 'Years of Production Engineering' },
		{ label: 'SYSTEMS', value: '20+', detail: 'Projects & Platforms Delivered' },
		{ label: 'CONTRIBUTIONS', value: '1.8k+', detail: 'Open-Source Commits' },
		{ label: 'MENTORSHIP', value: '50+', detail: 'Junior Engineers Guided' },
	],
	ctaLabel: 'Read Full Biography',
	ctaUrl: '/about',
	sortOrder: 0,
} satisfies Prisma.AboutUncheckedCreateInput

export const experiences = [
	{
		organization: 'Earnest Data Analytics',
		title: 'Full Stack Developer',
		location: 'Noida, India',
		employmentType: EmploymentType.FULL_TIME,
		startDate: new Date('2024-10-01'),
		endDate: null,
		isCurrent: true,
		featured: true,
		description: [
			'Full stack development across Next.js frontends, Node.js APIs and AWS infrastructure for production workloads.',
		],
		achievements: [
			'Designed and established a scalable, SEO-friendly frontend architecture using Next.js features including App Router, Server Components and optimized data fetching',
			'Led AWS infrastructure optimization to improve system reliability, scalability and cost efficiency for production workloads',
			'Built and maintained backend APIs using Node.js and Express, implementing secure authentication, efficient data handling and frontend-backend integration',
			'Improved application performance, page load times and search engine visibility through architectural, rendering and data-flow optimizations',
			'Collaborated with product, design and engineering teams to deliver robust, user-centric features at scale',
		],
		technologies: ['Next.js', 'React', 'Node.js', 'Express', 'AWS'],
		sortOrder: 1,
	},
	{
		organization: 'Upraised®',
		title: 'Software Development Internship',
		location: 'Remote, India',
		employmentType: EmploymentType.INTERN,
		startDate: new Date('2023-12-01'),
		endDate: new Date('2024-09-01'),
		isCurrent: false,
		featured: false,
		description: ['Worked on authentication and payment flows and supported production releases.'],
		achievements: [
			'Built authentication and payment flows using React, TypeScript, Node.js and Docker, resulting in ~30% performance improvement',
			'Contributed to production deployments and system stability',
		],
		technologies: ['React', 'TypeScript', 'Node.js', 'Docker'],
		website: 'https://upraised.co',
		sortOrder: 2,
	},
	{
		organization: 'MapleMonk Pvt Ltd',
		title: 'Frontend Development Internship',
		location: 'Remote, India',
		employmentType: EmploymentType.INTERN,
		startDate: new Date('2023-06-01'),
		endDate: new Date('2023-07-01'),
		isCurrent: false,
		featured: false,
		description: ['Frontend work on the internal dashboard and support tooling.'],
		achievements: [
			'Implemented a support system and customized the dashboard theme using Angular, leading to a 20% improvement in performance',
		],
		technologies: ['Angular'],
		website: 'https://maplemonk.com',
		sortOrder: 3,
	},
	{
		organization: 'Indian Institute of Information Technology, Raichur',
		title: 'Full Stack Web Development (Team Lead & Mentor)',
		location: 'Raichur, India',
		employmentType: EmploymentType.PART_TIME,
		startDate: new Date('2022-08-01'),
		endDate: new Date('2024-05-01'),
		isCurrent: false,
		featured: false,
		description: ['Led and mentored the team maintaining the institute website.'],
		achievements: [
			'Led a team of developers with guidance and support, with a 20% improvement in team productivity and website performance',
			'Collaborated with a dedicated team of 10 members on the website',
			'Enhanced website traffic by 15% through SEO optimization and user-centric design enhancements',
		],
		technologies: ['React', 'Node.js'],
		website: 'https://iiitr.ac.in',
		sortOrder: 4,
	},
	{
		organization: 'Google Developer Student Clubs',
		title: 'Google Developer Student Clubs Lead',
		location: 'Raichur, India',
		employmentType: EmploymentType.PART_TIME,
		startDate: new Date('2022-07-01'),
		endDate: new Date('2023-06-01'),
		isCurrent: false,
		featured: false,
		description: ['Community leadership role alongside studies.'],
		achievements: [
			'Led the GDSC club with a focus on innovation and collaboration within the technology community',
		],
		technologies: [],
		website: 'https://gdsc.community.dev',
		sortOrder: 5,
	},
	{
		organization: 'TGH Technologies Pvt Ltd',
		title: 'Full Stack Development Internship',
		location: 'Remote, India',
		employmentType: EmploymentType.INTERN,
		startDate: new Date('2022-08-01'),
		endDate: new Date('2022-09-01'),
		isCurrent: false,
		featured: false,
		description: ['Built an internal leave management product end to end.'],
		achievements: [
			'Implemented a Leave Management System using React, Node.js and MongoDB with admin/manager approval workflows and push notifications, increasing productivity by 20%',
		],
		technologies: ['React', 'Node.js', 'MongoDB'],
		website: 'https://tghtech.com',
		sortOrder: 6,
	},
] satisfies Prisma.ExperienceUncheckedCreateInput[]

export const educations = [
	{
		university: 'Indian Institute of Information Technology, Raichur',
		degree: 'B.Tech',
		fieldOfStudy: 'Computer Science and Engineering',
		location: 'Raichur, Karnataka, India',
		startDate: new Date('2020-12-01'),
		endDate: new Date('2024-05-01'),
		isCurrent: false,
		description: [
			'Coursework in data structures and algorithms, operating systems, database management, distributed systems and software architecture.',
		],
		achievements: [
			'Team Lead & Mentor for the institute web development team',
			'Google Developer Student Clubs (GDSC) Lead',
		],
		focusAreas: [
			'Data Structures & Algorithms',
			'Distributed Systems',
			'Database Management',
			'Software Architecture',
			'Operating Systems',
		],
		website: 'https://iiitr.ac.in',
		sortOrder: 1,
	},
	{
		university: 'Tirumala IIT & Medical Academy',
		degree: 'Intermediate',
		fieldOfStudy: 'M.P.C',
		location: 'Rajahmundry, Andhra Pradesh, India',
		startDate: new Date('2018-06-01'),
		endDate: new Date('2020-03-01'),
		isCurrent: false,
		description: ['Mathematics, Physics and Chemistry.'],
		achievements: [],
		focusAreas: ['Mathematics', 'Physics', 'Chemistry'],
		website: 'https://tirumalaedu.com',
		sortOrder: 2,
	},
] satisfies Prisma.EducationUncheckedCreateInput[]

const service = (title: string, list: string, icon: string, sortOrder: number) => ({
	title,
	description: `${list}.`,
	features: list.split(', '),
	icon,
	sortOrder,
})

export const services = [
	service(
		'Frontend',
		'React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS',
		'layout',
		1,
	),
	service('Backend', 'Node.js, Express, REST APIs, Authentication & Authorization', 'server', 2),
	service('Database', 'PostgreSQL, MongoDB, MySQL', 'file-text', 3),
	service('Cloud & DevOps', 'AWS, Docker, Firebase, Vercel', 'cloud', 4),
	service('Engineering', 'System Design Basics, Performance Optimization, API Design', 'server', 5),
	service('Tools', 'Git, GitHub, CI/CD', 'file-text', 6),
] satisfies Prisma.ServiceUncheckedCreateInput[]

const skillClusters: { category: string; skills: [string, number, boolean][] }[] = [
	{
		category: 'Frontend Systems',
		skills: [
			['Next.js 16', 95, true],
			['React 19', 95, true],
			['Tailwind CSS v4', 95, true],
			['Motion (Framer)', 85, false],
			['HTML5 / Modern CSS', 95, false],
		],
	},
	{
		category: 'Backend & APIs',
		skills: [
			['NestJS 11', 95, true],
			['Node.js Runtime', 90, true],
			['Express.js', 90, false],
			['REST APIs & Swagger / OpenAPI', 95, true],
		],
	},
	{
		category: 'Database & Storage',
		skills: [
			['PostgreSQL', 90, true],
			['Prisma 7 ORM', 95, true],
			['Redis Caching & Stores', 85, true],
			['AWS S3 Object Storage', 85, false],
		],
	},
	{
		category: 'Cloud & DevOps',
		skills: [
			['AWS Cloud Services', 80, true],
			['Docker Containerization', 85, true],
			['Turborepo Monorepos', 90, false],
			['Git & GitHub Actions CI/CD', 95, true],
		],
	},
	{
		category: 'Core Languages',
		skills: [
			['TypeScript', 95, true],
			['JavaScript (ES6+)', 95, true],
			['SQL Query Optimization', 90, true],
			['Python', 80, false],
		],
	},
]

export const skills = skillClusters.flatMap(({ category, skills: list }) =>
	list.map(([name, proficiency, featured], sortOrder) => ({
		name,
		category,
		proficiency,
		featured,
		sortOrder,
	})),
) satisfies Prisma.SkillUncheckedCreateInput[]

type ProjectSeed = Omit<Prisma.ProjectUncheckedCreateInput, 'thumbnailId' | 'heroImageId'> & {
	image?: string
}

const project = (
	data: Omit<ProjectSeed, 'subtitle' | 'category' | 'descriptions' | 'caseStudy'> & {
		summary: string
		content: string
		tags: string[]
	},
): ProjectSeed => {
	const { summary, content, ...rest } = data

	return {
		...rest,
		subtitle: summary,
		shortDescription: summary,
		category: data.tags[0] ?? 'Project',
		descriptions: [content],
		caseStudy: content,
		metrics: Prisma.DbNull,
	}
}

export const projects: ProjectSeed[] = [
	project({
		slug: 'expensewise',
		title: 'ExpenseWise — Employee Benefits & Payment Instrument Integration',
		summary:
			'Employee benefits platform with e-RUPI and CBDC integrations and end-to-end voucher workflows.',
		content:
			'ExpenseWise integrates e-RUPI and CBDC payment instruments to power employee benefits. It covers end-to-end voucher workflows including creation, orders, disbursement, redemption and transaction processing, along with Scan & Pay, wallet, virtual account and fund disbursement flows. The integration layer works with NPCI/RBI payment instrument and banking APIs, handling JWE/JWS encryption, authentication, digital signatures and request/response processing.',
		tags: ['Payments', 'Fintech'],
		technologies: ['Node.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'REST APIs'],
		github: null,
		liveUrl: null,
		featured: true,
		status: ProjectStatus.COMPLETED,
		role: 'Full-Stack & Systems Lead',
		sortOrder: 1,
	}),
	project({
		slug: 'travel-flight-booking-platform',
		title: 'Travel & Flight Booking Platform',
		summary:
			'Flight booking and travel API integration with search, seat selection and booking workflows.',
		content:
			'A travel platform covering flight search, flight segments, passenger details, seat selection, fare information and booking workflows. It integrates external travel APIs behind typed API models, with authentication and optimized data fetching and caching.',
		tags: ['Travel', 'Integrations'],
		technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'REST APIs'],
		github: null,
		liveUrl: null,
		featured: true,
		status: ProjectStatus.COMPLETED,
		role: 'Backend & Systems Engineer',
		sortOrder: 2,
	}),
	project({
		slug: 'saferidex',
		title: 'SafeRideX — Blockchain-based Cab Booking System',
		summary:
			'Mini project implementing a blockchain-based cab booking workflow (Mar 2023 – Jun 2023).',
		content:
			'SafeRideX is a blockchain-based cab booking system built as a mini project between March and June 2023. It implements the core cab booking workflow and achieved a performance score above 80%.',
		tags: ['Mini Project', 'Blockchain'],
		technologies: ['Next.js', 'Tailwind CSS', 'Express', 'MongoDB', 'Firebase'],
		github: null,
		liveUrl: null,
		featured: false,
		status: ProjectStatus.COMPLETED,
		role: 'Lead Full-Stack Developer',
		startDate: new Date('2023-03-01'),
		endDate: new Date('2023-06-30'),
		image: 'images/projects/SafeRideX.webp',
		sortOrder: 3,
	}),
	project({
		slug: 'portfolio',
		title: 'Portfolio — Personal Website',
		summary: 'Open-source personal portfolio, maintained since Dec 2020.',
		content:
			'My personal portfolio, maintained as an open-source application since December 2020. The current version delivers a 10% performance improvement compared with the previous version.',
		tags: ['Open Source', 'Personal'],
		technologies: ['Next.js', 'TypeScript'],
		github: null,
		liveUrl: 'https://koushikpuppala.com',
		featured: false,
		status: ProjectStatus.IN_PROGRESS,
		role: 'Lead Architect & Engineer',
		startDate: new Date('2020-12-01'),
		image: 'images/projects/Koushikpuppala.webp',
		sortOrder: 4,
	}),
]

export const socials = [
	{
		platform: SocialPlatform.GITHUB,
		label: 'GitHub',
		handle: '@koushikpuppala',
		url: 'https://github.com/koushikpuppala',
		icon: 'github',
		featured: true,
		sortOrder: 1,
	},
	{
		platform: SocialPlatform.LINKEDIN,
		label: 'LinkedIn',
		handle: 'in/koushikpuppala',
		url: 'https://linkedin.com/in/koushikpuppala',
		icon: 'linkedin',
		featured: true,
		sortOrder: 2,
	},
	{
		platform: SocialPlatform.EMAIL,
		label: 'Email',
		handle: 'koushikpuppala@koushikpuppala.com',
		url: 'mailto:koushikpuppala@koushikpuppala.com',
		icon: 'gmail',
		featured: true,
		sortOrder: 3,
	},
] satisfies Prisma.SocialUncheckedCreateInput[]

export const metadataPages: {
	key: string
	path: string
	title: string
	description: string
	keywords: string[]
}[] = [
	{
		key: 'home',
		path: '',
		title: 'Koushik Puppala — Full-Stack Engineer',
		description:
			'Koushik Puppala, Full Stack Developer building web products with React, Next.js, Node.js and PostgreSQL.',
		keywords: ['full-stack engineer', 'Next.js', 'Node.js', 'portfolio'],
	},
	{
		key: 'about',
		path: '/about',
		title: 'Biography & Systems Philosophy',
		description:
			'About Koushik Puppala: Full Stack Developer at Earnest Data Analytics, IIIT Raichur graduate and former GDSC Lead.',
		keywords: ['Koushik Puppala', 'About', 'Full Stack Developer', 'IIIT Raichur', 'GDSC Lead'],
	},
	{
		key: 'experience',
		path: '/experience',
		title: 'Professional Experience & Career Trajectory',
		description:
			'Work history of Koushik Puppala: full stack roles, internships at Upraised® and others, and university teams.',
		keywords: ['Koushik Puppala Experience', 'Full Stack Developer', 'Upraised', 'Work History'],
	},
	{
		key: 'projects',
		path: '/projects',
		title: 'Projects',
		description:
			'Projects by Koushik Puppala: payment integrations, travel booking flows and personal open source work.',
		keywords: ['projects', 'case studies', 'Next.js', 'Node.js'],
	},
	{
		key: 'skills',
		path: '/skills',
		title: 'Technical Competencies & Technology Matrix',
		description:
			'The tools Koushik Puppala works with across frontend, backend, databases, cloud and DevOps.',
		keywords: ['Skills', 'Tech Stack', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
	},
	{
		key: 'services',
		path: '/services',
		title: 'Technical Services & Engineering Advisory',
		description:
			'The tools Koushik Puppala works with across frontend, backend, databases, cloud and DevOps.',
		keywords: ['Skills', 'Tech Stack', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
	},
	{
		key: 'education',
		path: '/education',
		title: 'Academic Background & Milestones',
		description:
			'Education of Koushik Puppala: B.Tech in Computer Science and Engineering from IIIT Raichur, plus student leadership.',
		keywords: ['IIIT Raichur', 'Computer Science Engineering', 'B.Tech', 'Education'],
	},
	{
		key: 'resume',
		path: '/resume',
		title: 'Authoritative Resume & Professional Credentials',
		description:
			'Resume of Koushik Puppala, Full Stack Developer: experience, education and skills, with a PDF download.',
		keywords: ['Resume', 'CV', 'Koushik Puppala Resume', 'Full Stack Developer'],
	},
	{
		key: 'contact',
		path: '/contact',
		title: 'Contact & Transmission',
		description:
			'Get in touch with Koushik Puppala about full stack projects, engineering roles or a quick hello.',
		keywords: ['Contact Koushik Puppala', 'Hire Full Stack Developer', 'Engineering Roles'],
	},
]
