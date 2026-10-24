import type { PublishedProjectQuery } from 'types/api'

import {
	AddGalleryMediaDto,
	CreateProjectDto,
	QueryProjectDto,
	UpdateGalleryMediaDto,
	UpdateProjectDto,
} from './project.dto'
import { DatabaseService } from 'database'
import { BaseService } from 'common/services/base-cms.service'
import { AuditAction, Prisma, ProjectStatus } from '@repo/prisma'
import { toDate } from 'common/utils/date.util'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

const ENTITY = 'Project'
const GALLERY = 'ProjectGallery'

// Public responses carry only what the site renders, never the bucket, storage key or uploader.
const PUBLIC_MEDIA = {
	select: { id: true, url: true, fileName: true, altText: true, width: true, height: true },
} satisfies Prisma.MediaDefaultArgs

@Injectable()
export class ProjectService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished(query?: PublishedProjectQuery) {
		const where: Prisma.ProjectWhereInput = { isPublished: true, deletedAt: null }

		if (query?.category) where.category = query.category

		if (query?.featured !== undefined) where.featured = query.featured

		const items = await this.prisma.project.findMany({
			where,
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
			select: {
				id: true,
				slug: true,
				title: true,
				subtitle: true,
				category: true,
				projectType: true,
				featured: true,
				status: true,
				shortDescription: true,
				tags: true,
				technologies: true,
				metrics: true,
				liveUrl: true,
				github: true,
				sortOrder: true,
				thumbnail: PUBLIC_MEDIA,
				createdAt: true,
			},
		})

		return items
	}

	async getBySlug(slug: string) {
		const project = await this.prisma.project.findFirst({
			where: { slug, isPublished: true, deletedAt: null },
			include: {
				thumbnail: PUBLIC_MEDIA,
				heroImage: PUBLIC_MEDIA,
				gallery: {
					where: { isVisible: true, media: { deletedAt: null } },
					orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
					include: { media: PUBLIC_MEDIA },
				},
			},
		})

		return this.ensureExists(project, `Project '${slug}' not found`)
	}

	async adminFindAll(query: QueryProjectDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.ProjectWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ subtitle: { contains: query.search, mode: 'insensitive' } },
				{ slug: { contains: query.search, mode: 'insensitive' } },
				{ category: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.category) where.category = query.category

		if (query.status) where.status = query.status

		if (query.featured !== undefined) where.featured = query.featured

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.project.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [
					{ sortOrder: 'asc' },
					{ createdAt: 'desc' },
				]),
				include: {
					thumbnail: { select: { id: true, url: true, fileName: true, altText: true } },
					_count: { select: { gallery: true } },
				},
			}),
			this.prisma.project.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const project = await this.prisma.project.findFirst({
			where: { id, deletedAt: null },
			include: {
				thumbnail: true,
				heroImage: true,
				gallery: {
					orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
					include: { media: true },
				},
			},
		})

		return this.ensureExists(project, 'Project not found')
	}

	async create(dto: CreateProjectDto, actor = 'admin') {
		await this.assertSlugFree(dto.slug)

		const project = await this.prisma.project.create({
			data: {
				...dto,
				featured: dto.featured ?? false,
				status: dto.status ?? ProjectStatus.COMPLETED,
				tags: dto.tags ?? [],
				technologies: dto.technologies ?? [],
				metrics: dto.metrics as Prisma.InputJsonValue | undefined,
				startDate: toDate(dto.startDate),
				endDate: toDate(dto.endDate),
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? false),
			},
			include: { thumbnail: true, heroImage: true },
		})

		return this.audit.created(ENTITY, actor, project)
	}

	async update(id: string, dto: UpdateProjectDto, actor = 'admin') {
		const existing = await this.findOne(id)

		if (dto.slug && dto.slug !== existing.slug) await this.assertSlugFree(dto.slug)

		const project = await this.prisma.project.update({
			where: { id },
			data: {
				...dto,
				metrics: dto.metrics as Prisma.InputJsonValue | undefined,
				startDate: toDate(dto.startDate),
				endDate: toDate(dto.endDate),
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
			include: { thumbnail: true, heroImage: true },
		})

		return this.audit.updated(ENTITY, actor, existing, project)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.project.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.project.update({
				where: { id },
				// Free up the unique slug so a new project can reuse it.
				data: { deletedAt: new Date(), slug: `${existing.slug}--deleted-${Date.now()}` },
			}),
		)
	}

	async addGalleryMedia(projectId: string, dto: AddGalleryMediaDto, actor = 'admin') {
		await this.findOne(projectId)

		const fields = {
			title: dto.title,
			description: dto.description,
			caption: dto.caption,
			altText: dto.altText,
			isFeatured: dto.isFeatured ?? false,
			isVisible: dto.isVisible ?? true,
			sortOrder: dto.sortOrder ?? 0,
		}

		// Adding media that is already in the gallery updates its fields instead of failing.
		const galleryItem = await this.prisma.projectGallery.upsert({
			where: { projectId_mediaId: { projectId, mediaId: dto.mediaId } },
			update: fields,
			create: { projectId, mediaId: dto.mediaId, ...fields },
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: GALLERY,
			entityId: `${projectId}:${dto.mediaId}`,
			actor,
			newData: galleryItem,
		})

		return galleryItem
	}

	async updateGalleryMedia(
		projectId: string,
		mediaId: string,
		dto: UpdateGalleryMediaDto,
		actor = 'admin',
	) {
		const existing = await this.findGalleryItem(projectId, mediaId)

		const updated = await this.prisma.projectGallery.update({
			where: { projectId_mediaId: { projectId, mediaId } },
			data: { ...dto },
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: GALLERY,
			entityId: `${projectId}:${mediaId}`,
			actor,
			oldData: existing,
			newData: updated,
		})

		return updated
	}

	async removeGalleryMedia(projectId: string, mediaId: string, actor = 'admin') {
		const existing = await this.findGalleryItem(projectId, mediaId)

		await this.prisma.projectGallery.delete({
			where: { projectId_mediaId: { projectId, mediaId } },
		})

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: GALLERY,
			entityId: `${projectId}:${mediaId}`,
			actor,
			oldData: existing,
		})

		return { projectId, mediaId, deleted: true }
	}

	private async assertSlugFree(slug: string): Promise<void> {
		const taken = await this.prisma.project.findUnique({ where: { slug } })

		if (taken) throw new ConflictException(`Project with slug '${slug}' already exists`)
	}

	private async findGalleryItem(projectId: string, mediaId: string) {
		const item = await this.prisma.projectGallery.findUnique({
			where: { projectId_mediaId: { projectId, mediaId } },
		})

		if (!item) throw new NotFoundException('Gallery media item not found')

		return item
	}
}
