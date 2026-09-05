import { ConflictException, Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseCmsService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, Prisma } from '@repo/prisma'
import { CreateSocialDto, QuerySocialDto, UpdateSocialDto } from './social.dto'

@Injectable()
export class SocialService extends BaseCmsService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getVisible() {
		const items = await this.prisma.social.findMany({
			where: { isVisible: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
		})

		return items
	}

	async adminFindAll(query: QuerySocialDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.SocialWhereInput = { deletedAt: null }

		if (query.platform) where.platform = query.platform
		if (query.featured !== undefined) where.featured = query.featured
		if (query.isVisible !== undefined) where.isVisible = query.isVisible

		const [items, total] = await Promise.all([
			this.prisma.social.findMany({
				where,
				skip,
				take,
				orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
			}),
			this.prisma.social.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const social = await this.prisma.social.findFirst({
			where: { id, deletedAt: null },
		})

		return this.ensureExists(social, 'Social link not found')
	}

	async create(dto: CreateSocialDto, actor = 'admin') {
		const existing = await this.prisma.social.findFirst({
			where: { platform: dto.platform, deletedAt: null },
		})

		if (existing)
			throw new ConflictException(`Social link for platform '${dto.platform}' already exists`)

		const social = await this.prisma.social.create({
			data: {
				platform: dto.platform,
				url: dto.url,
				label: dto.label,
				icon: dto.icon,
				featured: dto.featured ?? false,
				isVisible: dto.isVisible ?? true,
				sortOrder: dto.sortOrder ?? 0,
			},
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Social',
			entityId: social.id,
			actor,
			newData: social as unknown as Record<string, unknown>,
		})

		return social
	}

	async update(id: string, dto: UpdateSocialDto, actor = 'admin') {
		const existing = await this.findOne(id)

		if (dto.platform && dto.platform !== existing.platform) {
			const duplicate = await this.prisma.social.findFirst({
				where: { platform: dto.platform, deletedAt: null },
			})

			if (duplicate && duplicate.id !== id)
				throw new ConflictException(`Social link for platform '${dto.platform}' already exists`)
		}

		const social = await this.prisma.social.update({
			where: { id },
			data: {
				...(dto.platform !== undefined && { platform: dto.platform }),
				...(dto.url !== undefined && { url: dto.url }),
				...(dto.label !== undefined && { label: dto.label }),
				...(dto.icon !== undefined && { icon: dto.icon }),
				...(dto.featured !== undefined && { featured: dto.featured }),
				...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
			},
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Social',
			entityId: social.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: social as unknown as Record<string, unknown>,
		})

		return social
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.social.update({
			where: { id },
			data: { deletedAt: new Date() },
		})

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Social',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
