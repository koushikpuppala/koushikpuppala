import { DatabaseService } from 'database'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateHomeDto, QueryHomeDto, UpdateHomeDto } from './home.dto'

const ENTITY = 'Home'

@Injectable()
export class HomeService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
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
				...dto,
				separator: dto.separator ?? '|',
				ctaLabel: dto.ctaLabel ?? 'View Projects',
				ctaUrl: dto.ctaUrl ?? '/projects',
				stats: dto.stats as Prisma.InputJsonValue | undefined,
				featuredSkills: dto.featuredSkills ?? [],
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? false),
			},
			include: { profileImage: true },
		})

		return this.audit.created(ENTITY, actor, home)
	}

	async update(id: string, dto: UpdateHomeDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const home = await this.prisma.home.update({
			where: { id },
			data: {
				...dto,
				stats: dto.stats as Prisma.InputJsonValue | undefined,
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
			include: { profileImage: true },
		})

		return this.audit.updated(ENTITY, actor, existing, home)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.home.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.home.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}
}
