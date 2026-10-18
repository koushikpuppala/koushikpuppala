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

	await prisma.$disconnect()
})
