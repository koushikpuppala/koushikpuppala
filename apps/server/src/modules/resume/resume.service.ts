import { DatabaseService } from 'database'
import { Prisma } from '@repo/prisma'
import type { ResumeDownload } from 'types/api'
import type { ResumeNaming, StorageService } from 'types/server'
import { STORAGE_SERVICE } from 'common/storage/storage.token'
import { BaseService } from 'common/services/base-cms.service'
import { LoggerService } from 'common/logger/logger.service'
import { publishFields, publishUpdate } from 'common/utils/publish.util'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { MediaService } from 'modules/media/media.service'
import { CreateResumeDto, QueryResumeDto, UpdateResumeDto } from './resume.dto'
import { resumeFileName } from './resume-file-name'
import { DOWNLOAD_LINK_SECONDS, RESUME_MAX_BYTES, RESUME_MIME_TYPE } from './resume.constants'

const ENTITY = 'Resume'

const LIVE_RESUME = {
	where: { isPublished: true, deletedAt: null },
	orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
} satisfies Prisma.ResumeFindFirstArgs

const withFileName = <T extends ResumeNaming>(resume: T) => ({
	...resume,
	downloadFileName: resumeFileName(resume.title, resume.versionName),
})

@Injectable()
export class ResumeService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
		private readonly media: MediaService,
		private readonly logger: LoggerService,
		@Inject(STORAGE_SERVICE) private readonly storage: StorageService,
	) {
		super()
	}

	async getLatest() {
		const resume = await this.prisma.resume.findFirst({
			...LIVE_RESUME,
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

		// The public site only checks whether this is set; visitors always download through
		// /resume/download, which counts the download.
		return withFileName({ ...resume, downloadUrl })
	}

	async download(): Promise<ResumeDownload> {
		const resume = await this.prisma.resume.findFirst({ ...LIVE_RESUME, include: { media: true } })

		if (!resume) throw new NotFoundException('No active resume available for download')

		const fileName = resumeFileName(resume.title, resume.versionName)

		let url: string

		try {
			url = await this.storage.getSignedUrl(resume.media.storageKey, DOWNLOAD_LINK_SECONDS, {
				fileName,
				contentType: RESUME_MIME_TYPE,
			})
		} catch (error) {
			this.logger.error(
				'Resume file is missing from storage',
				ResumeService.name,
				error instanceof Error ? error : new Error(String(error)),
				{ resumeId: resume.id, storageKey: resume.media.storageKey },
			)

			throw new NotFoundException('The resume file is not available')
		}

		// Counted only once a link exists, so a missing file never inflates the number.
		await this.prisma.resume.update({
			where: { id: resume.id },
			data: { downloads: { increment: 1 } },
		})

		return { url, fileName }
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
				orderBy: LIVE_RESUME.orderBy,
				include: { media: true },
			}),
			this.prisma.resume.count({ where }),
		])

		return {
			items: items.map(withFileName),
			pagination: this.getPaginationMeta(page, limit, total),
		}
	}

	async findOne(id: string) {
		const resume = await this.prisma.resume.findFirst({
			where: { id, deletedAt: null },
			include: { media: true },
		})

		return withFileName(this.ensureExists(resume, 'Resume record not found'))
	}

	async create(dto: CreateResumeDto, actor = 'admin') {
		const media = await this.assertResumeMedia(dto.mediaId)

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

		return withFileName(await this.audit.created(ENTITY, actor, resume))
	}

	async update(id: string, dto: UpdateResumeDto, actor = 'admin') {
		const existing = await this.findOne(id)

		if (dto.mediaId) await this.assertResumeMedia(dto.mediaId)

		const resume = await this.prisma.resume.update({
			where: { id },
			data: {
				...dto,
				...this.jsonFields(dto),
				...publishUpdate(dto.isPublished, existing.publishedAt),
			},
			include: { media: true },
		})

		const saved = await this.audit.updated(ENTITY, actor, existing, resume)

		if (dto.mediaId && dto.mediaId !== existing.mediaId)
			await this.removeReplacedMedia(existing.mediaId, actor)

		return withFileName(saved)
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

	private async assertResumeMedia(mediaId: string) {
		const media = await this.prisma.media.findUnique({ where: { id: mediaId } })

		if (!media) throw new NotFoundException('Specified Media document does not exist')

		if (media.deletedAt) throw new BadRequestException('The selected file has been deleted.')

		if (media.mimeType !== RESUME_MIME_TYPE)
			throw new BadRequestException('The resume must be a PDF document.')

		if (media.size > RESUME_MAX_BYTES)
			throw new BadRequestException('The resume PDF must be 10 MB or smaller.')

		return media
	}

	// Runs after the update has committed. A failed cleanup only leaves an unused file behind,
	// so it is logged and never fails the save.
	private async removeReplacedMedia(mediaId: string, actor: string) {
		try {
			await this.media.remove(mediaId, actor)
		} catch (error) {
			this.logger.error(
				'Failed to remove the replaced resume file',
				ResumeService.name,
				error instanceof Error ? error : new Error(String(error)),
				{ mediaId },
			)
		}
	}

	private jsonFields(dto: UpdateResumeDto) {
		return {
			highlights: dto.highlights as Prisma.InputJsonValue | undefined,
			stats: dto.stats as Prisma.InputJsonValue | undefined,
		}
	}
}
