import { Injectable } from '@nestjs/common'
import { getDateRange } from 'common/utils/date-range.util'
import { DatabaseService } from 'database/database.service'
import { QueryAuditLogDto } from './dto/query-audit-log.dto'
import { AuditAction, AuditLog, Prisma } from '@repo/prisma'
import { requestContextStorage } from 'common/context/request-context'
import { ApiResponse, successResponse } from 'common/interfaces/api-response.interface'

const isValidUuid = (id?: string): boolean => {
	if (!id) return false

	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

@Injectable()
export class AuditLogService {
	constructor(private readonly prisma: DatabaseService) {}

	async log(params: {
		action: AuditAction
		entity: string
		entityId: string
		oldData?: unknown
		newData?: unknown
		actorId?: string
		actorName?: string
		ipAddress?: string
		userAgent?: string
		requestId?: string
	}) {
		try {
			const contextStore = requestContextStorage.getStore()
			const effectiveActorId = params.actorId || contextStore?.userId
			const validActorId = isValidUuid(effectiveActorId) ? effectiveActorId : undefined

			let actorDisplayName = params.actorName

			if (!actorDisplayName && validActorId) {
				const user = await this.prisma.user.findUnique({
					where: { id: validActorId },
					select: { displayName: true, name: true, email: true },
				})

				if (user) actorDisplayName = user.displayName || user.name || user.email
			}

			if (!actorDisplayName)
				actorDisplayName = (!validActorId ? effectiveActorId : undefined) || 'System'

			const ipAddress = params.ipAddress || contextStore?.ipAddress || undefined
			const userAgent = params.userAgent || contextStore?.userAgent || undefined
			const requestId = params.requestId || contextStore?.requestId || undefined

			await this.prisma.auditLog.create({
				data: {
					action: params.action,
					entity: params.entity,
					entityId: String(params.entityId),
					oldData: params.oldData ? JSON.parse(JSON.stringify(params.oldData)) : undefined,
					newData: params.newData ? JSON.parse(JSON.stringify(params.newData)) : undefined,
					actorId: validActorId,
					actor: actorDisplayName,
					ipAddress,
					userAgent,
					requestId,
				},
			})
		} catch (error) {
			console.error('Failed to create audit log in DB:', error)
		}
	}

	async create(params: {
		action: AuditAction
		entity: string
		entityId: string
		oldData?: unknown
		newData?: unknown
		actor?: string
		actorId?: string
		actorName?: string
		ipAddress?: string
		userAgent?: string
		requestId?: string
	}) {
		return this.log({ ...params, actorName: params.actorName || params.actor })
	}

	async findAll(query: QueryAuditLogDto): Promise<ApiResponse<AuditLog[]>> {
		const { page, limit, search, action, entity, from, to, sortBy, sortOrder } = query
		const skip = (page - 1) * limit
		const where: Prisma.AuditLogWhereInput = {}

		if (action) where.action = action
		if (entity) where.entity = { contains: entity, mode: 'insensitive' }

		if (from || to) {
			const { from: startDate, to: endDate } = getDateRange({ from, to })

			where.createdAt = { ...(from && { gte: startDate }), ...(to && { lte: endDate }) }
		}

		const keyword = search?.trim()

		if (keyword)
			where.OR = [
				{ entity: { contains: keyword, mode: 'insensitive' } },
				{ entityId: { contains: keyword, mode: 'insensitive' } },
				{ actor: { contains: keyword, mode: 'insensitive' } },
			]

		const [logs, total] = await this.prisma.$transaction([
			this.prisma.auditLog.findMany({
				where,
				skip,
				take: limit,
				orderBy: { [sortBy]: sortOrder },
			}),
			this.prisma.auditLog.count({ where }),
		])

		// Resolve missing actor display names for historical logs
		const missingActorIds = [
			...new Set(logs.filter(l => !l.actor && l.actorId).map(l => l.actorId as string)),
		]

		if (missingActorIds.length > 0) {
			const users = await this.prisma.user.findMany({
				where: { id: { in: missingActorIds } },
				select: { id: true, displayName: true, name: true, email: true },
			})

			const userMap = new Map(users.map(u => [u.id, u.displayName || u.name || u.email]))

			for (const log of logs) {
				if (!log.actor && log.actorId && userMap.has(log.actorId))
					log.actor = userMap.get(log.actorId) ?? 'System'
			}
		}

		return successResponse(logs, 'Audit logs fetched successfully.', total)
	}
}
