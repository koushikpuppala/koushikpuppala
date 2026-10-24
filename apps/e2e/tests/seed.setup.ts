import { test as setup } from '@playwright/test'
import { CONTENT, USERS } from '../env'
import { apiAs, createAccount, prisma, resetAll, UserRole } from '../fixtures/db'

const project = (slug: string, title: string, extra: Record<string, unknown> = {}) => ({
	slug,
	title,
	subtitle: `${title} subtitle`,
	category: 'Backend',
	descriptions: [`${title} description.`],
	shortDescription: `${title} summary.`,
	tags: ['fintech', 'e2e'],
	technologies: ['NestJS'],
	...extra,
})

setup('seed database and accounts', async () => {
	await resetAll()

	const adminToken = await createAccount({ ...USERS.admin, role: UserRole.ADMIN })
	await createAccount({ ...USERS.editor, role: UserRole.EDITOR })
	await createAccount({ ...USERS.user, role: UserRole.USER })

	const api = apiAs(adminToken)

	await api.post('/api/v1/home', {
		title: CONTENT.homeTitle,
		subtitles: ['Software Engineer'],
		content: 'Seeded by the end to end suite.',
		isPublished: true,
	})
	await api.post('/api/v1/about', {
		title: 'About the engineer',
		leadStatement: 'Builds web platforms end to end.',
		content: 'Seeded by the end to end suite.',
		location: CONTENT.about.location,
		skills: [CONTENT.about.skill],
		isPublished: true,
	})
	await api.post('/api/v1/experience', {
		...CONTENT.experience,
		location: 'Remote',
		employmentType: 'FULL_TIME',
		startDate: '2024-01-01',
		isCurrent: true,
		description: ['Builds the payments API.'],
		technologies: ['NestJS'],
		website: 'https://e2e-corp.example.com',
		isPublished: true,
	})
	await api.post('/api/v1/education', {
		...CONTENT.education,
		location: 'Hyderabad, India',
		description: ['Seeded by the end to end suite.'],
		startDate: '2019-07-01',
		endDate: '2023-05-01',
		isCurrent: false,
		isPublished: true,
	})
	await api.post('/api/v1/socials', {
		platform: 'GITHUB',
		url: 'https://github.com/e2e',
		label: 'GitHub',
	})
	await api.post('/api/v1/skills', { name: 'TypeScript', category: 'Languages', isPublished: true })

	await api.post(
		'/api/v1/projects',
		project(CONTENT.publishedProject.slug, CONTENT.publishedProject.title, {
			featured: true,
			isPublished: true,
		}),
	)
	await api.post(
		'/api/v1/projects',
		project('round-trip', 'Round Trip Project', { isPublished: true }),
	)

	const media = await prisma.media.create({
		data: {
			fileName: CONTENT.thumbnailMediaName,
			originalName: CONTENT.thumbnailMediaName,
			size: 1024,
			mimeType: 'image/png',
			extension: 'png',
			bucket: 'e2e',
			folder: 'general',
			storageKey: `general/${CONTENT.thumbnailMediaName}`,
			url: `https://assets.e2e.test/general/${CONTENT.thumbnailMediaName}`,
		},
	})
	await api.post(
		'/api/v1/projects',
		project(CONTENT.draftProject.slug, CONTENT.draftProject.title, { thumbnailId: media.id }),
	)

	const pdf = await prisma.media.create({
		data: {
			fileName: CONTENT.resume.mediaName,
			originalName: CONTENT.resume.mediaName,
			size: 2048,
			mimeType: 'application/pdf',
			extension: 'pdf',
			bucket: 'e2e',
			folder: 'resume',
			storageKey: `resume/${CONTENT.resume.mediaName}`,
			url: `https://assets.e2e.test/resume/${CONTENT.resume.mediaName}`,
		},
	})
	await api.post('/api/v1/resume', {
		title: CONTENT.resume.title,
		mediaId: pdf.id,
		isPublished: true,
	})

	await prisma.$disconnect()
})
