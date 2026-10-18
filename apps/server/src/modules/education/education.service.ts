import { DatabaseService } from 'database'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { toDate } from 'common/utils/date.util'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateEducationDto, QueryEducationDto, UpdateEducationDto } from './education.dto'

const ENTITY = 'Education'

@Injectable()
export class EducationService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
	) {
		super()
	}

	async getPublished() {
		const items = await this.prisma.education.findMany({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
			include: { logo: { select: { id: true, url: true, fileName: true, altText: true } } },
		})

		return items
	}

	async adminFindAll(query: QueryEducationDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.EducationWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ degree: { contains: query.search, mode: 'insensitive' } },
				{ fieldOfStudy: { contains: query.search, mode: 'insensitive' } },
				{ university: { contains: query.search, mode: 'insensitive' } },
				{ location: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.education.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [
					{ sortOrder: 'asc' },
					{ startDate: 'desc' },
				]),
				include: { logo: true },
			}),
			this.prisma.education.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const item = await this.prisma.education.findFirst({
			where: { id, deletedAt: null },
			include: { logo: true },
		})

		return this.ensureExists(item, 'Education record not found')
	}

	async create(dto: CreateEducationDto, actor = 'admin') {
		this.assertDateRange(dto.startDate, dto.endDate)

		const education = await this.prisma.education.create({
			data: {
				...dto,
				achievements: dto.achievements ?? [],
				focusAreas: dto.focusAreas ?? [],
				startDate: new Date(dto.startDate),
				endDate: toDate(dto.endDate),
				expectedDate: toDate(dto.expectedDate),
				isCurrent: dto.isCurrent ?? false,
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? false),
			},
			include: { logo: true },
		})

		return this.audit.created(ENTITY, actor, education)
	}

	async update(id: string, dto: UpdateEducationDto, actor = 'admin') {
		const existing = await this.findOne(id)

		this.assertDateRange(
			dto.startDate ?? existing.startDate,
			dto.endDate !== undefined ? dto.endDate : existing.endDate,
		)

		const education = await this.prisma.education.update({
			where: { id },
			data: {
				...dto,
				startDate: toDate(dto.startDate) ?? undefined,
				endDate: toDate(dto.endDate),
				expectedDate: toDate(dto.expectedDate),
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
			include: { logo: true },
		})

		return this.audit.updated(ENTITY, actor, existing, education)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.education.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.education.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}
}
