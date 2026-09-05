import { Test, TestingModule } from '@nestjs/testing'
import { HomeService } from './home.service'
import { DatabaseService } from 'database'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { NotFoundException } from '@nestjs/common'

describe('HomeService', () => {
	let service: HomeService
	let prisma: jest.Mocked<DatabaseService>
	let auditLog: jest.Mocked<AuditLogService>

	const mockHome = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		version: 1,
		title: 'Koushik Puppala',
		separator: '|',
		subtitles: ['Software Engineer'],
		content: 'Engineering portfolio',
		ctaLabel: 'View Projects',
		ctaUrl: '/projects',
		secondaryCtaLabel: null,
		secondaryCtaUrl: null,
		stats: null,
		featuredSkills: ['TypeScript'],
		profileImageId: null,
		sortOrder: 0,
		isPublished: true,
		publishedAt: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		profileImage: null,
	}

	beforeEach(async () => {
		prisma = {
			home: {
				findFirst: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn(),
				create: jest.fn(),
				update: jest.fn(),
			},
		} as unknown as jest.Mocked<DatabaseService>

		auditLog = {
			create: jest.fn().mockResolvedValue(undefined),
			log: jest.fn().mockResolvedValue(undefined),
		} as unknown as jest.Mocked<AuditLogService>

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				HomeService,
				{ provide: DatabaseService, useValue: prisma },
				{ provide: AuditLogService, useValue: auditLog },
			],
		}).compile()

		service = module.get<HomeService>(HomeService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('getPublished', () => {
		it('should return published home record', async () => {
			;(prisma.home.findFirst as jest.Mock).mockResolvedValue(mockHome)

			const result = await service.getPublished()
			expect(result).toEqual(mockHome)
			expect(prisma.home.findFirst).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { isPublished: true, deletedAt: null },
				}),
			)
		})
	})

	describe('findOne', () => {
		it('should return home record if exists', async () => {
			;(prisma.home.findFirst as jest.Mock).mockResolvedValue(mockHome)

			const result = await service.findOne(mockHome.id)
			expect(result).toEqual(mockHome)
		})

		it('should throw NotFoundException if home does not exist', async () => {
			;(prisma.home.findFirst as jest.Mock).mockResolvedValue(null)

			await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException)
		})
	})

	describe('create', () => {
		it('should create home record and generate audit log', async () => {
			;(prisma.home.create as jest.Mock).mockResolvedValue(mockHome)

			const result = await service.create({
				title: 'Koushik Puppala',
				subtitles: ['Software Engineer'],
				content: 'Engineering portfolio',
			})

			expect(result).toEqual(mockHome)
			expect(auditLog.create).toHaveBeenCalled()
		})
	})
})
