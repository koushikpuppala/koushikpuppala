import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseCmsService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, Prisma } from '@repo/prisma'
import { CreateEducationDto, QueryEducationDto, UpdateEducationDto } from './education.dto'

@Injectable()
export class EducationService extends BaseCmsService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async getPublished() {
		const items = await this.prisma.education.findMany({
			where: { isPublished: true, deletedAt: null },
			orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
			include: { logo: { select: { id: true, url: true, fileName: true, altText: true } } },
		})

		return items
	}

	async adminFindAll(query: QueryEducationDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)
		const where: Prisma.EducationWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ degree: { contains: query.search, mode: 'insensitive' } },
				{ fieldOfStudy: { contains: query.search, mode: 'insensitive' } },
				{ university: { contains: query.search, mode: 'insensitive' } },
				{ location: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.isPublished !== undefined) where.isPublished = query.isPublished

		const [items, total] = await Promise.all([
			this.prisma.education.findMany({
				where,
				skip,
				take,
				orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
				include: { logo: true },
			}),
			this.prisma.education.count({ where }),
		])

		return { items, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const item = await this.prisma.education.findFirst({
			where: { id, deletedAt: null },
			include: { logo: true },
		})

		return this.ensureExists(item, 'Education record not found')
	}

	async create(dto: CreateEducationDto, actor = 'admin') {
		const education = await this.prisma.education.create({
			data: {
				degree: dto.degree,
				fieldOfStudy: dto.fieldOfStudy,
				university: dto.university,
				location: dto.location,
				description: dto.description,
				achievements: dto.achievements ?? [],
				startDate: new Date(dto.startDate),
				endDate: dto.endDate ? new Date(dto.endDate) : null,
				expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : null,
				isCurrent: dto.isCurrent ?? false,
				website: dto.website,
				logoId: dto.logoId,
				sortOrder: dto.sortOrder ?? 0,
				isPublished: dto.isPublished ?? false,
				publishedAt: dto.isPublished ? new Date() : null,
			},
			include: { logo: true },
		})

		await this.auditLog.create({
			action: AuditAction.CREATE,
			entity: 'Education',
			entityId: education.id,
			actor,
			newData: education as unknown as Record<string, unknown>,
		})

		return education
	}

	async update(id: string, dto: UpdateEducationDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const education = await this.prisma.education.update({
			where: { id },
			data: {
				...(dto.degree !== undefined && { degree: dto.degree }),
				...(dto.fieldOfStudy !== undefined && { fieldOfStudy: dto.fieldOfStudy }),
				...(dto.university !== undefined && { university: dto.university }),
				...(dto.location !== undefined && { location: dto.location }),
				...(dto.description !== undefined && { description: dto.description }),
				...(dto.achievements !== undefined && { achievements: dto.achievements }),
				...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
				...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
				...(dto.expectedDate !== undefined && {
					expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : null,
				}),
				...(dto.isCurrent !== undefined && { isCurrent: dto.isCurrent }),
				...(dto.website !== undefined && { website: dto.website }),
				...(dto.logoId !== undefined && { logoId: dto.logoId }),
				...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
				...(dto.isPublished !== undefined && {
					isPublished: dto.isPublished,
					publishedAt: dto.isPublished ? (existing.publishedAt ?? new Date()) : null,
				}),
			},
			include: { logo: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Education',
			entityId: education.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: education as unknown as Record<string, unknown>,
		})

		return education
	}

	async togglePublish(id: string, actor = 'admin') {
		const existing = await this.findOne(id)
		const nextState = !existing.isPublished

		const education = await this.prisma.education.update({
			where: { id },
			data: { isPublished: nextState, publishedAt: nextState ? new Date() : null },
		})

		await this.auditLog.create({
			action: nextState ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity: 'Education',
			entityId: education.id,
			actor,
			newData: { isPublished: nextState },
		})

		return education
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.education.update({ where: { id }, data: { deletedAt: new Date() } })

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Education',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
