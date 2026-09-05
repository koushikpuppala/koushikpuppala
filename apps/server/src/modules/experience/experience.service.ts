import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseCmsService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, Prisma } from '@repo/prisma'
import { CreateExperienceDto, QueryExperienceDto, UpdateExperienceDto } from './experience.dto'

@Injectable()
export class ExperienceService extends BaseCmsService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished() {
		const items = await this.prisma.experience.findMany({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
			include: {
				logo: {
					select: { id: true, url: true, fileName: true, altText: true },
				},
			},
		})

		return items
	}

	async adminFindAll(query: QueryExperienceDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.ExperienceWhereInput = { deletedAt: null }

		if (query.search) {
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ company: { contains: query.search, mode: 'insensitive' } },
				{ location: { contains: query.search, mode: 'insensitive' } },
			]
		}

		if (query.employmentType) {
			where.employmentType = query.employmentType
		}

		if (query.featured !== undefined) {
			where.featured = query.featured
		}

		if (query.isPublished !== undefined) {
			where.isPublished = query.isPublished
		}

		const [items, total] = await Promise.all([
			this.prisma.experience.findMany({
				where,
				skip,
				take,
				orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
				include: { logo: true },
			}),
			this.prisma.experience.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const item = await this.prisma.experience.findFirst({
			where: { id, deletedAt: null },
			include: { logo: true },
		})

		return this.ensureExists(item, 'Experience not found')
	}

	async create(dto: CreateExperienceDto, actor = 'admin') {
		const experience = await this.prisma.experience.create({
			data: {
				title: dto.title,
				company: dto.company,
				location: dto.location,
				employmentType: dto.employmentType,
				startDate: new Date(dto.startDate),
				endDate: dto.endDate ? new Date(dto.endDate) : null,
				isCurrent: dto.isCurrent ?? false,
				featured: dto.featured ?? false,
				description: dto.description,
				achievements: dto.achievements ?? [],
				technologies: dto.technologies ?? [],
				website: dto.website,
				logoId: dto.logoId,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { logo: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Experience',
			entityId: experience.id,
			actor,
			newData: experience as unknown as Record<string, unknown>,
		})

		return experience
	}

	async update(id: string, dto: UpdateExperienceDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const experience = await this.prisma.experience.update({
			where: { id },
			data: {
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.company !== undefined && { company: dto.company }),
				...(dto.location !== undefined && { location: dto.location }),
				...(dto.employmentType !== undefined && { employmentType: dto.employmentType }),
				...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
				...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
				...(dto.isCurrent !== undefined && { isCurrent: dto.isCurrent }),
				...(dto.featured !== undefined && { featured: dto.featured }),
				...(dto.description !== undefined && { description: dto.description }),
				...(dto.achievements !== undefined && { achievements: dto.achievements }),
				...(dto.technologies !== undefined && { technologies: dto.technologies }),
				...(dto.website !== undefined && { website: dto.website }),
				...(dto.logoId !== undefined && { logoId: dto.logoId }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? existing.publishedAt ?? new Date() : null,
				}),
			},
			include: { logo: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Experience',
			entityId: experience.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: experience as unknown as Record<string, unknown>,
		})

		return experience
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const experience = await this.prisma.experience.update({
			where: { id },
			data: {
				isPublished: nextState,
				publishedAt: nextState ? new Date() : null,
			},
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Experience',
			entityId: experience.id,
			actor,
			newData: { isPublished: nextState },
		})

		return experience
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.experience.update({
			where: { id },
			data: { deletedAt: new Date() },
		})

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Experience',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
