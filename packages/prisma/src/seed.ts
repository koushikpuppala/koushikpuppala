import * as dotenv from 'dotenv'
import * as path from 'node:path'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import {
	PrismaClient,
	EmploymentType,
	ProjectStatus,
	SocialPlatform,
	MetadataType,
} from './generated/client'

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const connectionString =
	process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/koushikpuppala'

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
	console.log('🌱 Starting database seed for Koushik Puppala Portfolio & CMS...')

	// 1. Home Profile Content
	console.log('  → Seeding Home...')
	const home = await prisma.home.findFirst({
		where: { title: 'Koushik Puppala' },
	})

	if (!home) {
		await prisma.home.create({
			data: {
				title: 'Koushik Puppala',
				separator: '|',
				subtitles: [
					'Software Engineer',
					'Full-Stack Developer',
					'Open Source Contributor',
					'Former GDSC Lead',
				],
				content:
					'Passionate software engineer focused on building scalable web architectures, resilient distributed systems, and modern digital experiences with Next.js, NestJS, and PostgreSQL.',
				ctaLabel: 'Explore Projects',
				ctaUrl: '/projects',
				secondaryCtaLabel: 'Get In Touch',
				secondaryCtaUrl: '/contact',
				stats: {
					yearsOfExperience: 3,
					projectsCompleted: 20,
					codeContributions: 1800,
					menteesGuided: 50,
				},
				featuredSkills: ['TypeScript', 'Next.js 16', 'NestJS 11', 'PostgreSQL', 'Redis', 'AWS'],
				isPublished: true,
				publishedAt: new Date(),
				sortOrder: 0,
			},
		})
	}

	// 2. About
	console.log('  → Seeding About...')
	const about = await prisma.about.findFirst({
		where: { title: 'About Koushik Puppala' },
	})

	if (!about) {
		await prisma.about.create({
			data: {
				title: 'About Koushik Puppala',
				content:
					'Hi there, I am Koushik Puppala! Software engineer at Upraised and Team Lead & Mentor for the Indian Institute of Information Technology Raichur website team. Formerly served as Google Developer Student Clubs (GDSC) lead.',
				biography:
					'I specialize in designing and engineering high-throughput backend services, beautiful performant web interfaces, and modern cloud infrastructure. My work bridges intuitive user interfaces with robust, observable backend systems.',
				highlights: [
					'Software Engineer at Upraised®',
					'Head & Mentor for IIIT Raichur Web Systems Team',
					'Former Google Developer Student Clubs (GDSC) Lead',
					'Built scalable production applications serving thousands of active users',
				],
				skills: [
					'TypeScript',
					'React 19 & Next.js 16',
					'NestJS 11',
					'PostgreSQL & Prisma 7',
					'Redis Caching & Session Stores',
					'AWS Infrastructure (S3, CloudFront)',
					'Docker & Containerized Deployments',
				],
				ctaLabel: 'Download Resume',
				ctaUrl: '/resume',
				sortOrder: 0,
				isPublished: true,
				publishedAt: new Date(),
			},
		})
	}

	// 3. Work Experiences
	console.log('  → Seeding Experience...')
	const experiences = [
		{
			title: 'Software Engineer',
			company: 'Upraised®',
			location: 'Bengaluru, Karnataka, India',
			employmentType: EmploymentType.FULL_TIME,
			startDate: new Date('2023-08-01'),
			endDate: null,
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
			technologies: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'Docker'],
			website: 'https://upraised.co',
			sortOrder: 0,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			title: 'Team Lead & Mentor — Web Systems',
			company: 'Indian Institute of Information Technology, Raichur',
			location: 'Raichur, Karnataka, India',
			employmentType: EmploymentType.PART_TIME,
			startDate: new Date('2022-09-01'),
			endDate: null,
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
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			title: 'Frontend Developer Intern',
			company: 'MapleMonk',
			location: 'Bengaluru, Karnataka, India (Remote)',
			employmentType: EmploymentType.INTERN,
			startDate: new Date('2023-06-01'),
			endDate: new Date('2023-07-31'),
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
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			title: 'Google Developer Student Clubs (GDSC) Lead',
			company: 'Google Developers / IIIT Raichur',
			location: 'Raichur, Karnataka, India',
			employmentType: EmploymentType.INTERN,
			startDate: new Date('2022-07-01'),
			endDate: new Date('2023-07-01'),
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
			sortOrder: 3,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			title: 'Full Stack Developer Intern',
			company: 'TGH Technologies',
			location: 'Bengaluru, Karnataka, India (Remote)',
			employmentType: EmploymentType.INTERN,
			startDate: new Date('2022-08-01'),
			endDate: new Date('2022-09-30'),
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
			isPublished: true,
			publishedAt: new Date(),
		},
	]

	for (const exp of experiences) {
		const existing = await prisma.experience.findFirst({
			where: { company: exp.company, title: exp.title },
		})
		if (!existing) {
			await prisma.experience.create({ data: exp })
		}
	}

	// 4. Education
	console.log('  → Seeding Education...')
	const educations = [
		{
			degree: 'Bachelor of Technology (B.Tech)',
			fieldOfStudy: 'Computer Science and Engineering',
			university: 'Indian Institute of Information Technology Raichur',
			location: 'Raichur, Karnataka, India',
			description: [
				'Rigorous coursework in Data Structures, Algorithms, Distributed Operating Systems, Database Management Systems, and Software Engineering Principles.',
			],
			achievements: ['Team Lead for College Web Operations', 'Former GDSC Lead at IIIT Raichur'],
			startDate: new Date('2021-08-01'),
			endDate: new Date('2025-05-01'),
			expectedDate: new Date('2025-05-01'),
			isCurrent: false,
			website: 'https://iiitr.ac.in',
			sortOrder: 0,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			degree: 'M.P.C Intermediate (Class XII)',
			fieldOfStudy: 'Mathematics, Physics, Chemistry',
			university: 'Tirumala IIT & Medical Academy',
			location: 'Rajahmundry, Andhra Pradesh, India',
			description: [
				'Foundational study in advanced Mathematics, Physics, and analytical problem solving.',
			],
			achievements: ['Academic Excellence in Mathematics and Analytical Reasoning'],
			startDate: new Date('2018-06-01'),
			endDate: new Date('2020-03-31'),
			isCurrent: false,
			website: 'https://tirumalaedu.com',
			sortOrder: 1,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			degree: 'Secondary School Certificate (Class X)',
			fieldOfStudy: 'General Sciences & Mathematics',
			university: 'Tirumala Proactive (EM) High School',
			location: 'Rajahmundry, Andhra Pradesh, India',
			description: [
				'Secondary education with distinction in Mathematics and Science foundation curricula.',
			],
			achievements: ['Distinction in Board Examinations'],
			startDate: new Date('2017-06-01'),
			endDate: new Date('2018-03-31'),
			isCurrent: false,
			website: 'https://tirumalaedu.com',
			sortOrder: 2,
			isPublished: true,
			publishedAt: new Date(),
		},
	]

	for (const edu of educations) {
		const existing = await prisma.education.findFirst({
			where: { university: edu.university, degree: edu.degree },
		})
		if (!existing) {
			await prisma.education.create({ data: edu })
		}
	}

	// 5. Skills
	console.log('  → Seeding Skills...')
	const skills = [
		// Languages
		{
			name: 'TypeScript',
			category: 'Languages',
			proficiency: 95,
			icon: 'si:typescript',
			featured: true,
			sortOrder: 0,
		},
		{
			name: 'JavaScript (ES6+)',
			category: 'Languages',
			proficiency: 95,
			icon: 'si:javascript',
			featured: true,
			sortOrder: 1,
		},
		{
			name: 'Python',
			category: 'Languages',
			proficiency: 80,
			icon: 'si:python',
			featured: false,
			sortOrder: 2,
		},
		{
			name: 'SQL',
			category: 'Languages',
			proficiency: 90,
			icon: 'si:postgresql',
			featured: true,
			sortOrder: 3,
		},
		{
			name: 'HTML5 / CSS3',
			category: 'Languages',
			proficiency: 95,
			icon: 'si:html5',
			featured: false,
			sortOrder: 4,
		},

		// Frontend
		{
			name: 'Next.js 16',
			category: 'Frontend',
			proficiency: 95,
			icon: 'si:nextdotjs',
			featured: true,
			sortOrder: 0,
		},
		{
			name: 'React 19',
			category: 'Frontend',
			proficiency: 95,
			icon: 'si:react',
			featured: true,
			sortOrder: 1,
		},
		{
			name: 'Tailwind CSS v4',
			category: 'Frontend',
			proficiency: 95,
			icon: 'si:tailwindcss',
			featured: true,
			sortOrder: 2,
		},
		{
			name: 'Motion',
			category: 'Frontend',
			proficiency: 85,
			icon: 'si:framer',
			featured: false,
			sortOrder: 3,
		},

		// Backend
		{
			name: 'NestJS 11',
			category: 'Backend',
			proficiency: 95,
			icon: 'si:nestjs',
			featured: true,
			sortOrder: 0,
		},
		{
			name: 'Node.js',
			category: 'Backend',
			proficiency: 90,
			icon: 'si:nodedotjs',
			featured: true,
			sortOrder: 1,
		},
		{
			name: 'Express',
			category: 'Backend',
			proficiency: 90,
			icon: 'si:express',
			featured: false,
			sortOrder: 2,
		},
		{
			name: 'REST APIs & Swagger',
			category: 'Backend',
			proficiency: 95,
			icon: 'si:swagger',
			featured: true,
			sortOrder: 3,
		},

		// Database & Storage
		{
			name: 'PostgreSQL',
			category: 'Database',
			proficiency: 90,
			icon: 'si:postgresql',
			featured: true,
			sortOrder: 0,
		},
		{
			name: 'Prisma 7 ORM',
			category: 'Database',
			proficiency: 95,
			icon: 'si:prisma',
			featured: true,
			sortOrder: 1,
		},
		{
			name: 'Redis',
			category: 'Database',
			proficiency: 85,
			icon: 'si:redis',
			featured: true,
			sortOrder: 2,
		},
		{
			name: 'AWS S3',
			category: 'Database',
			proficiency: 85,
			icon: 'si:amazons3',
			featured: false,
			sortOrder: 3,
		},

		// Cloud & Tools
		{
			name: 'AWS Cloud',
			category: 'Cloud & DevOps',
			proficiency: 80,
			icon: 'si:amazonwebservices',
			featured: true,
			sortOrder: 0,
		},
		{
			name: 'Docker',
			category: 'Cloud & DevOps',
			proficiency: 85,
			icon: 'si:docker',
			featured: true,
			sortOrder: 1,
		},
		{
			name: 'Turborepo',
			category: 'Cloud & DevOps',
			proficiency: 90,
			icon: 'si:turborepo',
			featured: false,
			sortOrder: 2,
		},
		{
			name: 'Git & GitHub Actions',
			category: 'Cloud & DevOps',
			proficiency: 95,
			icon: 'si:githubactions',
			featured: true,
			sortOrder: 3,
		},
	]

	for (const skill of skills) {
		const existing = await prisma.skill.findFirst({
			where: { name: skill.name, category: skill.category },
		})
		if (!existing) {
			await prisma.skill.create({
				data: {
					...skill,
					isPublished: true,
					publishedAt: new Date(),
				},
			})
		}
	}

	// 6. Services
	console.log('  → Seeding Services...')
	const services = [
		{
			title: 'Full-Stack Web Engineering',
			description:
				'Design and delivery of end-to-end web applications combining modern Next.js frontends with robust NestJS REST API backends.',
			features: [
				'Responsive layouts and server-side rendering (SSR)',
				'PostgreSQL database modeling & caching optimization',
				'Clean modular code adhering to production best practices',
			],
			sortOrder: 0,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			title: 'Cloud Infrastructure & API Architecture',
			description:
				'Architecting scalable RESTful backends, database schema optimizations, AWS storage integrations, and CI/CD pipelines.',
			features: [
				'High-performance NestJS microservices and monoliths',
				'AWS S3 presigned asset upload workflows',
				'Redis caching and session revocation management',
			],
			sortOrder: 1,
			isPublished: true,
			publishedAt: new Date(),
		},
	]

	for (const s of services) {
		const existing = await prisma.service.findFirst({
			where: { title: s.title },
		})
		if (!existing) {
			await prisma.service.create({ data: s })
		}
	}

	// 7. Projects
	console.log('  → Seeding Projects...')
	const projects = [
		{
			slug: 'koushikpuppala-portfolio-cms',
			title: 'Personal Portfolio & CMS Platform',
			subtitle: 'Production full-stack monorepo with Next.js 16, NestJS 11, PostgreSQL, and AWS S3',
			category: 'Full Stack',
			projectType: 'Personal Platform',
			featured: true,
			status: ProjectStatus.IN_PROGRESS,
			shortDescription:
				'An enterprise-grade portfolio and custom CMS with RBAC authorization, audit logging, and asset management.',
			descriptions: [
				'Designed from the ground up using pnpm workspaces and Turborepo for strict workspace isolation.',
				'Features Next.js 16 with React 19 for the public client, alongside a secure NestJS backend with Swagger documentation.',
			],
			caseStudy:
				'Architected to eliminate dependencies on third-party CMS platforms. Incorporates PostgreSQL via Prisma 7, Redis caching, Firebase token verification, and AWS S3 direct client uploads.',
			tags: ['Next.js 16', 'NestJS 11', 'Prisma 7', 'PostgreSQL', 'Redis', 'AWS S3'],
			technologies: ['TypeScript', 'Tailwind CSS v4', 'Docker', 'Firebase Admin'],
			metrics: {
				codeQuality: 'Biome + Prettier Strict',
				architecture: 'Clean Monorepo with Turborepo',
			},
			liveUrl: 'https://koushikpuppala.com',
			github: 'https://github.com/koushikpuppala/koushikpuppala',
			sortOrder: 0,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			slug: 'expensewise',
			title: 'ExpenseWise',
			subtitle: 'AI-Powered Financial Intelligence & Automated Expense Analytics',
			category: 'Full Stack & AI',
			projectType: 'Financial Platform',
			featured: true,
			status: ProjectStatus.COMPLETED,
			shortDescription:
				'Comprehensive expense intelligence platform with automated receipt OCR, predictive budget forecasting, and multi-currency transaction telemetry.',
			descriptions: [
				'Engineered with Next.js, TypeScript, and NestJS featuring automated transaction categorization and real-time budget forecasting.',
				'Designed resilient data schemas in PostgreSQL with Redis caching for instant analytical query delivery.',
			],
			caseStudy:
				'Built an end-to-end intelligent financial management system featuring automated OCR scanning of receipts, dynamic monthly spending forecasts, and granular budget limit alerting.',
			tags: ['Next.js 16', 'NestJS 11', 'PostgreSQL', 'Prisma 7', 'Redis', 'AI / OCR'],
			technologies: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
			metrics: {
				accuracy: '99.2% OCR Precision',
				latency: '<45ms Query Latency',
			},
			liveUrl: 'https://expensewise.koushikpuppala.com',
			github: 'https://github.com/koushikpuppala/expensewise',
			sortOrder: 1,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			slug: 'travel-flight-booking-platform',
			title: 'Travel & Flight Booking Platform',
			subtitle: 'Real-time Multi-carrier Flight Search & Dynamic Itinerary Engine',
			category: 'Distributed Systems',
			projectType: 'Web Platform',
			featured: true,
			status: ProjectStatus.COMPLETED,
			shortDescription:
				'High-concurrency travel booking system featuring live seat map reservation, multi-segment routing, atomic fare locking, and automated ticketing.',
			descriptions: [
				'Built robust booking transaction pipelines with atomic state guarantees to prevent double-booking.',
				'Implemented responsive seat maps and instant fare calculations across multi-city routes.',
			],
			caseStudy:
				'Architected a distributed flight search and booking engine capable of aggregating dynamic carrier fares and managing seat hold sessions with distributed Redis locks.',
			tags: ['React 19', 'Next.js 16', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
			technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
			metrics: {
				throughput: '1.2k req/sec peak',
				availability: '99.98% uptime',
			},
			github: 'https://github.com/koushikpuppala/flight-booking-platform',
			sortOrder: 2,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			slug: 'saferidex',
			title: 'SafeRideX',
			subtitle: 'Smart Mobility & Verifiable Transportation Infrastructure',
			category: 'Web3 & Mobility',
			projectType: 'Smart Mobility',
			featured: true,
			status: ProjectStatus.COMPLETED,
			shortDescription:
				'Decentralized ride-hailing and fleet coordination platform with automated fare escrow, verifiable driver telemetry, and transparent trip settlements.',
			descriptions: [
				'Built with Next.js and Tailwind CSS on the frontend, with Node.js, Express, and Firebase on the backend.',
				'Integrated decentralized identity and verifiable credentials for rider safety and driver verification.',
			],
			caseStudy:
				'Developed a trustless transportation protocol offering peer-to-peer ride matching, cryptographic driver validation, and real-time trip route monitoring.',
			tags: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Web3'],
			technologies: ['Next.js', 'Node.js', 'Tailwind CSS', 'Firebase'],
			metrics: {
				consensus: 'Instant Finality',
				dispatch: '<2.1s Driver Match',
			},
			github: 'https://github.com/koushikpuppala/saferidex',
			sortOrder: 3,
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			slug: 'discord-custom-bots',
			title: 'Advanced Discord Automation Bots',
			subtitle: 'Feature-rich Discord bots with custom command architectures and API integrations',
			category: 'Backend & Automation',
			projectType: 'Open Source',
			featured: false,
			status: ProjectStatus.COMPLETED,
			shortDescription:
				'High-reliability community bots providing server customization, media streaming, and automated moderation.',
			descriptions: [
				'Built with modern asynchronous Node.js and TypeScript, handling real-time WebSocket events with zero downtime.',
				'Provides server moderation, entertainment commands, and integrations with external REST services.',
			],
			caseStudy:
				'Implemented event-driven design to handle concurrent guild interactions, stateful voice channels, and persistent configurations in PostgreSQL.',
			tags: ['Node.js', 'Discord.js', 'TypeScript', 'PostgreSQL', 'WebSockets'],
			technologies: ['Node.js', 'TypeScript', 'PostgreSQL'],
			github: 'https://github.com/koushikpuppala?tab=repositories',
			sortOrder: 4,
			isPublished: true,
			publishedAt: new Date(),
		},
	]

	for (const p of projects) {
		const existing = await prisma.project.findUnique({
			where: { slug: p.slug },
		})
		if (!existing) {
			await prisma.project.create({ data: p })
		}
	}

	// 8. Social Links
	console.log('  → Seeding Social Links...')
	const socials = [
		{
			platform: SocialPlatform.GITHUB,
			url: 'https://github.com/koushikpuppala',
			label: 'GitHub',
			icon: 'si:github',
			featured: true,
			sortOrder: 0,
		},
		{
			platform: SocialPlatform.LINKEDIN,
			url: 'https://linkedin.com/in/koushikpuppala',
			label: 'LinkedIn',
			icon: 'si:linkedin',
			featured: true,
			sortOrder: 1,
		},
		{
			platform: SocialPlatform.TWITTER,
			url: 'https://twitter.com/koushikpuppala',
			label: 'X (Twitter)',
			icon: 'si:x',
			featured: false,
			sortOrder: 2,
		},
		{
			platform: SocialPlatform.DISCORD,
			url: 'https://discord.com',
			label: 'Discord',
			icon: 'si:discord',
			featured: false,
			sortOrder: 3,
		},
		{
			platform: SocialPlatform.EMAIL,
			url: 'mailto:koushikpuppala@koushikpuppala.com',
			label: 'Email',
			icon: 'si:gmail',
			featured: true,
			sortOrder: 4,
		},
	]

	for (const soc of socials) {
		const existing = await prisma.social.findFirst({
			where: { platform: soc.platform },
		})
		if (!existing) {
			await prisma.social.create({ data: soc })
		}
	}

	// 9. Default Metadata (SEO)
	console.log('  → Seeding SEO Metadata...')
	const metadatas = [
		{
			key: 'home',
			type: MetadataType.PAGE,
			title: 'Koushik Puppala | Software Engineer',
			description:
				'Software Engineer at Upraised® specializing in scalable full-stack web applications, NestJS architectures, and React/Next.js systems.',
			canonicalUrl: 'https://koushikpuppala.com',
			ogImage: 'https://koushikpuppala.com/og-image.png',
			keywords: [
				'Koushik Puppala',
				'Software Engineer',
				'Full Stack Developer',
				'NestJS',
				'Next.js',
				'PostgreSQL',
			],
			value: {
				title: 'Koushik Puppala | Software Engineer',
				description: 'Official portfolio and software engineering works of Koushik Puppala.',
				robots: 'index, follow',
			},
			isPublished: true,
			publishedAt: new Date(),
		},
		{
			key: 'projects',
			type: MetadataType.PAGE,
			title: 'Projects | Koushik Puppala',
			description:
				'Showcase of full-stack engineering projects, web applications, and open-source software by Koushik Puppala.',
			canonicalUrl: 'https://koushikpuppala.com/projects',
			ogImage: 'https://koushikpuppala.com/og-image.png',
			keywords: [
				'Projects',
				'Software Portfolio',
				'Web Development',
				'NestJS Apps',
				'Next.js Work',
			],
			value: {
				title: 'Projects | Koushik Puppala',
				description: 'Explore full-stack applications and open source tools.',
				robots: 'index, follow',
			},
			isPublished: true,
			publishedAt: new Date(),
		},
	]

	for (const m of metadatas) {
		const existing = await prisma.metadata.findUnique({
			where: { key: m.key },
		})
		if (!existing) {
			await prisma.metadata.create({ data: m })
		}
	}

	console.log('✅ Seed completed successfully!')
}

main()
	.catch(e => {
		console.error('❌ Error during seed:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
		await pool.end()
	})
