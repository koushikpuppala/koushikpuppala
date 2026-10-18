import { DatabaseService } from 'database'
import { Prisma, type SocialPlatform } from '@repo/prisma'
import { BaseService } from 'common/services/base-cms.service'
import { ConflictException, Injectable } from '@nestjs/common'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateSocialDto, QuerySocialDto, UpdateSocialDto } from './social.dto'

const ENTITY = 'Social'

@Injectable()
export class SocialService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
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

		if (query.search)
			where.OR = [
				{ label: { contains: query.search, mode: 'insensitive' } },
				{ handle: { contains: query.search, mode: 'insensitive' } },
				{ url: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.platform) where.platform = query.platform

		if (query.featured !== undefined) where.featured = query.featured

		if (query.isVisible !== undefined) where.isVisible = query.isVisible

		const [items, total] = await Promise.all([
			this.prisma.social.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [
					{ sortOrder: 'asc' },
					{ createdAt: 'asc' },
				]),
			}),
			this.prisma.social.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const social = await this.prisma.social.findFirst({ where: { id, deletedAt: null } })

		return this.ensureExists(social, 'Social link not found')
	}

	async create(dto: CreateSocialDto, actor = 'admin') {
		await this.assertPlatformFree(dto.platform)

		const social = await this.prisma.social.create({
			data: {
				...dto,
				featured: dto.featured ?? false,
				isVisible: dto.isVisible ?? true,
				sortOrder: dto.sortOrder ?? 0,
			},
		})

		return this.audit.created(ENTITY, actor, social)
	}

	async update(id: string, dto: UpdateSocialDto, actor = 'admin') {
		const existing = await this.findOne(id)

		if (dto.platform && dto.platform !== existing.platform)
			await this.assertPlatformFree(dto.platform, id)

		const social = await this.prisma.social.update({ where: { id }, data: { ...dto } })

		return this.audit.updated(ENTITY, actor, existing, social)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.social.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}

	private async assertPlatformFree(platform: SocialPlatform, exceptId?: string): Promise<void> {
		const duplicate = await this.prisma.social.findFirst({
			where: { platform, deletedAt: null, ...(exceptId && { id: { not: exceptId } }) },
		})

		if (duplicate)
			throw new ConflictException(`Social link for platform '${platform}' already exists`)
	}
}
