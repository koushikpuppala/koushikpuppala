import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database'
import { BaseService } from 'common/services/base-cms.service'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { AuditAction, ContactPriority, ContactStatus, Prisma } from '@repo/prisma'
import { CreateContactDto, QueryContactDto, UpdateContactDto } from './contact.dto'

@Injectable()
export class ContactService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly auditLog: AuditLogService,
	) {
		super()
	}

	async submit(dto: CreateContactDto, ipAddress?: string, userAgent?: string) {
		const isSpam = Boolean(dto.url && dto.url.trim().length > 0)

		const contact = await this.prisma.contact.create({
			data: {
				name: dto.name,
				email: dto.email,
				subject: dto.subject,
				message: dto.message,
				url: dto.url,
				source: dto.source ?? 'website',
				status: isSpam ? ContactStatus.SPAM : ContactStatus.UNREAD,
				priority: isSpam ? ContactPriority.LOW : ContactPriority.NORMAL,
				ipAddress,
				userAgent,
			},
		})

		return {
			id: contact.id,
			message: 'Thank you for getting in touch! Your message has been received.',
		}
	}

	async adminFindAll(query: QueryContactDto) {
		const { page, limit, take, skip } = this.getPagination(query.page, query.limit)

		const where: Prisma.ContactWhereInput = { deletedAt: null }

		if (query.search)
			where.OR = [
				{ name: { contains: query.search, mode: 'insensitive' } },
				{ email: { contains: query.search, mode: 'insensitive' } },
				{ subject: { contains: query.search, mode: 'insensitive' } },
				{ message: { contains: query.search, mode: 'insensitive' } },
			]

		if (query.status) where.status = query.status
		if (query.priority) where.priority = query.priority

		const [items, total, unreadCount] = await Promise.all([
			this.prisma.contact.findMany({
				where,
				skip,
				take,
				orderBy: { createdAt: 'desc' },
				include: { assignedTo: { select: { id: true, email: true, displayName: true } } },
			}),
			this.prisma.contact.count({ where }),
			this.prisma.contact.count({
				where: { status: ContactStatus.UNREAD, deletedAt: null },
			}),
		])

		return { items, unreadCount, pagination: this.getPaginationMeta(page, limit, total) }
	}

	async findOne(id: string) {
		const contact = await this.prisma.contact.findFirst({
			where: { id, deletedAt: null },
			include: { assignedTo: true },
		})

		const found = this.ensureExists(contact, 'Contact message not found')

		// If unread, mark as read
		if (found.status === ContactStatus.UNREAD) {
			await this.prisma.contact.update({
				where: { id },
				data: { status: ContactStatus.READ, readAt: new Date() },
			})
			found.status = ContactStatus.READ
			found.readAt = new Date()
		}

		return found
	}

	async update(id: string, dto: UpdateContactDto, actor = 'admin') {
		const existing = await this.findOne(id)

		const isNowResolved =
			dto.status === ContactStatus.RESOLVED && existing.status !== ContactStatus.RESOLVED

		const contact = await this.prisma.contact.update({
			where: { id },
			data: {
				...(dto.status !== undefined && { status: dto.status }),
				...(dto.priority !== undefined && { priority: dto.priority }),
				...(dto.internalNotes !== undefined && { internalNotes: dto.internalNotes }),
				...(dto.assignedToId !== undefined && { assignedToId: dto.assignedToId }),
				...(isNowResolved && { resolvedAt: new Date() }),
			},
			include: { assignedTo: true },
		})

		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity: 'Contact',
			entityId: contact.id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
			newData: contact as unknown as Record<string, unknown>,
		})

		return contact
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		await this.prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } })

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity: 'Contact',
			entityId: id,
			actor,
			oldData: existing as unknown as Record<string, unknown>,
		})

		return { id, deleted: true }
	}
}
