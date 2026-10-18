import { DatabaseService } from 'database'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateSkillDto, QuerySkillDto, UpdateSkillDto } from './skill.dto'

const ENTITY = 'Skill'

@Injectable()
export class SkillService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
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
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [
					{ category: 'asc' },
					{ sortOrder: 'asc' },
				]),
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
				...dto,
				featured: dto.featured ?? false,
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? true),
			},
			include: { media: true },
		})

		return this.audit.created(ENTITY, actor, skill)
	}

	async update(id: string, dto: UpdateSkillDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const skill = await this.prisma.skill.update({
			where: { id },
			data: { ...dto, ...publishUpdate(dto.isPublished, existing.publishedAt) },
			include: { media: true },
		})

		return this.audit.updated(ENTITY, actor, existing, skill)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.skill.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.skill.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}
}
