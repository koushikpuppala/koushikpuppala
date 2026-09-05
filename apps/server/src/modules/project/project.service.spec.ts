import { Test, TestingModule } from '@nestjs/testing'
import { ProjectService } from './project.service'
import { DatabaseService } from 'database'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { ProjectStatus } from '@repo/prisma'

describe('ProjectService', () => {
	let service: ProjectService
	let prisma: jest.Mocked<DatabaseService>
	let auditLog: jest.Mocked<AuditLogService>

	const mockProject = {
		id: 'proj-123',
		slug: 'antigravity',
		title: 'Antigravity Platform',
		subtitle: 'AI-First Monorepo',
		category: 'Full-Stack',
		projectType: 'Commercial',
		featured: true,
		status: ProjectStatus.COMPLETED,
		shortDescription: 'Modern monorepo platform',
		descriptions: ['Detailed description'],
		caseStudy: null,
		tags: ['Next.js', 'NestJS'],
		technologies: ['TypeScript', 'Prisma'],
		metrics: { stars: 100 },
		startDate: null,
		endDate: null,
		github: 'https://github.com/kp',
		liveUrl: 'https://koushikpuppala.com',
		thumbnailId: null,
		heroImageId: null,
		sortOrder: 0,
		isPublished: true,
		publishedAt: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		thumbnail: null,
		heroImage: null,
		gallery: [],
	}

	beforeEach(async () => {
		prisma = {
			project: {
				findFirst: jest.fn(),
				findUnique: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn(),
				create: jest.fn(),
				update: jest.fn(),
			},
			projectGallery: {
				findUnique: jest.fn(),
				upsert: jest.fn(),
				update: jest.fn(),
				delete: jest.fn(),
			},
		} as unknown as jest.Mocked<DatabaseService>

		auditLog = {
			create: jest.fn().mockResolvedValue(undefined),
			log: jest.fn().mockResolvedValue(undefined),
		} as unknown as jest.Mocked<AuditLogService>

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProjectService,
				{ provide: DatabaseService, useValue: prisma },
				{ provide: AuditLogService, useValue: auditLog },
			],
		}).compile()

		service = module.get<ProjectService>(ProjectService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('getPublished', () => {
		it('should return published projects', async () => {
			;(prisma.project.findMany as jest.Mock).mockResolvedValue([mockProject])

			const result = await service.getPublished({ category: 'Full-Stack', featured: true })
			expect(result).toEqual([mockProject])
			expect(prisma.project.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						isPublished: true,
						deletedAt: null,
						category: 'Full-Stack',
						featured: true,
					}),
				}),
			)
		})
	})

	describe('getBySlug', () => {
		it('should return project if exists', async () => {
			;(prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject)

			const result = await service.getBySlug('antigravity')
			expect(result).toEqual(mockProject)
		})

		it('should throw NotFoundException if slug not found', async () => {
			;(prisma.project.findFirst as jest.Mock).mockResolvedValue(null)

			await expect(service.getBySlug('non-existent')).rejects.toThrow(NotFoundException)
		})
	})

	describe('create', () => {
		it('should create a project and write audit log', async () => {
			;(prisma.project.findUnique as jest.Mock).mockResolvedValue(null)
			;(prisma.project.create as jest.Mock).mockResolvedValue(mockProject)

			const result = await service.create({
				slug: 'antigravity',
				title: 'Antigravity Platform',
				category: 'Full-Stack',
				shortDescription: 'Modern monorepo platform',
				descriptions: ['Detailed description'],
			})

			expect(result).toEqual(mockProject)
			expect(auditLog.create).toHaveBeenCalled()
		})

		it('should throw ConflictException if slug exists', async () => {
			;(prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject)

			await expect(
				service.create({
					slug: 'antigravity',
					title: 'Antigravity Platform',
					category: 'Full-Stack',
					shortDescription: 'Modern monorepo platform',
					descriptions: ['Detailed description'],
				}),
			).rejects.toThrow(ConflictException)
		})
	})

	describe('togglePublish', () => {
		it('should toggle publish state and record audit log', async () => {
			;(prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject)
			;(prisma.project.update as jest.Mock).mockResolvedValue({
				...mockProject,
				isPublished: false,
			})

			const result = await service.togglePublish('proj-123')
			expect(result.isPublished).toBe(false)
			expect(auditLog.create).toHaveBeenCalled()
		})
	})

	describe('remove', () => {
		it('should soft delete project', async () => {
			;(prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject)
			;(prisma.project.update as jest.Mock).mockResolvedValue({
				...mockProject,
				deletedAt: new Date(),
			})

			const result = await service.remove('proj-123')
			expect(result).toEqual({ id: 'proj-123', deleted: true })
			expect(auditLog.create).toHaveBeenCalled()
		})
	})
})
