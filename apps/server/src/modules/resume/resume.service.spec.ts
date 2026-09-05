import { Test, TestingModule } from '@nestjs/testing'
import { ResumeService } from './resume.service'
import { DatabaseService } from 'database'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { S3Service } from 'common/storage/s3.service'
import { NotFoundException } from '@nestjs/common'

describe('ResumeService', () => {
	let service: ResumeService
	let prisma: jest.Mocked<DatabaseService>
	let auditLog: jest.Mocked<AuditLogService>
	let s3Service: jest.Mocked<S3Service>

	const mockMedia = {
		id: 'media-res-1',
		fileName: 'resume.pdf',
		originalName: 'Koushik_Puppala_Resume.pdf',
		size: 154000,
		mimeType: 'application/pdf',
		url: 'https://cdn.koushikpuppala.com/resumes/resume.pdf',
		storageKey: 'resumes/resume.pdf',
	}

	const mockResume = {
		id: 'res-1',
		title: 'Koushik Puppala — Senior Software Engineer Resume',
		versionName: '2026.1',
		mediaId: 'media-res-1',
		fileSize: 154000,
		fileType: 'application/pdf',
		checksum: null,
		downloads: 42,
		sortOrder: 0,
		isPublished: true,
		publishedAt: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		media: mockMedia,
	}

	beforeEach(async () => {
		prisma = {
			resume: {
				findFirst: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn(),
				create: jest.fn(),
				update: jest.fn(),
			},
			media: {
				findUnique: jest.fn(),
			},
		} as unknown as jest.Mocked<DatabaseService>

		auditLog = {
			create: jest.fn().mockResolvedValue(undefined),
			log: jest.fn().mockResolvedValue(undefined),
		} as unknown as jest.Mocked<AuditLogService>

		s3Service = {
			getSignedUrl: jest.fn().mockResolvedValue('https://s3.signed-url/resume.pdf'),
		} as unknown as jest.Mocked<S3Service>

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ResumeService,
				{ provide: DatabaseService, useValue: prisma },
				{ provide: AuditLogService, useValue: auditLog },
				{ provide: S3Service, useValue: s3Service },
			],
		}).compile()

		service = module.get<ResumeService>(ResumeService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('getLatest', () => {
		it('should return latest published resume with download URL', async () => {
			;(prisma.resume.findFirst as jest.Mock).mockResolvedValue(mockResume)

			const result = await service.getLatest()
			expect(result.id).toBe('res-1')
			expect(result.downloadUrl).toBe(mockMedia.url)
		})

		it('should throw NotFoundException if no published resume exists', async () => {
			;(prisma.resume.findFirst as jest.Mock).mockResolvedValue(null)

			await expect(service.getLatest()).rejects.toThrow(NotFoundException)
		})
	})

	describe('trackDownloadAndGetUrl', () => {
		it('should increment download count and return download URL', async () => {
			;(prisma.resume.findFirst as jest.Mock).mockResolvedValue(mockResume)
			;(prisma.resume.update as jest.Mock).mockResolvedValue({
				...mockResume,
				downloads: mockResume.downloads + 1,
			})

			const result = await service.trackDownloadAndGetUrl()
			expect(result.downloads).toBe(43)
			expect(prisma.resume.update).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: 'res-1' },
					data: { downloads: { increment: 1 } },
				}),
			)
		})
	})

	describe('create', () => {
		it('should create resume with valid media reference', async () => {
			;(prisma.media.findUnique as jest.Mock).mockResolvedValue(mockMedia)
			;(prisma.resume.create as jest.Mock).mockResolvedValue(mockResume)

			const result = await service.create({
				title: 'Koushik Puppala — Senior Software Engineer Resume',
				versionName: '2026.1',
				mediaId: 'media-res-1',
			})

			expect(result).toEqual(mockResume)
			expect(auditLog.create).toHaveBeenCalled()
		})

		it('should throw NotFoundException if media document not found', async () => {
			;(prisma.media.findUnique as jest.Mock).mockResolvedValue(null)

			await expect(
				service.create({
					title: 'Resume',
					versionName: '2026.1',
					mediaId: 'invalid-media',
				}),
			).rejects.toThrow(NotFoundException)
		})
	})
})
