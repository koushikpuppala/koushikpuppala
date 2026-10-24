import type { DeletedRecord, Identifiable, Publishable, PublishFields } from 'types/server'

import { Injectable } from '@nestjs/common'
import { AuditAction } from '@repo/prisma'
import { publishFields } from 'common/utils/publish.util'
import { AuditLogService } from './audit-log.service'

// Shared write-then-audit steps for the CMS services, so each one records changes the same way.
@Injectable()
export class CmsAuditService {
	constructor(private readonly auditLog: AuditLogService) {}

	async created<T extends Identifiable>(
		entity: string,
		actor: string,
		record: T,
		action: AuditAction = AuditAction.CREATE,
	): Promise<T> {
		await this.auditLog.create({
			action,
			entity,
			entityId: record.id,
			actor,
			newData: record,
		})

		return record
	}

	async updated<T extends Identifiable>(
		entity: string,
		actor: string,
		before: Identifiable,
		after: T,
	): Promise<T> {
		await this.auditLog.create({
			action: AuditAction.UPDATE,
			entity,
			entityId: after.id,
			actor,
			oldData: before,
			newData: after,
		})

		return after
	}

	async togglePublish<T extends Identifiable>(
		entity: string,
		actor: string,
		existing: Publishable,
		write: (data: PublishFields) => Promise<T>,
	): Promise<T> {
		const next = !existing.isPublished
		const record = await write(publishFields(next, null))

		await this.auditLog.create({
			action: next ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
			entity,
			entityId: record.id,
			actor,
			newData: { isPublished: next },
		})

		return record
	}

	async softDeleted(
		entity: string,
		actor: string,
		existing: Identifiable,
		write: () => Promise<unknown>,
	): Promise<DeletedRecord> {
		await write()

		await this.auditLog.create({
			action: AuditAction.DELETE,
			entity,
			entityId: existing.id,
			actor,
			oldData: existing,
		})

		return { id: existing.id, deleted: true }
	}
}
