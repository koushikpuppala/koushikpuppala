import { DatabaseService } from 'database'
import { AuditAction, Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { ConflictException, Injectable } from '@nestjs/common'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { CreateMetadataDto, QueryMetadataDto, UpdateMetadataDto } from './metadata.dto'

@Injectable()
export class MetadataService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublishedByKey(key: string) {
		const meta = await this.prisma.metadata.findFirst({
			where: { key, isPublished: true, deletedAt: null },
		})

		return this.ensureExists(meta, `Metadata for key '${key}' not found`)
	}

	async getAllPublished() {
		const items = await this.prisma.metadata.findMany({
			where: { isPublished: true, deletedAt: null },
			orderBy: { createdAt: 'asc' },
		})

		return items
	}

	async adminFindAll(query: QueryMetadataDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.MetadataWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ key: { contains: query.search, mode: 'insensitive' } },
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ description: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.type) where.type = query.type

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.metadata.findMany({
				where,
				skip,
				take,
				orderBy: { createdAt: 'desc' },
			}),
			this.prisma.metadata.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const meta = await this.prisma.metadata.findFirst({
			where: { id, deletedAt: null },
		})

		return this.ensureExists(meta, 'Metadata record not found')
	}

	async create(dto: CreateMetadataDto, actor = 'admin') {
		const existing = await this.prisma.metadata.findUnique({
			where: { key: dto.key },
		})

		if (existing) throw new ConflictException(`Metadata key '${dto.key}' already exists`)

		const metadata = await this.prisma.metadata.create({
			data: {
				type: dto.type,
				key: dto.key,
				value: dto.value as Prisma.InputJsonValue,
				title: dto.title,
				description: dto.description,
				ogImage: dto.ogImage,
				canonicalUrl: dto.canonicalUrl,
				robots: dto.robots ?? 'index,follow',
				keywords: dto.keywords ?? [],
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Metadata',
			entityId: metadata.id,
			actor,
			newData: metadata as unknown as Record<string, unknown>,
		})

		return metadata
	}

	async update(id: string, dto: UpdateMetadataDto, actor = 'admin') {
		const existing = await this.findOne(id)

		if (dto.key && dto.key !== existing.key) {
			const duplicate = await this.prisma.metadata.findUnique({
				where: { key: dto.key },
			})

			if (duplicate && duplicate.id !== id)
				throw new ConflictException(`Metadata key '${dto.key}' already exists`)
		}

		const metadata = await this.prisma.metadata.update({
			where: { id },
			data: {
				...(dto.type !== undefined && { type: dto.type }),
				...(dto.key !== undefined && { key: dto.key }),
				...(dto.value !== undefined && { value: dto.value as Prisma.InputJsonValue }),
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.description !== undefined && { description: dto.description }),
				...(dto.ogImage !== undefined && { ogImage: dto.ogImage }),
				...(dto.canonicalUrl !== undefined && { canonicalUrl: dto.canonicalUrl }),
				...(dto.robots !== undefined && { robots: dto.robots }),
				...(dto.keywords !== undefined && { keywords: dto.keywords }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? (existing.publishedAt ?? new Date()) : null,
				}),
			},
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Metadata',
			entityId: metadata.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: metadata as unknown as Record<string, unknown>,
		})

		return metadata
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const metadata = await this.prisma.metadata.update({
			where: { id },
			data: { isPublished: nextState, publishedAt: nextState ? new Date() : null },
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Metadata',
			entityId: metadata.id,
			actor,
			newData: { isPublished: nextState },
		})

		return metadata
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.metadata.update({ where: { id }, data: { deletedAt: new Date() } })

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Metadata',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
