import type { AuditLogCreateParams, AuditLogEntry, AuditLogParams } from 'types/server'

import { Injectable } from '@nestjs/common'
import { createdAtRange } from 'common/utils/date-range.util'
import { DatabaseService } from 'database/database.service'
import { QueryAuditLogDto } from './dto/query-audit-log.dto'
import { Prisma } from '@repo/prisma'
import { requestContextStorage } from 'common/context/request-context'
import { ApiResponse, successResponse } from 'common/interfaces/api-response.interface'

const isValidUuid = (id?: string): boolean => {
	if (!id) return false

	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

const looksLikeEmail = (value?: string | null): value is string => !!value?.includes('@')

@Injectable()
export class AuditLogService {
	constructor(private readonly prisma: DatabaseService) {}

	private findActor(actorId?: string, actorName?: string) {
		const select = { id: true, displayName: true, email: true } as const

		if (actorId) return this.prisma.user.findUnique({ where: { id: actorId }, select })
		if (looksLikeEmail(actorName))
			return this.prisma.user.findFirst({
				where: { email: { equals: actorName, mode: 'insensitive' } },
				select,
			})

		return Promise.resolve(null)
	}

	async log(params: AuditLogParams) {
		try {
			const contextStore = requestContextStorage.getStore()
			const effectiveActorId = params.actorId || contextStore?.userId
			// actorId is a foreign key to users, so anything that is not a user UUID (such as
			// the default 'admin' actor name) is recorded as the actor's name instead.
			const validActorId = isValidUuid(effectiveActorId) ? effectiveActorId : undefined

			const user = await this.findActor(validActorId, params.actorName)
			const actorDisplayName =
				(user && (user.displayName || user.email)) ||
				params.actorName ||
				(!validActorId ? effectiveActorId : undefined) ||
				'System'

			const ipAddress = params.ipAddress || contextStore?.ipAddress || undefined
			const userAgent = params.userAgent || contextStore?.userAgent || undefined
			const requestId = params.requestId || contextStore?.requestId || undefined

			await this.prisma.auditLog.create({
				data: {
					action: params.action,
					entity: params.entity,
					entityId: String(params.entityId),
					// Round-trip through JSON so Dates, Decimals and class instances become plain JSON values.
					oldData: params.oldData ? JSON.parse(JSON.stringify(params.oldData)) : undefined,
					newData: params.newData ? JSON.parse(JSON.stringify(params.newData)) : undefined,
					actorId: user?.id ?? validActorId,
					actor: actorDisplayName,
					ipAddress,
					userAgent,
					requestId,
				},
			})
		} catch (error) {
			// Auditing must never fail the action being audited.
			console.error('Failed to create audit log in DB:', error)
		}
	}

	async create(params: AuditLogCreateParams) {
		return this.log({ ...params, actorName: params.actorName || params.actor })
	}

	async findAll(query: QueryAuditLogDto): Promise<ApiResponse<AuditLogEntry[]>> {
		const { page, limit, search, action, entity, from, to, sortBy, sortOrder } = query
		const skip = (page - 1) * limit
		const where: Prisma.AuditLogWhereInput = {}

		if (action) where.action = action
		if (entity) where.entity = { contains: entity, mode: 'insensitive' }

		const createdAt = createdAtRange(from, to)
		if (createdAt) where.createdAt = createdAt

		const keyword = search?.trim()

		// Also match logs by the current name or email of their actor, not only the stored actor text.
		if (keyword) {
			const matchingUsers = await this.prisma.user.findMany({
				where: {
					OR: [
						{ displayName: { contains: keyword, mode: 'insensitive' } },
						{ email: { contains: keyword, mode: 'insensitive' } },
					],
				},
				select: { id: true, email: true },
				take: 50,
			})

			where.OR = [
				{ entity: { contains: keyword, mode: 'insensitive' } },
				{ entityId: { contains: keyword, mode: 'insensitive' } },
				{ actor: { contains: keyword, mode: 'insensitive' } },
				...(matchingUsers.length
					? [
							{ actorId: { in: matchingUsers.map(u => u.id) } },
							{ actor: { in: matchingUsers.map(u => u.email), mode: 'insensitive' as const } },
						]
					: []),
			]
		}

		const [logs, total] = await this.prisma.$transaction([
			this.prisma.auditLog.findMany({
				where,
				skip,
				take: limit,
				orderBy: { [sortBy]: sortOrder },
			}),
			this.prisma.auditLog.count({ where }),
		])

		// Resolve actors in one query so each entry shows the user's current name, not the name
		// stored when the log was written.
		const actorIds = [...new Set(logs.flatMap(l => (l.actorId ? [l.actorId] : [])))]
		const actorEmails = [...new Set(logs.flatMap(l => (looksLikeEmail(l.actor) ? [l.actor] : [])))]

		const users =
			actorIds.length || actorEmails.length
				? await this.prisma.user.findMany({
						where: { OR: [{ id: { in: actorIds } }, { email: { in: actorEmails } }] },
						select: { id: true, displayName: true, email: true },
					})
				: []

		const byId = new Map(users.map(u => [u.id, u]))
		const byEmail = new Map(users.map(u => [u.email.toLowerCase(), u]))

		const entries: AuditLogEntry[] = logs.map(log => {
			const user =
				(log.actorId && byId.get(log.actorId)) ||
				(looksLikeEmail(log.actor) ? byEmail.get(log.actor.toLowerCase()) : undefined)

			return user
				? { ...log, actor: user.displayName || user.email, actorEmail: user.email }
				: { ...log, actorEmail: looksLikeEmail(log.actor) ? log.actor : null }
		})

		return successResponse(entries, 'Audit logs fetched successfully.', total)
	}
}
