import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseCmsService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, Prisma } from '@repo/prisma'
import { Configuration } from 'config/configuration'
import { S3Service } from 'common/storage/s3.service'
import {
	CompleteMediaUploadDto,
	QueryMediaDto,
	RequestPresignedUploadDto,
	UpdateMediaDto,
} from './media.dto'

@Injectable()
export class MediaService extends BaseCmsService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
		private readonly s3Service: S3Service,
		private readonly config: Configuration,
	) {
		super()
	}

	async requestPresignedUpload(dto: RequestPresignedUploadDto) {
		const extension = extname(dto.originalName).toLowerCase() || '.bin'
		// Sanitize folder path: eliminate path traversal ('..') and illegal characters
		const folder =
			(dto.folder ?? 'general')
				.replace(/[^a-zA-Z0-9_\-/]/g, '')
				.replace(/\.{2,}/g, '')
				.replace(/^\/+|\/+$/g, '') || 'general'
		const fileId = randomUUID()
		const storageKey = `${folder}/${fileId}${extension}`

		let uploadUrl = ''
		try {
			uploadUrl = await this.s3Service.getPresignedUploadUrl(storageKey, dto.mimeType, 900)
		} catch {
			throw new BadRequestException(
				'Failed to generate upload URL. Please verify cloud storage configuration.',
			)
		}

		const cdnUrl = this.config.aws.cdnUrl || `${this.config.aws.s3Bucket}.s3.${this.config.aws.region}.amazonaws.com`
		const fileUrl = `https://${cdnUrl}/${storageKey}`

		return {
			uploadUrl,
			storageKey,
			url: fileUrl,
		}
	}

	async completeUpload(dto: CompleteMediaUploadDto, userId?: string, actor = 'admin') {
		const extension = extname(dto.originalName).toLowerCase().replace('.', '')
		const fileName = dto.storageKey.split('/').pop() ?? dto.originalName

		const cdnUrl = this.config.aws.cdnUrl || `${this.config.aws.s3Bucket}.s3.${this.config.aws.region}.amazonaws.com`
		const fileUrl = `https://${cdnUrl}/${dto.storageKey}`

		const media = await this.prisma.media.create({
			data: {
				type: dto.type,
				fileName,
				originalName: dto.originalName,
				size: dto.size,
				mimeType: dto.mimeType,
				extension,
				bucket: this.config.aws.s3Bucket || 'koushikpuppala-media',
				folder: dto.folder ?? null,
				storageKey: dto.storageKey,
				url: fileUrl,
				width: dto.width,
				height: dto.height,
				altText: dto.altText,
				caption: dto.caption,
				uploadedById: userId,
			},
		})

		await this.auditLog.create({
			action: AuditAction.UPLOAD,
			entity: 'Media',
			entityId: media.id,
			actor,
			newData: media as unknown as Record<string, unknown>,
		})

		return media
	}

	async adminFindAll(query: QueryMediaDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.MediaWhereInput = { deletedAt: null }

		if (query.search) {
			where.OR = [
				{ originalName: { contains: query.search, mode: 'insensitive' } },
				{ fileName: { contains: query.search, mode: 'insensitive' } },
				{ altText: { contains: query.search, mode: 'insensitive' } },
				{ caption: { contains: query.search, mode: 'insensitive' } },
			]
		}

		if (query.type) where.type = query.type
		if (query.folder) where.folder = query.folder

		const [items, total] = await Promise.all([
			this.prisma.media.findMany({
				where,
				skip,
				take,
				orderBy: { createdAt: 'desc' },
			}),
			this.prisma.media.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const media = await this.prisma.media.findFirst({
			where: { id, deletedAt: null },
		})

		return this.ensureExists(media, 'Media file not found')
	}

	async update(id: string, dto: UpdateMediaDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const media = await this.prisma.media.update({
			where: { id },
			data: {
				...(dto.altText !== undefined && { altText: dto.altText }),
				...(dto.caption !== undefined && { caption: dto.caption }),
			},
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Media',
			entityId: media.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: media as unknown as Record<string, unknown>,
		})

		return media
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		// Soft delete in database
		await this.prisma.media.update({
			where: { id },
			data: { deletedAt: new Date() },
		})

		// Also delete from S3 storage if available
		try {
			await this.s3Service.delete(existing.storageKey)
		} catch {
			// Best effort deletion
		}

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Media',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
