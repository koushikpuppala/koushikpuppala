import type { DatabaseService } from 'database'
import type { Configuration } from 'config/configuration'
import type { StorageService } from 'types/server'
import type { AuditLogService } from 'modules/audit-log/audit-log.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'

import { MediaType } from '@repo/prisma'
import { MediaService } from './media.service'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

const config = {
	production: false,
	aws: {
		region: 'ap-south-2',
		s3Bucket: 'bucket',
		cdnUrl: 'https://assets.example.com',
		verifyUploads: false,
	},
} as unknown as Configuration

const noUsage = {
	resume: null,
	_count: {
		homes: 0,
		about: 0,
		skills: 0,
		services: 0,
		education: 0,
		experiences: 0,
		projectsHero: 0,
		projectsThumbnail: 0,
		projectGalleries: 0,
	},
}

describe('MediaService', () => {
	let s3: { getPresignedUploadUrl: Mock; exists: Mock; stat: Mock; delete: Mock }
	let prisma: { media: { findFirst: Mock; findUnique: Mock; update: Mock } }
	let service: MediaService

	beforeEach(() => {
		s3 = {
			getPresignedUploadUrl: vi.fn(async () => 'https://signed.example.com'),
			exists: vi.fn(async () => true),
			stat: vi.fn(async () => ({ contentType: 'image/png', size: 10 })),
			delete: vi.fn(async () => undefined),
		}
		prisma = {
			media: {
				findFirst: vi.fn(async () => ({ id: 'm1', storageKey: 'general/key.png' })),
				findUnique: vi.fn(async () => noUsage),
				update: vi.fn(async () => ({})),
			},
		}
		service = new MediaService(
			prisma as unknown as DatabaseService,
			new CmsAuditService({ create: vi.fn() } as unknown as AuditLogService),
			s3 as unknown as StorageService,
			config,
		)
	})

	const presign = (originalName: string, mimeType: string, size = 1024) =>
		service.requestPresignedUpload({ originalName, mimeType, size, type: MediaType.IMAGE })

	describe('requestPresignedUpload', () => {
		it('signs an allowed image with its exact type and size', async () => {
			const result = await presign('hero.PNG', 'image/png', 2048)

			expect(s3.getPresignedUploadUrl).toHaveBeenCalledWith(
				expect.stringMatching(/^general\/[0-9a-f-]{36}\.png$/),
				'image/png',
				2048,
				900,
			)
			expect(result.url).toMatch(/^https:\/\/assets\.example\.com\/general\//)
		})

		it.each([
			['logo.svg', 'image/svg+xml'],
			['page.html', 'text/html'],
			['run.sh', 'application/x-sh'],
		])('rejects %s (%s)', async (name, type) => {
			await expect(presign(name, type)).rejects.toThrow(BadRequestException)
		})

		it('rejects an extension that does not match the type', async () => {
			await expect(presign('evil.html', 'image/png')).rejects.toThrow(BadRequestException)
		})

		it('rejects files over the size limit', async () => {
			await expect(presign('big.mp4', 'video/mp4', 51 * 1024 * 1024)).rejects.toThrow(
				BadRequestException,
			)
		})
	})

	describe('completeUpload', () => {
		it('rejects a storage key the service did not issue', async () => {
			await expect(
				service.completeUpload({
					storageKey: '../../etc/passwd',
					originalName: 'a.png',
					mimeType: 'image/png',
					size: 10,
					type: MediaType.IMAGE,
				}),
			).rejects.toThrow(BadRequestException)
		})

		it('rejects an upload that never reached storage when verification is on', async () => {
			const verifying = new MediaService(
				prisma as unknown as DatabaseService,
				new CmsAuditService({ create: vi.fn() } as unknown as AuditLogService),
				s3 as unknown as StorageService,
				{ ...config, aws: { ...config.aws, verifyUploads: true } } as Configuration,
			)
			const storageKey = 'general/0b5e1f8e-3c1d-4a4e-9a57-1f2b3c4d5e6f.png'
			s3.stat.mockResolvedValueOnce(null)

			await expect(
				verifying.completeUpload({
					storageKey,
					originalName: 'a.png',
					mimeType: 'image/png',
					size: 10,
					type: MediaType.IMAGE,
				}),
			).rejects.toThrow(/does not exist in storage/)
			expect(s3.stat).toHaveBeenCalledWith(storageKey)
		})

		it.each([
			['type', { contentType: 'text/html', size: 10 }],
			['size', { contentType: 'image/png', size: 9999 }],
		])('rejects an upload whose stored %s differs from the request', async (_field, stored) => {
			const verifying = new MediaService(
				prisma as unknown as DatabaseService,
				new CmsAuditService({ create: vi.fn() } as unknown as AuditLogService),
				s3 as unknown as StorageService,
				{ ...config, aws: { ...config.aws, verifyUploads: true } } as Configuration,
			)
			s3.stat.mockResolvedValueOnce(stored)

			await expect(
				verifying.completeUpload({
					storageKey: 'general/0b5e1f8e-3c1d-4a4e-9a57-1f2b3c4d5e6f.png',
					originalName: 'a.png',
					mimeType: 'image/png',
					size: 10,
					type: MediaType.IMAGE,
				}),
			).rejects.toThrow(/does not match/)
		})
	})

	describe('remove', () => {
		it('refuses to delete media that live content still uses', async () => {
			prisma.media.findUnique.mockImplementation(async () => ({
				...noUsage,
				_count: { ...noUsage._count, projectsThumbnail: 2 },
			}))

			await expect(service.remove('m1')).rejects.toThrow(ConflictException)
			expect(s3.delete).not.toHaveBeenCalled()
		})

		it('deletes unused media from storage', async () => {
			await expect(service.remove('m1')).resolves.toEqual({ id: 'm1', deleted: true })
			expect(s3.delete).toHaveBeenCalledWith('general/key.png')
		})
	})
})
