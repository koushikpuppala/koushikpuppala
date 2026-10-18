import { DatabaseService } from 'database'
import { Prisma } from '@repo/prisma'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { BaseService } from 'common/services/base-cms.service'
import { ConflictException, Injectable } from '@nestjs/common'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CacheService } from 'redis/cache.service'
import { CreateMetadataDto, QueryMetadataDto, UpdateMetadataDto } from './metadata.dto'

const ENTITY = 'Metadata'

@Injectable()
export class MetadataService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
		private readonly cache: CacheService,
	) {
		super()
	}

	// Gives every path one form ('/about', never 'about' or '/about/') so it matches the stored keys.
	normalizePath(pathname?: string): string {
		if (!pathname) return '/'

		let p = pathname.trim()

		if (!p.startsWith('/')) p = `/${p}`

		if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)

		return p
	}

	async getPublishedByPath(pathname: string) {
		const normalized = this.normalizePath(pathname)

		const cacheKey = `metadata:path:${normalized}`

		return this.cache.remember(cacheKey, 3600, async () => {
			let meta = await this.prisma.metadata.findFirst({
				where: { key: normalized, isPublished: true, deletedAt: null },
			})

			// Lookup order: exact path, the same key without a leading slash, the project detail
			// template for /projects/<slug>, and finally the site-wide default.
			if (!meta) {
				const strippedKey = normalized === '/' ? 'home' : normalized.slice(1)

				meta = await this.prisma.metadata.findFirst({
					where: { key: strippedKey, isPublished: true, deletedAt: null },
				})
			}

			if (!meta && normalized.startsWith('/projects/'))
				meta = await this.prisma.metadata.findFirst({
					where: {
						key: { in: ['/projects/[slug]', '/projects/:slug', 'projects/[slug]'] },
						isPublished: true,
						deletedAt: null,
					},
				})

			if (!meta)
				meta = await this.prisma.metadata.findFirst({
					where: {
						key: { in: ['/', 'home', 'global-seo', 'root', 'default'] },
						isPublished: true,
						deletedAt: null,
					},
				})

			return this.ensureExists(meta, `Metadata for path '${pathname}' not found`)
		})
	}

	async getAllPublished() {
		return this.cache.remember('metadata:all-published', 3600, async () => {
			return this.prisma.metadata.findMany({
				where: { isPublished: true, deletedAt: null },
				orderBy: { createdAt: 'asc' },
			})
		})
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

		if (query.key) where.key = { in: query.key }

		if (query.type) where.type = query.type

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.metadata.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [{ createdAt: 'desc' }]),
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
		await this.assertKeyFree(dto.key)

		const metadata = await this.prisma.metadata.create({
			data: {
				...dto,
				value: dto.value as Prisma.InputJsonValue,
				robots: dto.robots ?? 'index,follow',
				keywords: dto.keywords ?? [],
				...publishFields(dto.isPublished ?? false),
			},
		})

		return this.invalidate(await this.audit.created(ENTITY, actor, metadata))
	}

	async update(id: string, dto: UpdateMetadataDto, actor = 'admin') {
		const existing = await this.findOne(id)

		if (dto.key && dto.key !== existing.key) await this.assertKeyFree(dto.key, id)

		const metadata = await this.prisma.metadata.update({
			where: { id },
			data: {
				...dto,
				value: dto.value as Prisma.InputJsonValue | undefined,
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
		})

		return this.invalidate(await this.audit.updated(ENTITY, actor, existing, metadata))
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.invalidate(
			await this.audit.togglePublish(ENTITY, actor, existing, data =>
				this.prisma.metadata.update({ where: { id }, data }),
			),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.invalidate(
			await this.audit.softDeleted(ENTITY, actor, existing, () =>
				this.prisma.metadata.update({ where: { id }, data: { deletedAt: new Date() } }),
			),
		)
	}

	private async assertKeyFree(key: string, exceptId?: string): Promise<void> {
		const duplicate = await this.prisma.metadata.findUnique({ where: { key } })

		if (duplicate && duplicate.id !== exceptId)
			throw new ConflictException(`Metadata key '${key}' already exists`)
	}

	private async invalidate<T>(result: T): Promise<T> {
		// Any change can affect fallback results for other paths, so clear all cached metadata.
		await this.cache.forgetByPattern('metadata:*')

		return result
	}
}
