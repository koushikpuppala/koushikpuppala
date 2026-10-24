import { DatabaseService } from 'database'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateAboutDto, QueryAboutDto, UpdateAboutDto } from './about.dto'

const ENTITY = 'About'

@Injectable()
export class AboutService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
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
				...dto,
				highlights: dto.highlights ?? [],
				skills: dto.skills ?? [],
				...this.jsonFields(dto),
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? false),
			},
			include: { profileImage: true },
		})

		return this.audit.created(ENTITY, actor, about)
	}

	async update(id: string, dto: UpdateAboutDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const about = await this.prisma.about.update({
			where: { id },
			data: {
				...dto,
				...this.jsonFields(dto),
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
			include: { profileImage: true },
		})

		return this.audit.updated(ENTITY, actor, existing, about)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.about.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.about.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}

	private jsonFields(dto: UpdateAboutDto) {
		return {
			stats: dto.stats as Prisma.InputJsonValue | undefined,
			values: dto.values as Prisma.InputJsonValue | undefined,
			pillars: dto.pillars as Prisma.InputJsonValue | undefined,
		}
	}
}
