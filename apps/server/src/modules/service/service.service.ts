import { DatabaseService } from 'database'
import { Prisma } from '@repo/prisma'
import { Injectable } from '@nestjs/common'
import { BaseService } from 'common/services/base-cms.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { CreateServiceDto, QueryServiceDto, UpdateServiceDto } from './service.dto'

const ENTITY = 'Service'

@Injectable()
export class ServiceService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
	) {
		super()
	}

	async getPublished() {
		const items = await this.prisma.service.findMany({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
			include: { image: { select: { id: true, url: true, fileName: true, altText: true } } },
		})

		return items
	}

	async adminFindAll(query: QueryServiceDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.ServiceWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ description: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.service.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [
					{ sortOrder: 'asc' },
					{ createdAt: 'desc' },
				]),
				include: { image: true },
			}),
			this.prisma.service.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const service = await this.prisma.service.findFirst({
			where: { id, deletedAt: null },
			include: { image: true },
		})

		return this.ensureExists(service, 'Service not found')
	}

	async create(dto: CreateServiceDto, actor = 'admin') {
		const service = await this.prisma.service.create({
			data: {
				...dto,
				features: dto.features ?? [],
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? false),
			},
			include: { image: true },
		})

		return this.audit.created(ENTITY, actor, service)
	}

	async update(id: string, dto: UpdateServiceDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const service = await this.prisma.service.update({
			where: { id },
			data: { ...dto, ...publishUpdate(dto.isPublished, existing.publishedAt) },
			include: { image: true },
		})

		return this.audit.updated(ENTITY, actor, existing, service)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.service.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.service.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}
}
