import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseCmsService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, Prisma } from '@repo/prisma'
import { CreateServiceDto, QueryServiceDto, UpdateServiceDto } from './service.dto'

@Injectable()
export class ServiceService extends BaseCmsService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished() {
		const items = await this.prisma.service.findMany({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
			include: {
				image: {
					select: { id: true, url: true, fileName: true, altText: true },
				},
			},
		})

		return items
	}

	async adminFindAll(query: QueryServiceDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.ServiceWhereInput = { deletedAt: null }

		if (query.search) {
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ description: { contains: query.search, mode: 'insensitive' } },
			]
		}

		if (query.isPublished !== undefined) {
			where.isPublished = query.isPublished
		}

		const [items, total] = await Promise.all([
			this.prisma.service.findMany({
				where,
				skip,
				take,
				orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
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
				title: dto.title,
				description: dto.description,
				features: dto.features ?? [],
				imageId: dto.imageId,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { image: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Service',
			entityId: service.id,
			actor,
			newData: service as unknown as Record<string, unknown>,
		})

		return service
	}

	async update(id: string, dto: UpdateServiceDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const service = await this.prisma.service.update({
			where: { id },
			data: {
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.description !== undefined && { description: dto.description }),
				...(dto.features !== undefined && { features: dto.features }),
				...(dto.imageId !== undefined && { imageId: dto.imageId }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? existing.publishedAt ?? new Date() : null,
				}),
			},
			include: { image: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Service',
			entityId: service.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: service as unknown as Record<string, unknown>,
		})

		return service
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const service = await this.prisma.service.update({
			where: { id },
			data: {
				isPublished: nextState,
				publishedAt: nextState ? new Date() : null,
			},
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Service',
			entityId: service.id,
			actor,
			newData: { isPublished: nextState },
		})

		return service
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.service.update({
			where: { id },
			data: { deletedAt: new Date() },
		})

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Service',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
