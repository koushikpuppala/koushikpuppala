import {
	CompleteMediaUploadDto,
	QueryMediaDto,
	RequestPresignedUploadDto,
	UpdateMediaDto,
} from './media.dto'
import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { DatabaseService } from 'database'
import { AuditAction, Prisma } from '@repo/prisma'
import { Configuration } from 'config/configuration'
import type { StorageService } from 'types/server'
import { STORAGE_SERVICE } from 'common/storage/storage.token'
import { BaseService } from 'common/services/base-cms.service'
import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { ALLOWED_UPLOADS, MAX_UPLOAD_BYTES, STORAGE_KEY_PATTERN } from './media.constants'

const ENTITY = 'Media'

@Injectable()
export class MediaService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
		@Inject(STORAGE_SERVICE) private readonly storage: StorageService,
		private readonly config: Configuration,
	) {
		super()
	}

	// The extension must match the declared MIME type so a file cannot be uploaded under a
	// harmless type and then served with a dangerous extension.
	private assertAllowedUpload(originalName: string, mimeType: string, size: number) {
		const allowed = ALLOWED_UPLOADS[mimeType.toLowerCase()]

		if (!allowed) throw new BadRequestException(`File type '${mimeType}' is not allowed.`)

		const extension = extname(originalName).toLowerCase()

		if (!allowed.extensions.includes(extension))
			throw new BadRequestException(
				`File extension '${extension || '(none)'}' does not match type '${mimeType}'.`,
			)

		if (size > MAX_UPLOAD_BYTES)
			throw new BadRequestException('File exceeds the 50 MB upload limit.')

		return { extension, type: allowed.type }
	}

	async requestPresignedUpload(dto: RequestPresignedUploadDto) {
		const { extension } = this.assertAllowedUpload(dto.originalName, dto.mimeType, dto.size)

		// Keep only safe characters (no dots, so no '..'), then drop empty segments, which trims and
		// collapses slashes. Splitting avoids a slash-trimming regex that is slow on long runs of '/'.
		const folder =
			(dto.folder ?? 'general')
				.replace(/[^a-zA-Z0-9_\-/]/g, '')
				.split('/')
				.filter(Boolean)
				.join('/') || 'general'

		const fileId = randomUUID()

		const storageKey = `${folder}/${fileId}${extension}`

		let uploadUrl = ''

		try {
			uploadUrl = await this.storage.getPresignedUploadUrl(
				storageKey,
				dto.mimeType.toLowerCase(),
				dto.size,
				900,
			)
		} catch {
			throw new BadRequestException(
				'Failed to generate upload URL. Please verify cloud storage configuration.',
			)
		}

		const fileUrl = `${this.config.aws.cdnUrl}/${storageKey}`

		return { uploadUrl, storageKey, url: fileUrl }
	}

	async completeUpload(dto: CompleteMediaUploadDto, userId?: string, actor = 'admin') {
		// Only keys in the format requestPresignedUpload issues are accepted, so a client cannot
		// register an arbitrary object from the bucket as its own media.
		if (!STORAGE_KEY_PATTERN.test(dto.storageKey))
			throw new BadRequestException('Storage key was not issued by this service.')

		this.assertAllowedUpload(dto.storageKey, dto.mimeType, dto.size)

		// Confirm the browser actually finished the direct-to-S3 upload before creating the record.
		if (this.config.aws.verifyUploads) {
			const exists = await this.storage.exists(dto.storageKey)

			if (!exists)
				throw new BadRequestException(
					'Uploaded file does not exist in storage or upload was incomplete.',
				)
		}

		const extension = extname(dto.originalName).toLowerCase().replace('.', '')

		const fileName = dto.storageKey.split('/').pop() ?? dto.originalName

		const fileUrl = `${this.config.aws.cdnUrl}/${dto.storageKey}`

		const media = await this.prisma.media.create({
			data: {
				type: dto.type,
				fileName,
				originalName: dto.originalName,
				size: dto.size,
				mimeType: dto.mimeType,
				extension,
				bucket: this.config.aws.s3Bucket,
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

		return this.audit.created(ENTITY, actor, media, AuditAction.UPLOAD)
	}

	async adminFindAll(query: QueryMediaDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)

		const where: Prisma.MediaWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ originalName: { contains: query.search, mode: 'insensitive' } },
				{ fileName: { contains: query.search, mode: 'insensitive' } },
				{ altText: { contains: query.search, mode: 'insensitive' } },
				{ caption: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.type) where.type = query.type

		if (query.folder) where.folder = query.folder

		const [items, total] = await Promise.all([
			this.prisma.media.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [{ createdAt: 'desc' }]),
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
			data: { altText: dto.altText, caption: dto.caption },
		})

		return this.audit.updated(ENTITY, actor, existing, media)
	}

	// Lists live content that still references this media, so deleting it cannot leave broken images.
	private async findUsages(id: string): Promise<string[]> {
		const live = { where: { deletedAt: null } }

		const media = await this.prisma.media.findUnique({
			where: { id },
			select: {
				resume: { select: { deletedAt: true } },
				_count: {
					select: {
						homes: live,
						about: live,
						skills: live,
						services: live,
						education: live,
						experiences: live,
						projectsHero: live,
						projectsThumbnail: live,
						projectGalleries: { where: { project: { deletedAt: null } } },
					},
				},
			},
		})

		if (!media) return []

		const usages = Object.entries(media._count)
			.filter(([, count]) => count > 0)
			.map(([relation, count]) => `${relation} (${count})`)

		if (media.resume && !media.resume.deletedAt) usages.push('resume (1)')

		return usages
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		const usages = await this.findUsages(id)

		if (usages.length > 0)
			throw new ConflictException(
				`Media file is still in use by: ${usages.join(', ')}. Remove those references first.`,
			)

		return this.audit.softDeleted(ENTITY, actor, existing, async () => {
			await this.prisma.media.update({ where: { id }, data: { deletedAt: new Date() } })
			// The record is already soft-deleted; a leftover S3 object is harmless, so ignore failures.
			await this.storage.delete(existing.storageKey).catch(() => undefined)
		})
	}
}
