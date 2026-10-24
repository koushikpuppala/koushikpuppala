import { DatabaseService } from 'database'
import { Injectable } from '@nestjs/common'
import { ContactNotifier } from './contact.notifier'
import { LoggerService } from 'common/logger/logger.service'
import { createdAtRange } from 'common/utils/date-range.util'
import { BaseService } from 'common/services/base-cms.service'
import { ContactPriority, ContactStatus, Prisma } from '@repo/prisma'
import { CmsAuditService } from 'modules/audit-log/cms-audit.service'
import { CreateContactDto, QueryContactDto, UpdateContactDto } from './contact.dto'

const ENTITY = 'Contact'
const RECEIVED = 'Thank you for getting in touch! Your message has been received.'

@Injectable()
export class ContactService extends BaseService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly audit: CmsAuditService,
		private readonly logger: LoggerService,
		private readonly notifier: ContactNotifier,
	) {
		super()
	}

	async submit(dto: CreateContactDto, ipAddress?: string, userAgent?: string) {
		// The url field is a hidden honeypot that people never fill in. Bots that do get the
		// normal success reply so they cannot tell the message was dropped.
		if (dto.url?.trim()) {
			this.logger.warn('Discarded honeypot spam contact submission', ContactService.name, {
				ipAddress,
				email: dto.email,
			})

			return { id: 'filtered', message: RECEIVED }
		}

		const contact = await this.prisma.contact.create({
			data: {
				name: dto.name,
				email: dto.email,
				subject: dto.subject,
				message: dto.message,
				url: dto.url,
				source: dto.source ?? 'website',
				status: ContactStatus.UNREAD,
				priority: ContactPriority.NORMAL,
				ipAddress,
				userAgent,
			},
		})

		await this.notifier.notify(contact)

		return { id: contact.id, message: RECEIVED }
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

		const createdAt = createdAtRange(query.from, query.to)
		if (createdAt) where.createdAt = createdAt

		const [items, total, unreadCount, urgentCount, resolvedCount] = await Promise.all([
			this.prisma.contact.findMany({
				where,
				skip,
				take,
				orderBy: this.getOrderBy(query.sortBy, query.sortOrder, [{ createdAt: 'desc' }]),
				include: { assignedTo: { select: { id: true, email: true, displayName: true } } },
			}),
			this.prisma.contact.count({ where }),
			this.prisma.contact.count({
				where: { status: ContactStatus.UNREAD, deletedAt: null },
			}),
			this.prisma.contact.count({
				where: {
					priority: { in: [ContactPriority.HIGH, ContactPriority.URGENT] },
					deletedAt: null,
				},
			}),
			this.prisma.contact.count({
				where: { status: ContactStatus.RESOLVED, deletedAt: null },
			}),
		])

		return {
			items,
			unreadCount,
			urgentCount,
			resolvedCount,
			pagination: this.getPaginationMeta(page, limit, total),
		}
	}

	async findOne(id: string) {
		const contact = await this.prisma.contact.findFirst({
			where: { id, deletedAt: null },
			include: { assignedTo: true },
		})

		const found = this.ensureExists(contact, 'Contact message not found')

		// Opening a message in the admin marks it as read.
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

		const resolvesNow =
			dto.status === ContactStatus.RESOLVED && existing.status !== ContactStatus.RESOLVED

		const contact = await this.prisma.contact.update({
			where: { id },
			data: { ...dto, ...(resolvesNow && { resolvedAt: new Date() }) },
			include: { assignedTo: true },
		})

		return this.audit.updated(ENTITY, actor, existing, contact)
	}

	async remove(id: string, actor = 'admin') {
		const existing = await this.findOne(id)

		return this.audit.softDeleted(ENTITY, actor, existing, () =>
			this.prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } }),
		)
	}
}
