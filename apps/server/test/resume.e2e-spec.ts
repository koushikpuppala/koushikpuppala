import { UserRole } from '@repo/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { bootApp, createUser, isRevalidateRequest, resetState, type TestApp } from './helpers'

const MB = 1024 * 1024

describe('resume (e2e)', () => {
	let t: TestApp
	let auth: Record<string, string>

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(async () => {
		await resetState(t.prisma)
		t.s3.delete.mockClear()
		t.s3.getSignedUrl.mockClear()
		auth = (await createUser(t.prisma, UserRole.EDITOR)).auth
	})

	let counter = 0

	const createMedia = (data: { mimeType?: string; size?: number; deletedAt?: Date } = {}) => {
		counter += 1

		return t.prisma.media.create({
			data: {
				fileName: `cv-${counter}.pdf`,
				originalName: `cv-${counter}.pdf`,
				size: data.size ?? 2048,
				mimeType: data.mimeType ?? 'application/pdf',
				extension: 'pdf',
				bucket: 'test-bucket',
				storageKey: `resume/cv-${counter}.pdf`,
				deletedAt: data.deletedAt,
			},
		})
	}

	const publishResume = async (title = 'Koushik Puppala Resume', versionName = '2026.1') => {
		const media = await createMedia()

		return t.prisma.resume.create({
			data: { title, versionName, mediaId: media.id, isPublished: true, publishedAt: new Date() },
			include: { media: true },
		})
	}

	const downloads = async (id: string) =>
		(await t.prisma.resume.findUniqueOrThrow({ where: { id } })).downloads

	describe('POST /api/v1/resume/download', () => {
		it('returns a named attachment link and counts the download', async () => {
			const resume = await publishResume()

			const res = await t.http().post('/api/v1/resume/download').expect(200)

			expect(res.body.result).toEqual({
				url: `https://signed.test/${resume.media.storageKey}`,
				fileName: 'koushik_puppala_resume_2026.1.pdf',
			})
			expect(t.s3.getSignedUrl).toHaveBeenCalledWith(resume.media.storageKey, 60, {
				fileName: 'koushik_puppala_resume_2026.1.pdf',
				contentType: 'application/pdf',
			})
			expect(await downloads(resume.id)).toBe(1)
		})

		it('returns 404 when no resume is published', async () => {
			await t.http().post('/api/v1/resume/download').expect(404)

			expect(t.s3.getSignedUrl).not.toHaveBeenCalled()
		})

		it('returns 404 without counting when the file is missing from storage', async () => {
			const resume = await publishResume()
			t.s3.getSignedUrl.mockRejectedValueOnce(new Error('File not found'))

			await t.http().post('/api/v1/resume/download').expect(404)

			expect(await downloads(resume.id)).toBe(0)
		})

		it('never asks the public site to refresh', async () => {
			await publishResume()
			const realFetch = globalThis.fetch
			const fetchSpy = vi
				.spyOn(globalThis, 'fetch')
				.mockImplementation((input, init) =>
					isRevalidateRequest(input) ? Promise.resolve(new Response('{}')) : realFetch(input, init),
				)

			try {
				await t.http().post('/api/v1/resume/download').expect(200)
				await new Promise(resolve => setTimeout(resolve, 100))

				expect(fetchSpy.mock.calls.filter(([url]) => isRevalidateRequest(url))).toEqual([])
			} finally {
				fetchSpy.mockRestore()
			}
		})
	})

	it('adds the download file name to the public and admin reads', async () => {
		const resume = await publishResume('CV', '')

		const latest = await t.http().get('/api/v1/resume/latest').expect(200)
		const one = await t.http().get(`/api/v1/resume/${resume.id}`).set(auth).expect(200)

		expect(latest.body.result.downloadFileName).toBe('cv.pdf')
		expect(one.body.result.downloadFileName).toBe('cv.pdf')
	})

	it('keeps the file address out of the public read', async () => {
		await publishResume()

		const latest = await t.http().get('/api/v1/resume/latest').expect(200)
		const body = JSON.stringify(latest.body.result)

		expect(latest.body.result.hasFile).toBe(true)
		expect(latest.body.result.downloadUrl).toBeUndefined()
		expect(body).not.toContain('storageKey')
		expect(body).not.toContain('resume/cv-')
		expect(t.s3.getSignedUrl).not.toHaveBeenCalled()
	})

	it('replaces the file and removes the old one from storage', async () => {
		const resume = await publishResume()
		const next = await createMedia()

		await t
			.http()
			.patch(`/api/v1/resume/${resume.id}`)
			.set(auth)
			.send({ mediaId: next.id })
			.expect(200)

		const old = await t.prisma.media.findUniqueOrThrow({ where: { id: resume.mediaId } })
		expect((await t.prisma.resume.findUniqueOrThrow({ where: { id: resume.id } })).mediaId).toBe(
			next.id,
		)
		expect(old.deletedAt).not.toBeNull()
		expect(t.s3.delete).toHaveBeenCalledWith(old.storageKey)
	})

	it('still saves when removing the old file from storage fails', async () => {
		const resume = await publishResume()
		const next = await createMedia()
		t.s3.delete.mockRejectedValueOnce(new Error('S3 unavailable'))

		await t
			.http()
			.patch(`/api/v1/resume/${resume.id}`)
			.set(auth)
			.send({ mediaId: next.id })
			.expect(200)

		expect((await t.prisma.resume.findUniqueOrThrow({ where: { id: resume.id } })).mediaId).toBe(
			next.id,
		)
	})

	it.each([
		['an image', { mimeType: 'image/png' }],
		['a deleted file', { deletedAt: new Date() }],
		['a PDF over 10 MB', { size: 10 * MB + 1 }],
	])('rejects %s as the resume file', async (_label, media) => {
		const resume = await publishResume()
		const bad = await createMedia(media)

		await t
			.http()
			.patch(`/api/v1/resume/${resume.id}`)
			.set(auth)
			.send({ mediaId: bad.id })
			.expect(400)
		await t
			.http()
			.post('/api/v1/resume')
			.set(auth)
			.send({ title: 'CV', mediaId: bad.id })
			.expect(400)
	})

	it('requires sign-in to change the resume', async () => {
		const resume = await publishResume()

		await t.http().patch(`/api/v1/resume/${resume.id}`).send({ title: 'x' }).expect(401)
		await t.http().post('/api/v1/resume').send({ title: 'x' }).expect(401)
	})
})
