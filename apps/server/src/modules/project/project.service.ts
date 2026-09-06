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
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ProjectService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished(query?: { category?: string; featured?: boolean }) {
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
				thumbnail: {
					select: { id: true, url: true, fileName: true, altText: true, width: true, height: true },
				},
				createdAt: true,
			},
		})

		return items
	}

	async getBySlug(slug: string) {
		const project = await this.prisma.project.findFirst({
			where: { slug, isPublished: true, deletedAt: null },
			include: {
				thumbnail: true,
				heroImage: true,
				gallery: {
					where: { isVisible: true },
					orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
					include: { media: true },
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
				orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
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
		const existing = await this.prisma.project.findUnique({
			where: { slug: dto.slug },
		})

		if (existing) throw new ConflictException(`Project with slug '${dto.slug}' already exists`)

		const project = await this.prisma.project.create({
			data: {
				slug: dto.slug,
				title: dto.title,
				subtitle: dto.subtitle,
				category: dto.category,
				projectType: dto.projectType,
				featured: dto.featured ?? false,
				status: dto.status ?? ProjectStatus.COMPLETED,
				shortDescription: dto.shortDescription,
				descriptions: dto.descriptions,
				caseStudy: dto.caseStudy,
				tags: dto.tags ?? [],
				technologies: dto.technologies ?? [],
				metrics: dto.metrics as Prisma.InputJsonValue | undefined,
				startDate: dto.startDate ? new Date(dto.startDate) : null,
				endDate: dto.endDate ? new Date(dto.endDate) : null,
				github: dto.github,
				liveUrl: dto.liveUrl,
				thumbnailId: dto.thumbnailId,
				heroImageId: dto.heroImageId,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { thumbnail: true, heroImage: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Project',
			entityId: project.id,
			actor,
			newData: project as unknown as Record<string, unknown>,
		})

		return project
	}

	async update(id: string, dto: UpdateProjectDto, actor = 'admin') {
		const existing = await this.findOne(id)

		if (dto.slug && dto.slug !== existing.slug) {
			const slugExists = await this.prisma.project.findUnique({
				where: { slug: dto.slug },
			})

			if (slugExists) throw new ConflictException(`Project with slug '${dto.slug}' already exists`)
		}

		const project = await this.prisma.project.update({
			where: { id },
			data: {
				...(dto.slug !== undefined && { slug: dto.slug }),
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
				...(dto.category !== undefined && { category: dto.category }),
				...(dto.projectType !== undefined && { projectType: dto.projectType }),
				...(dto.featured !== undefined && { featured: dto.featured }),
				...(dto.status !== undefined && { status: dto.status }),
				...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
				...(dto.descriptions !== undefined && { descriptions: dto.descriptions }),
				...(dto.caseStudy !== undefined && { caseStudy: dto.caseStudy }),
				...(dto.tags !== undefined && { tags: dto.tags }),
				...(dto.technologies !== undefined && { technologies: dto.technologies }),
				...(dto.metrics !== undefined && { metrics: dto.metrics as Prisma.InputJsonValue }),
				...(dto.startDate !== undefined && {
					startDate: dto.startDate ? new Date(dto.startDate) : null,
				}),
				...(dto.endDate !== undefined && {
					endDate: dto.endDate ? new Date(dto.endDate) : null,
				}),
				...(dto.github !== undefined && { github: dto.github }),
				...(dto.liveUrl !== undefined && { liveUrl: dto.liveUrl }),
				...(dto.thumbnailId !== undefined && { thumbnailId: dto.thumbnailId }),
				...(dto.heroImageId !== undefined && { heroImageId: dto.heroImageId }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? (existing.publishedAt ?? new Date()) : null,
				}),
			},
			include: { thumbnail: true, heroImage: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Project',
			entityId: project.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: project as unknown as Record<string, unknown>,
		})

		return project
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const project = await this.prisma.project.update({
			where: { id },
			data: { isPublished: nextState, publishedAt: nextState ? new Date() : null },
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Project',
			entityId: project.id,
			actor,
			newData: { isPublished: nextState },
		})

		return project
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } })

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Project',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}

	// --- Gallery Management ---
	async addGalleryMedia(projectId: string, dto: AddGalleryMediaDto, actor = 'admin') {
		await this.findOne(projectId)

		const galleryItem = await this.prisma.projectGallery.upsert({
			where: { projectId_mediaId: { projectId, mediaId: dto.mediaId } },
			update: {
				title: dto.title,
				description: dto.description,
				caption: dto.caption,
				altText: dto.altText,
				isFeatured: dto.isFeatured ?? false,
				isVisible: dto.isVisible ?? true,
				sortOrder: dto.sortOrder ?? 0,
			},
			create: {
				projectId,
				mediaId: dto.mediaId,
				title: dto.title,
				description: dto.description,
				caption: dto.caption,
				altText: dto.altText,
				isFeatured: dto.isFeatured ?? false,
				isVisible: dto.isVisible ?? true,
				sortOrder: dto.sortOrder ?? 0,
			},
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'ProjectGallery',
			entityId: `${projectId}:${dto.mediaId}`,
			actor,
			newData: galleryItem as unknown as Record<string, unknown>,
		})

		return galleryItem
	}

	async updateGalleryMedia(
		projectId: string,
		mediaId: string,
		dto: UpdateGalleryMediaDto,
		actor = 'admin',
	) {
		const existing = await this.prisma.projectGallery.findUnique({
			where: { projectId_mediaId: { projectId, mediaId } },
		})

		if (!existing) throw new NotFoundException('Gallery media item not found')

		const updated = await this.prisma.projectGallery.update({
			where: { projectId_mediaId: { projectId, mediaId } },
			data: {
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.description !== undefined && { description: dto.description }),
				...(dto.caption !== undefined && { caption: dto.caption }),
				...(dto.altText !== undefined && { altText: dto.altText }),
				...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
				...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
			},
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'ProjectGallery',
			entityId: `${projectId}:${mediaId}`,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: updated as unknown as Record<string, unknown>,
		})

		return updated
	}

	async removeGalleryMedia(projectId: string, mediaId: string, actor = 'admin') {
		const existing = await this.prisma.projectGallery.findUnique({
			where: { projectId_mediaId: { projectId, mediaId } },
		})

		if (!existing) throw new NotFoundException('Gallery media item not found')

		await this.prisma.projectGallery.delete({
			where: { projectId_mediaId: { projectId, mediaId } },
		})

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'ProjectGallery',
			entityId: `${projectId}:${mediaId}`,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { projectId, mediaId, deleted: true }
	}
}
