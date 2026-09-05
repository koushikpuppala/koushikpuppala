import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseCmsService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, Prisma } from '@repo/prisma'
import { CreateAboutDto, QueryAboutDto, UpdateAboutDto } from './about.dto'

@Injectable()
export class AboutService extends BaseCmsService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished() {
		const about = await this.prisma.about.findFirst({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
			include: {
				profileImage: {
					select: { id: true, url: true, fileName: true, altText: true, width: true, height: true },
				},
			},
		})

		return about
	}

	async adminFindAll(query: QueryAboutDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)

		const where: Prisma.AboutWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ content: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.about.findMany({
				where,
				skip,
				take,
				orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
				include: { profileImage: true },
			}),
			this.prisma.about.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const about = await this.prisma.about.findFirst({
			where: { id, deletedAt: null },
			include: { profileImage: true },
		})

		return this.ensureExists(about, 'About record not found')
	}

	async create(dto: CreateAboutDto, actor = 'admin') {
		const about = await this.prisma.about.create({
			data: {
				title: dto.title,
				content: dto.content,
				biography: dto.biography,
				profileImageId: dto.profileImageId,
				highlights: dto.highlights ?? [],
				skills: dto.skills ?? [],
				ctaLabel: dto.ctaLabel,
				ctaUrl: dto.ctaUrl,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { profileImage: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'About',
			entityId: about.id,
			actor,
			newData: about as unknown as Record<string, unknown>,
		})

		return about
	}

	async update(id: string, dto: UpdateAboutDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const about = await this.prisma.about.update({
			where: { id },
			data: {
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.content !== undefined && { content: dto.content }),
				...(dto.biography !== undefined && { biography: dto.biography }),
				...(dto.profileImageId !== undefined && { profileImageId: dto.profileImageId }),
				...(dto.highlights !== undefined && { highlights: dto.highlights }),
				...(dto.skills !== undefined && { skills: dto.skills }),
				...(dto.ctaLabel !== undefined && { ctaLabel: dto.ctaLabel }),
				...(dto.ctaUrl !== undefined && { ctaUrl: dto.ctaUrl }),
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
			entity: 'About',
			entityId: about.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: about as unknown as Record<string, unknown>,
		})

		return about
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const about = await this.prisma.about.update({
			where: { id },
			data: { isPublished: nextState, publishedAt: nextState ? new Date() : null },
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'About',
			entityId: about.id,
			actor,
			newData: { isPublished: nextState },
		})

		return about
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.about.update({
			where: { id },
			data: { deletedAt: new Date() },
		})

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'About',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
