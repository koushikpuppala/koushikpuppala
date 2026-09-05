import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseCmsService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, Prisma } from '@repo/prisma'
import { CreateResumeDto, QueryResumeDto, UpdateResumeDto } from './resume.dto'
import { S3Service } from 'common/storage/s3.service'

@Injectable()
export class ResumeService extends BaseCmsService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
		private readonly s3Service: S3Service,
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
		if (!downloadUrl && resume.media.storageKey) {
			try {
				downloadUrl = await this.s3Service.getSignedUrl(resume.media.storageKey)
			} catch {
				// Fallback to null if S3 not reached
			}
		}

		return {
			...resume,
			downloadUrl,
		}
	}

	async trackDownloadAndGetUrl() {
		const resume = await this.prisma.resume.findFirst({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
			include: { media: true },
		})

		if (!resume) throw new NotFoundException('No active resume available for download')

		// Increment download counter
		await this.prisma.resume.update({
			where: { id: resume.id },
			data: { downloads: { increment: 1 } },
		})

		let downloadUrl = resume.media.url
		if (!downloadUrl && resume.media.storageKey) {
			try {
				downloadUrl = await this.s3Service.getSignedUrl(resume.media.storageKey)
			} catch {
				// Fallback if needed
			}
		}

		return {
			id: resume.id,
			title: resume.title,
			downloads: resume.downloads + 1,
			downloadUrl,
		}
	}

	async adminFindAll(query: QueryResumeDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.ResumeWhereInput = { deletedAt: null }

		if (query.search) {
			where.OR = [
				{ title: { contains: query.search, mode: 'insensitive' } },
				{ versionName: { contains: query.search, mode: 'insensitive' } },
			]
		}

		if (query.isPublished !== undefined) {
			where.isPublished = query.isPublished
		}

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
		const media = await this.prisma.media.findUnique({
			where: { id: dto.mediaId },
		})

		if (!media) throw new NotFoundException('Specified Media document does not exist')

		const resume = await this.prisma.resume.create({
			data: {
				title: dto.title,
				versionName: dto.versionName,
				mediaId: dto.mediaId,
				fileSize: dto.fileSize ?? media.size,
				fileType: dto.fileType ?? media.mimeType,
				checksum: dto.checksum,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Resume',
			entityId: resume.id,
			actor,
			newData: resume as unknown as Record<string, unknown>,
		})

		return resume
	}

	async update(id: string, dto: UpdateResumeDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const resume = await this.prisma.resume.update({
			where: { id },
			data: {
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.versionName !== undefined && { versionName: dto.versionName }),
				...(dto.mediaId !== undefined && { mediaId: dto.mediaId }),
				...(dto.fileSize !== undefined && { fileSize: dto.fileSize }),
				...(dto.fileType !== undefined && { fileType: dto.fileType }),
				...(dto.checksum !== undefined && { checksum: dto.checksum }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? existing.publishedAt ?? new Date() : null,
				}),
			},
			include: { media: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Resume',
			entityId: resume.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: resume as unknown as Record<string, unknown>,
		})

		return resume
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const resume = await this.prisma.resume.update({
			where: { id },
			data: {
				isPublished: nextState,
				publishedAt: nextState ? new Date() : null,
			},
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Resume',
			entityId: resume.id,
			actor,
			newData: { isPublished: nextState },
		})

		return resume
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.resume.update({
			where: { id },
			data: { deletedAt: new Date() },
		})

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Resume',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
