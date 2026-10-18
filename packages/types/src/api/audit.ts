import type { AuditAction } from '../enums/index'

export type AuditLogItem = {
	id: string
	action: AuditAction
	entity: string
	entityId: string
	oldData?: unknown
	newData?: unknown
	actor: string
	actorEmail?: string | null
	actorId?: string | null
	ipAddress?: string | null
	userAgent?: string | null
	requestId?: string | null
	createdAt: string
}
