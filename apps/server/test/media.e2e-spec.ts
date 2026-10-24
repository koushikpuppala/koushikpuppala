import { MediaType, UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, createUser, resetState, type TestApp } from './helpers'

describe('media (e2e)', () => {
	let t: TestApp
	let auth: Record<string, string>

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(async () => {
		await resetState(t.prisma)
		t.s3.delete.mockClear()
		t.s3.getPresignedUploadUrl.mockClear()
		auth = (await createUser(t.prisma, UserRole.EDITOR)).auth
	})

	const upload = async (name = 'hero.png', mimeType = 'image/png', size = 2048) => {
		const presign = await t
			.http()
			.post('/api/v1/media/presigned-url')
			.set(auth)
			.send({ originalName: name, mimeType, size, type: MediaType.IMAGE })
			.expect(201)

		const done = await t
			.http()
			.post('/api/v1/media/complete')
			.set(auth)
			.send({
				storageKey: presign.body.result.storageKey,
				originalName: name,
				mimeType,
				size,
				type: MediaType.IMAGE,
			})
			.expect(201)

		return done.body.result as { id: string; storageKey: string; url: string }
	}

	it('signs the exact type and size into the upload URL', async () => {
		const media = await upload('hero.png', 'image/png', 4096)

		expect(t.s3.getPresignedUploadUrl).toHaveBeenCalledWith(
			media.storageKey,
			'image/png',
			4096,
			900,
		)
		expect(media.url).toMatch(/^https:\/\/[^/]+\/general\//)
		expect(media.url).not.toContain('https://https://')
	})

	it.each([
		['logo.svg', 'image/svg+xml'],
		['page.html', 'text/html'],
		['evil.html', 'image/png'],
	])('rejects %s as %s', async (originalName, mimeType) => {
		await t
			.http()
			.post('/api/v1/media/presigned-url')
			.set(auth)
			.send({ originalName, mimeType, size: 10, type: MediaType.IMAGE })
			.expect(400)
	})

	it('cleans the folder name into a safe S3 prefix', async () => {
		const presign = await t
			.http()
			.post('/api/v1/media/presigned-url')
			.set(auth)
			.send({
				originalName: 'hero.png',
				mimeType: 'image/png',
				size: 2048,
				type: MediaType.IMAGE,
				folder: `${'/'.repeat(5000)}projects//../covers///`,
			})
			.expect(201)

		expect(presign.body.result.storageKey).toMatch(/^projects\/covers\/[0-9a-f-]{36}\.png$/)
	})

	it('refuses to register a storage key it did not issue', async () => {
		await t
			.http()
			.post('/api/v1/media/complete')
			.set(auth)
			.send({
				storageKey: 'other/../../secret.png',
				originalName: 'a.png',
				mimeType: 'image/png',
				size: 1,
				type: MediaType.IMAGE,
			})
			.expect(400)
	})

	it('blocks deleting media that a project uses, then allows it once unused', async () => {
		const media = await upload()
		const created = await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send({
				slug: 'with-image',
				title: 'T',
				subtitle: 'S',
				category: 'C',
				descriptions: ['D'],
				thumbnailId: media.id,
			})
			.expect(201)

		const blocked = await t.http().delete(`/api/v1/media/${media.id}`).set(auth).expect(409)
		expect(blocked.body.message).toContain('projectsThumbnail')
		expect(t.s3.delete).not.toHaveBeenCalled()

		await t.http().delete(`/api/v1/projects/${created.body.result.id}`).set(auth).expect(200)
		await t.http().delete(`/api/v1/media/${media.id}`).set(auth).expect(200)
		expect(t.s3.delete).toHaveBeenCalledWith(media.storageKey)
	})

	it('hides soft deleted media from public project galleries', async () => {
		const media = await upload()
		const created = await t
			.http()
			.post('/api/v1/projects')
			.set(auth)
			.send({
				slug: 'gallery',
				title: 'T',
				subtitle: 'S',
				category: 'C',
				descriptions: ['D'],
				isPublished: true,
			})
			.expect(201)
		await t
			.http()
			.post(`/api/v1/projects/${created.body.result.id}/gallery`)
			.set(auth)
			.send({ mediaId: media.id })
			.expect(201)

		expect(
			(await t.http().get('/api/v1/projects/published/gallery')).body.result.gallery,
		).toHaveLength(1)

		await t.prisma.media.update({ where: { id: media.id }, data: { deletedAt: new Date() } })

		expect(
			(await t.http().get('/api/v1/projects/published/gallery')).body.result.gallery,
		).toHaveLength(0)
	})
})
