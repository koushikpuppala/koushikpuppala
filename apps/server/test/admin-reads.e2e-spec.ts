import { UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, resetState, type TestApp } from './helpers'

const MISSING = '00000000-0000-4000-8000-000000000000'

describe('admin lists, filters and single records (e2e)', () => {
	let t: TestApp
	let auth: Record<string, string>

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(async () => {
		await resetState(t.prisma)
		;({ auth } = await createUser(t.prisma, UserRole.ADMIN))
	})

	const get = (path: string) => t.http().get(path).set(auth)
	const ids = (body: { result: { items: Array<{ id: string }> } }) => body.result.items.map(item => item.id).sort()

	const media = (fileName: string, extra: Record<string, unknown> = {}) =>
		t.prisma.media.create({
			data: {
				fileName,
				originalName: fileName,
				size: 1024,
				mimeType: 'image/png',
				extension: 'png',
				bucket: 'test-bucket',
				storageKey: `general/${fileName}`,
				url: `https://cdn.test/general/${fileName}`,
				type: 'IMAGE',
				...extra,
			},
		})

	describe('home and about', () => {
		it.each([
			['home', (title: string, isPublished: boolean) => t.prisma.home.create({ data: { title, subtitles: [], content: `${title} body`, featuredSkills: [], isPublished } })],
			['about', (title: string, isPublished: boolean) => t.prisma.about.create({ data: { title, content: `${title} body`, highlights: [], skills: [], isPublished } })],
		])('%s: published read, list filters and single record', async (base, create) => {
			const live = await create('Live entry', true)
			const draft = await create('Draft entry', false)

			const published = await t.http().get(`/api/v1/${base}/published`).expect(200)
			expect(published.body.result.id).toBe(live.id)

			expect(ids((await get(`/api/v1/${base}?search=draft`).expect(200)).body)).toEqual([draft.id])
			expect(ids((await get(`/api/v1/${base}?isPublished=true`).expect(200)).body)).toEqual([live.id])
			expect((await get(`/api/v1/${base}/${draft.id}`).expect(200)).body.result.title).toBe('Draft entry')
			await get(`/api/v1/${base}/${MISSING}`).expect(404)
		})
	})

	describe('collections', () => {
		it('education: list filters, published and single record', async () => {
			const base = { fieldOfStudy: 'CS', location: 'London', description: [], achievements: [], focusAreas: [], startDate: new Date('2019-01-01') }
			const a = await t.prisma.education.create({ data: { ...base, degree: 'B.Tech', university: 'Alpha University', isPublished: true } })
			const b = await t.prisma.education.create({ data: { ...base, degree: 'M.Tech', university: 'Beta Institute', isPublished: false } })

			expect(ids((await get('/api/v1/education?search=beta').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/education?isPublished=true&sortBy=startDate&sortOrder=asc').expect(200)).body)).toEqual([a.id])
			expect((await t.http().get('/api/v1/education/published').expect(200)).body.result.map((e: { id: string }) => e.id)).toEqual([a.id])
			await get(`/api/v1/education/${a.id}`).expect(200)
			await get(`/api/v1/education/${MISSING}`).expect(404)
		})

		it('experience: search, type, featured and published filters', async () => {
			const base = { location: 'Remote', startDate: new Date('2024-01-01'), description: [], achievements: [], technologies: [] }
			const a = await t.prisma.experience.create({ data: { ...base, title: 'Engineer', organization: 'Alpha', employmentType: 'FULL_TIME', featured: true, isPublished: true } })
			const b = await t.prisma.experience.create({ data: { ...base, title: 'Intern', organization: 'Beta', employmentType: 'INTERN', isPublished: false } })

			expect(ids((await get('/api/v1/experience?search=beta').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/experience?employmentType=FULL_TIME').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/experience?featured=true').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/experience?isPublished=false').expect(200)).body)).toEqual([b.id])
			await get(`/api/v1/experience/${b.id}`).expect(200)
			await get(`/api/v1/experience/${MISSING}`).expect(404)
		})

		it('skills: full lifecycle, filters and published by category', async () => {
			const created = await t.http().post('/api/v1/skills').set(auth).send({ name: 'React', category: 'Frontend', featured: true }).expect(201)
			const id = created.body.result.id
			const backend = await t.prisma.skill.create({ data: { name: 'NestJS', category: 'Backend', isPublished: false } })

			expect(ids((await get('/api/v1/skills?search=nest').expect(200)).body)).toEqual([backend.id])
			expect(ids((await get('/api/v1/skills?category=Frontend').expect(200)).body)).toEqual([id])
			expect(ids((await get('/api/v1/skills?featured=true').expect(200)).body)).toEqual([id])
			expect(ids((await get('/api/v1/skills?isPublished=false').expect(200)).body)).toEqual([backend.id])

			const frontend = await t.http().get('/api/v1/skills/published?category=Frontend').expect(200)
			expect(frontend.body.result.map((s: { name: string }) => s.name)).toEqual(['React'])
			expect((await t.http().get('/api/v1/skills/published').expect(200)).body.result).toHaveLength(1)

			await t.http().patch(`/api/v1/skills/${id}`).set(auth).send({ name: 'React 19' }).expect(200)
			await t.http().patch(`/api/v1/skills/${id}/publish`).set(auth).expect(200)
			await get(`/api/v1/skills/${id}`).expect(200)
			await t.http().delete(`/api/v1/skills/${id}`).set(auth).expect(200)
			await get(`/api/v1/skills/${id}`).expect(404)
		})

		it('services: search, published filter and single record', async () => {
			const a = await t.prisma.service.create({ data: { title: 'Frontend', description: 'UI', features: [], isPublished: true } })
			const b = await t.prisma.service.create({ data: { title: 'Backend', description: 'APIs', features: [], isPublished: false } })

			expect(ids((await get('/api/v1/services?search=apis').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/services?isPublished=true').expect(200)).body)).toEqual([a.id])
			await get(`/api/v1/services/${a.id}`).expect(200)
			await get(`/api/v1/services/${MISSING}`).expect(404)
		})

		it('socials: search, platform, featured and visibility filters', async () => {
			const a = await t.prisma.social.create({ data: { platform: 'GITHUB', url: 'https://github.com/ada', label: 'GitHub', featured: true } })
			const b = await t.prisma.social.create({ data: { platform: 'EMAIL', url: 'mailto:ada@example.test', handle: 'ada', isVisible: false } })

			expect(ids((await get('/api/v1/socials?search=mailto').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/socials?platform=GITHUB').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/socials?featured=true').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/socials?isVisible=false').expect(200)).body)).toEqual([b.id])
			await get(`/api/v1/socials/${a.id}`).expect(200)
			await get(`/api/v1/socials/${MISSING}`).expect(404)
		})
	})

	describe('projects', () => {
		const project = (slug: string, extra: Record<string, unknown> = {}) =>
			t.prisma.project.create({
				data: { slug, title: slug.toUpperCase(), subtitle: 'Sub', category: 'Product', descriptions: [], tags: [], technologies: [], ...extra },
			})

		it('filters the admin list and the published list', async () => {
			const a = await project('alpha', { featured: true, status: 'COMPLETED', isPublished: true })
			const b = await project('beta', { category: 'Personal', isPublished: false, status: 'IN_PROGRESS' })

			expect(ids((await get('/api/v1/projects?search=beta').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/projects?category=Personal').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/projects?status=COMPLETED').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/projects?featured=true').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/projects?isPublished=false').expect(200)).body)).toEqual([b.id])

			const featured = await t.http().get('/api/v1/projects/published?featured=true&category=Product').expect(200)
			expect(featured.body.result.map((p: { slug: string }) => p.slug)).toEqual(['alpha'])
			await get(`/api/v1/projects/${a.id}`).expect(200)
			await t.http().get('/api/v1/projects/published/beta').expect(404)
		})

		it('refuses to rename a project to a slug that is taken', async () => {
			await project('alpha')
			const b = await project('beta')

			await t.http().patch(`/api/v1/projects/${b.id}`).set(auth).send({ slug: 'alpha' }).expect(409)
			await t.http().patch(`/api/v1/projects/${b.id}`).set(auth).send({ slug: 'gamma' }).expect(200)
		})

		it('adds, updates and removes gallery media, and 404s for unknown items', async () => {
			const p = await project('gallery')
			const m = await media('shot.png')

			await t.http().post(`/api/v1/projects/${p.id}/gallery`).set(auth).send({ mediaId: m.id, title: 'Shot' }).expect(201)
			const updated = await t.http().patch(`/api/v1/projects/${p.id}/gallery/${m.id}`).set(auth).send({ caption: 'The dashboard' }).expect(200)
			expect(updated.body.result.caption).toBe('The dashboard')

			await t.http().delete(`/api/v1/projects/${p.id}/gallery/${m.id}`).set(auth).expect(200)
			await t.http().delete(`/api/v1/projects/${p.id}/gallery/${m.id}`).set(auth).expect(404)
			await t.http().patch(`/api/v1/projects/${p.id}/gallery/${MISSING}`).set(auth).send({ caption: 'x' }).expect(404)
		})
	})

	describe('contacts', () => {
		const contact = (subject: string, extra: Record<string, unknown> = {}) =>
			t.prisma.contact.create({ data: { name: 'Grace', email: 'grace@example.test', subject, message: `${subject} message`, ...extra } })

		it('marks a message read when opened, records when it is resolved, and deletes it', async () => {
			const c = await contact('Compilers')

			// The contact's own `message` field must come back in the record, not replace the response message.
			const opened = (await get(`/api/v1/contacts/${c.id}`).expect(200)).body
			expect(opened.result).toMatchObject({ id: c.id, status: 'READ', message: 'Compilers message' })
			const resolved = await t.http().patch(`/api/v1/contacts/${c.id}`).set(auth).send({ status: 'RESOLVED' }).expect(200)
			expect(resolved.body.result.resolvedAt).toBeTruthy()
			await t.http().patch(`/api/v1/contacts/${c.id}`).set(auth).send({ priority: 'HIGH' }).expect(200)

			await t.http().delete(`/api/v1/contacts/${c.id}`).set(auth).expect(200)
			await get(`/api/v1/contacts/${c.id}`).expect(404)
		})

		it('filters by search, status, priority and date, with whole table counts', async () => {
			const a = await contact('Compilers', { priority: 'URGENT' })
			const b = await contact('Hello', { status: 'RESOLVED' })

			expect(ids((await get('/api/v1/contacts?search=compil').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/contacts?status=RESOLVED').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/contacts?priority=URGENT').expect(200)).body)).toEqual([a.id])
			expect((await get('/api/v1/contacts?from=2999-01-01').expect(200)).body.result.items).toEqual([])

			const all = (await get('/api/v1/contacts').expect(200)).body.result
			expect(all).toMatchObject({ unreadCount: 1, urgentCount: 1, resolvedCount: 1 })
		})
	})

	describe('media', () => {
		it('filters by search, type and folder, reads one, and updates alt text', async () => {
			const a = await media('hero.png', { folder: 'projects' })
			const b = await media('cv.pdf', { type: 'DOCUMENT', mimeType: 'application/pdf', extension: 'pdf', altText: 'Resume file' })

			expect(ids((await get('/api/v1/media?search=resume').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/media?type=IMAGE').expect(200)).body)).toEqual([a.id])
			expect(ids((await get('/api/v1/media?folder=projects').expect(200)).body)).toEqual([a.id])
			await get(`/api/v1/media/${a.id}`).expect(200)
			await get(`/api/v1/media/${MISSING}`).expect(404)

			const updated = await t.http().patch(`/api/v1/media/${a.id}`).set(auth).send({ altText: 'Hero', caption: 'Top' }).expect(200)
			expect(updated.body.result).toMatchObject({ altText: 'Hero', caption: 'Top' })
		})

		it('explains when storage cannot sign an upload', async () => {
			t.s3.getPresignedUploadUrl.mockRejectedValueOnce(new Error('no credentials'))

			const res = await t.http().post('/api/v1/media/presigned-url').set(auth).send({ originalName: 'a.png', mimeType: 'image/png', size: 10, type: 'IMAGE' }).expect(400)

			expect(res.body.message).toMatch(/failed to generate upload url/i)
		})

		it('rejects a file whose extension does not match its type, even without an extension', async () => {
			const res = await t.http().post('/api/v1/media/presigned-url').set(auth).send({ originalName: 'noext', mimeType: 'image/png', size: 10, type: 'IMAGE' }).expect(400)

			expect(res.body.message).toContain('(none)')
		})
	})

	describe('resume', () => {
		const pdf = (extra: Record<string, unknown> = {}) =>
			media(`cv-${Math.random().toString(36).slice(2)}.pdf`, { type: 'DOCUMENT', mimeType: 'application/pdf', extension: 'pdf', ...extra })

		it('lists versions with search and published filters', async () => {
			const a = await t.prisma.resume.create({ data: { title: 'Main', versionName: 'v1', competencies: [], mediaId: (await pdf()).id, isPublished: true } })
			const b = await t.prisma.resume.create({ data: { title: 'Draft', versionName: 'v2', competencies: [], mediaId: (await pdf()).id, isPublished: false } })

			expect(ids((await get('/api/v1/resume?search=v2').expect(200)).body)).toEqual([b.id])
			expect(ids((await get('/api/v1/resume?isPublished=true').expect(200)).body)).toEqual([a.id])
		})

		it('refuses a deleted, non PDF or oversized file', async () => {
			const deleted = await pdf({ deletedAt: new Date() })
			const image = await media('photo.png')
			const huge = await pdf({ size: 11 * 1024 * 1024 })
			const create = (mediaId: string) => t.http().post('/api/v1/resume').set(auth).send({ title: 'CV', mediaId, competencies: [] })

			expect((await create(deleted.id).expect(400)).body.message).toMatch(/has been deleted/)
			expect((await create(image.id).expect(400)).body.message).toMatch(/must be a PDF/)
			expect((await create(huge.id).expect(400)).body.message).toMatch(/10 MB or smaller/)
			expect((await create(MISSING).expect(404)).body.message).toMatch(/does not exist/)
		})

		it('answers 404 for a download when nothing is published or the file is missing', async () => {
			await t.http().post('/api/v1/resume/download').expect(404)

			await t.prisma.resume.create({ data: { title: 'Main', competencies: [], mediaId: (await pdf()).id, isPublished: true } })
			t.s3.getSignedUrl.mockRejectedValueOnce(new Error('NoSuchKey'))

			const res = await t.http().post('/api/v1/resume/download').expect(404)
			expect(res.body.message).toMatch(/not available/)
		})

		it('keeps the save when removing the replaced file fails', async () => {
			const first = await pdf()
			const second = await pdf()
			const created = await t.http().post('/api/v1/resume').set(auth).send({ title: 'CV', mediaId: first.id, competencies: [] }).expect(201)
			t.s3.delete.mockRejectedValueOnce(new Error('S3 down'))

			await t.http().patch(`/api/v1/resume/${created.body.result.id}`).set(auth).send({ mediaId: second.id }).expect(200)

			expect((await t.prisma.resume.findUnique({ where: { id: created.body.result.id } }))?.mediaId).toBe(second.id)
		})
	})

	describe('users and sessions', () => {
		it('filters users by role, status, search and date, and reads one', async () => {
			const { user: editor } = await createUser(t.prisma, UserRole.EDITOR)
			const { user: inactive } = await createUser(t.prisma, UserRole.USER, 'INACTIVE')
			const emails = async (query: string) =>
				(await get(`/api/v1/users?${query}`).expect(200)).body.result.items.map((u: { email: string }) => u.email).sort()

			expect(await emails('role=EDITOR')).toEqual([editor.email])
			expect(await emails('status=INACTIVE')).toEqual([inactive.email])
			expect(await emails(`search=${inactive.email.split('@')[0]}`)).toEqual([inactive.email])
			expect(await emails('from=2999-01-01')).toEqual([])
			expect((await get(`/api/v1/users/${editor.id}`).expect(200)).body.result.email).toBe(editor.email)
			await get(`/api/v1/users/${MISSING}`).expect(404)
		})

		it('lists sessions, revokes one, ignores a second revoke and 404s for an unknown one', async () => {
			await t.http().post('/api/v1/auth/login').set(auth).expect(201)
			const sessions = (await get('/api/v1/auth/sessions').expect(200)).body.result
			expect(sessions.length).toBeGreaterThan(0)

			const { auth: other } = await createUser(t.prisma, UserRole.EDITOR)
			await t.http().post('/api/v1/auth/login').set(other).expect(201)
			const theirs = (await get('/api/v1/auth/sessions').expect(200)).body.result.find(
				(s: { user: { email: string } }) => s.user.email.startsWith('editor'),
			)

			await t.http().delete(`/api/v1/auth/sessions/${theirs.id}`).set(auth).expect(204)
			await t.http().delete(`/api/v1/auth/sessions/${theirs.id}`).set(auth).expect(204)
			await t.http().delete(`/api/v1/auth/sessions/${MISSING}`).set(auth).expect(404)
			await t.http().get('/api/v1/auth/me').set(other).expect(401)
		})

		it('signs out by revoking the current session', async () => {
			await t.http().post('/api/v1/auth/login').set(auth).expect(201)

			await t.http().post('/api/v1/auth/logout').set(auth).expect(204)

			await t.http().get('/api/v1/auth/me').set(auth).expect(401)
		})
	})
})
