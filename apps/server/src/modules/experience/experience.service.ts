import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { toDate } from 'common/utils/date.util'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateExperienceDto, QueryExperienceDto, UpdateExperienceDto } from './experience.dto'

const ENTITY = 'Experience'

@Injectable()
export class ExperienceService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
	) {
		super()
	}

	async getPublished() {
		const items = await this.prisma.experience.findMany({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
			include: { logo: { select: { id: true, url: true, fileName: true, altText: true } } },
		})

		return items
	}

	async adminFindAll(query: QueryExperienceDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.ExperienceWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ organization: { contains: query.search, mode: 'insensitive' } },
				{ location: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.employmentType) where.employmentType = query.employmentType

		if (query.featured !== undefined) where.featured = query.featured

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.experience.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [
					{ sortOrder: 'asc' },
					{ startDate: 'desc' },
				]),
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
		this.assertDateRange(dto.startDate, dto.endDate)

		const experience = await this.prisma.experience.create({
			data: {
				...dto,
				startDate: new Date(dto.startDate),
				endDate: toDate(dto.endDate),
				isCurrent: dto.isCurrent ?? false,
				featured: dto.featured ?? false,
				achievements: dto.achievements ?? [],
				technologies: dto.technologies ?? [],
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? false),
			},
			include: { logo: true },
		})

		return this.audit.created(ENTITY, actor, experience)
	}

	async update(id: string, dto: UpdateExperienceDto, actor = 'admin') {
		const existing = await this.findOne(id)

		this.assertDateRange(
			dto.startDate ?? existing.startDate,
			dto.endDate !== undefined ? dto.endDate : existing.endDate,
		)

		const experience = await this.prisma.experience.update({
			where: { id },
			data: {
				...dto,
				startDate: toDate(dto.startDate) ?? undefined,
				endDate: toDate(dto.endDate),
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
			include: { logo: true },
		})

		return this.audit.updated(ENTITY, actor, existing, experience)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.experience.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.experience.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}
}
