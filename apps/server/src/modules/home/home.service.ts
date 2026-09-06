import { DatabaseService } from 'database'
import { Injectable } from '@nestjs/common'
import { AuditAction, Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { CreateHomeDto, QueryHomeDto, UpdateHomeDto } from './home.dto'

@Injectable()
export class HomeService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished() {
		const home = await this.prisma.home.findFirst({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
			include: {
				profileImage: {
					select: {
						id: true,
						url: true,
						fileName: true,
						mimeType: true,
						altText: true,
						width: true,
						height: true,
					},
				},
			},
		})

		return home
	}

	async adminFindAll(query: QueryHomeDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.HomeWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ content: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.home.findMany({
				where,
				skip,
				take,
				orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
				include: {
					profileImage: { select: { id: true, url: true, fileName: true, altText: true } },
				},
			}),
			this.prisma.home.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const home = await this.prisma.home.findFirst({
			where: { id, deletedAt: null },
			include: { profileImage: true },
		})

		return this.ensureExists(home, 'Home record not found')
	}

	async create(dto: CreateHomeDto, actor = 'admin') {
		const home = await this.prisma.home.create({
			data: {
				title: dto.title,
				separator: dto.separator ?? '|',
				subtitles: dto.subtitles,
				content: dto.content,
				ctaLabel: dto.ctaLabel ?? 'View Projects',
				ctaUrl: dto.ctaUrl ?? '/projects',
				secondaryCtaLabel: dto.secondaryCtaLabel,
				secondaryCtaUrl: dto.secondaryCtaUrl,
				stats: dto.stats as Prisma.InputJsonValue | undefined,
				featuredSkills: dto.featuredSkills ?? [],
				profileImageId: dto.profileImageId,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { profileImage: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Home',
			entityId: home.id,
			actor,
			newData: home as unknown as Record<string, unknown>,
		})

		return home
	}

	async update(id: string, dto: UpdateHomeDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const home = await this.prisma.home.update({
			where: { id },
			data: {
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.separator !== undefined && { separator: dto.separator }),
				...(dto.subtitles !== undefined && { subtitles: dto.subtitles }),
				...(dto.content !== undefined && { content: dto.content }),
				...(dto.ctaLabel !== undefined && { ctaLabel: dto.ctaLabel }),
				...(dto.ctaUrl !== undefined && { ctaUrl: dto.ctaUrl }),
				...(dto.secondaryCtaLabel !== undefined && { secondaryCtaLabel: dto.secondaryCtaLabel }),
				...(dto.secondaryCtaUrl !== undefined && { secondaryCtaUrl: dto.secondaryCtaUrl }),
				...(dto.stats !== undefined && { stats: dto.stats as Prisma.InputJsonValue }),
				...(dto.featuredSkills !== undefined && { featuredSkills: dto.featuredSkills }),
				...(dto.profileImageId !== undefined && { profileImageId: dto.profileImageId }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? (existing.publishedAt ?? new Date()) : null,
				}),
			},
			include: { profileImage: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Home',
			entityId: home.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: home as unknown as Record<string, unknown>,
		})

		return home
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const home = await this.prisma.home.update({
			where: { id },
			data: { isPublished: nextState, publishedAt: nextState ? new Date() : null },
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Home',
			entityId: home.id,
			actor,
			newData: { isPublished: nextState },
		})

		return home
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.home.update({ where: { id }, data: { deletedAt: new Date() } })

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Home',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
