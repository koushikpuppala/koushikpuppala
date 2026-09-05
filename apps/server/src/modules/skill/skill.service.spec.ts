import { Test, TestingModule } from '@nestjs/testing'
import { SkillService } from './skill.service'
import { DatabaseService } from 'database'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { NotFoundException } from '@nestjs/common'

describe('SkillService', () => {
	let service: SkillService
	let prisma: jest.Mocked<DatabaseService>
	let auditLog: jest.Mocked<AuditLogService>

	const mockSkill = {
		id: 'skill-1',
		name: 'TypeScript',
		category: 'Languages',
		description: 'Typed superset of JavaScript',
		proficiency: 95,
		icon: 'si-typescript',
		mediaId: null,
		featured: true,
		sortOrder: 1,
		isPublished: true,
		publishedAt: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		media: null,
	}

	beforeEach(async () => {
		prisma = {
			skill: {
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
				SkillService,
				{ provide: DatabaseService, useValue: prisma },
				{ provide: AuditLogService, useValue: auditLog },
			],
		}).compile()

		service = module.get<SkillService>(SkillService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('getPublished', () => {
		it('should return published skills by category', async () => {
			;(prisma.skill.findMany as jest.Mock).mockResolvedValue([mockSkill])

			const result = await service.getPublished('Languages')
			expect(result).toEqual([mockSkill])
			expect(prisma.skill.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { isPublished: true, deletedAt: null, category: 'Languages' },
				}),
			)
		})
	})

	describe('findOne', () => {
		it('should return skill if exists', async () => {
			;(prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill)

			const result = await service.findOne('skill-1')
			expect(result).toEqual(mockSkill)
		})

		it('should throw NotFoundException if not found', async () => {
			;(prisma.skill.findFirst as jest.Mock).mockResolvedValue(null)

			await expect(service.findOne('skill-99')).rejects.toThrow(NotFoundException)
		})
	})

	describe('create', () => {
		it('should create skill and record audit log', async () => {
			;(prisma.skill.create as jest.Mock).mockResolvedValue(mockSkill)

			const result = await service.create({
				name: 'TypeScript',
				category: 'Languages',
				proficiency: 95,
			})

			expect(result).toEqual(mockSkill)
			expect(auditLog.create).toHaveBeenCalled()
		})
	})

	describe('togglePublish', () => {
		it('should toggle publish state', async () => {
			;(prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill)
			;(prisma.skill.update as jest.Mock).mockResolvedValue({
				...mockSkill,
				isPublished: false,
			})

			const result = await service.togglePublish('skill-1')
			expect(result.isPublished).toBe(false)
			expect(auditLog.create).toHaveBeenCalled()
		})
	})

	describe('remove', () => {
		it('should soft delete skill', async () => {
			;(prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill)
			;(prisma.skill.update as jest.Mock).mockResolvedValue({
				...mockSkill,
				deletedAt: new Date(),
			})

			const result = await service.remove('skill-1')
			expect(result).toEqual({ id: 'skill-1', deleted: true })
			expect(auditLog.create).toHaveBeenCalled()
		})
	})
})
