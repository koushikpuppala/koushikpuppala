import { DatabaseService } from 'database'
import { Prisma } from '@repo/prisma'
import type { StorageService } from 'types/server'
import { STORAGE_SERVICE } from 'common/storage/storage.token'
import { BaseService } from 'common/services/base-cms.service'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateResumeDto, QueryResumeDto, UpdateResumeDto } from './resume.dto'

const ENTITY = 'Resume'

@Injectable()
export class ResumeService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
		@Inject(STORAGE_SERVICE) private readonly storage: StorageService,
	) {
		super()
	}

	async getLatest() {
		const resume = await this.prisma.resume.findFirst({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
			include: {
				media: {
					select: {
						id: true,
						fileName: true,
						originalName: true,
						size: true,
						mimeType: true,
						url: true,
						storageKey: true,
					},
				},
			},
		})

		if (!resume) throw new NotFoundException('No active resume published')

		let downloadUrl = resume.media.url

		// Fall back to a short-lived signed URL when the file has no public CDN URL.
		if (!downloadUrl && resume.media.storageKey) {
			try {
				downloadUrl = await this.storage.getSignedUrl(resume.media.storageKey)
			} catch {}
		}

		return { ...resume, downloadUrl }
	}

	async trackDownloadAndGetUrl() {
		const resume = await this.prisma.resume.findFirst({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
			include: { media: true },
		})

		if (!resume) throw new NotFoundException('No active resume available for download')

		await this.prisma.resume.update({
			where: { id: resume.id },
			data: { downloads: { increment: 1 } },
		})

		let downloadUrl = resume.media.url

		if (!downloadUrl && resume.media.storageKey) {
			try {
				downloadUrl = await this.storage.getSignedUrl(resume.media.storageKey)
			} catch {}
		}

		return { ...resume, downloads: resume.downloads + 1, downloadUrl }
	}

	async adminFindAll(query: QueryResumeDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.ResumeWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ versionName: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.resume.findMany({
				where,
				skip,
				take,
				orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
				include: { media: true },
			}),
			this.prisma.resume.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const resume = await this.prisma.resume.findFirst({
			where: { id, deletedAt: null },
			include: { media: true },
		})

		return this.ensureExists(resume, 'Resume record not found')
	}

	async create(dto: CreateResumeDto, actor = 'admin') {
		const media = await this.prisma.media.findUnique({ where: { id: dto.mediaId } })

		if (!media) throw new NotFoundException('Specified Media document does not exist')

		const resume = await this.prisma.resume.create({
			data: {
				...dto,
				...this.jsonFields(dto),
				competencies: dto.competencies ?? [],
				fileSize: dto.fileSize ?? media.size,
				fileType: dto.fileType ?? media.mimeType,
				sortOrder: dto.sortOrder ?? 0,
				...publishFields(dto.isPublished ?? false),
			},
			include: { media: true },
		})

		return this.audit.created(ENTITY, actor, resume)
	}

	async update(id: string, dto: UpdateResumeDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const resume = await this.prisma.resume.update({
			where: { id },
			data: {
				...dto,
				...this.jsonFields(dto),
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
			include: { media: true },
		})

		return this.audit.updated(ENTITY, actor, existing, resume)
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.togglePublish(ENTITY, actor, existing, data =>
			this.prisma.resume.update({ where: { id }, data }),
		)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.resume.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}

	private jsonFields(dto: UpdateResumeDto) {
		return {
			highlights: dto.highlights as Prisma.InputJsonValue | undefined,
			stats: dto.stats as Prisma.InputJsonValue | undefined,
		}
	}
}
