import { DatabaseService } from 'database'
import { Injectable } from '@nestjs/common'
import { AuditAction, Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { CreateSkillDto, QuerySkillDto, UpdateSkillDto } from './skill.dto'

@Injectable()
export class SkillService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished(category?: string) {
		const where: Prisma.SkillWhereInput = { isPublished: true, deletedAt: null }

		if (category) where.category = category

		const items = await this.prisma.skill.findMany({
			where,
			orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
			include: { media: { select: { id: true, url: true, fileName: true, altText: true } } },
		})

		return items
	}

	async adminFindAll(query: QuerySkillDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.SkillWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } },
				{ category: { contains: query.search, mode: 'insensitive' } },
				{ description: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.category) where.category = query.category

		if (query.featured !== undefined) where.featured = query.featured

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.skill.findMany({
				where,
				skip,
				take,
				orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
				include: { media: true },
			}),
			this.prisma.skill.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const skill = await this.prisma.skill.findFirst({
			where: { id, deletedAt: null },
			include: { media: true },
		})

		return this.ensureExists(skill, 'Skill not found')
	}

	async create(dto: CreateSkillDto, actor = 'admin') {
		const skill = await this.prisma.skill.create({
			data: {
				name: dto.name,
				category: dto.category,
				description: dto.description,
				proficiency: dto.proficiency,
				icon: dto.icon,
				mediaId: dto.mediaId,
				featured: dto.featured ?? false,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? true,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Skill',
			entityId: skill.id,
			actor,
			newData: skill as unknown as Record<string, unknown>,
		})

		return skill
	}

	async update(id: string, dto: UpdateSkillDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const skill = await this.prisma.skill.update({
			where: { id },
			data: {
				...(dto.name !== undefined && { name: dto.name }),
				...(dto.category !== undefined && { category: dto.category }),
				...(dto.description !== undefined && { description: dto.description }),
				...(dto.proficiency !== undefined && { proficiency: dto.proficiency }),
				...(dto.icon !== undefined && { icon: dto.icon }),
				...(dto.mediaId !== undefined && { mediaId: dto.mediaId }),
				...(dto.featured !== undefined && { featured: dto.featured }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? (existing.publishedAt ?? new Date()) : null,
				}),
			},
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Skill',
			entityId: skill.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: skill as unknown as Record<string, unknown>,
		})

		return skill
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const skill = await this.prisma.skill.update({
			where: { id },
			data: { isPublished: nextState, publishedAt: nextState ? new Date() : null },
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Skill',
			entityId: skill.id,
			actor,
			newData: { isPublished: nextState },
		})

		return skill
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.skill.update({ where: { id }, data: { deletedAt: new Date() } })

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Skill',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
