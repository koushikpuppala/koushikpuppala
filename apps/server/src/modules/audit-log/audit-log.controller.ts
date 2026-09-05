import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuditLogService } from './audit-log.service'
import { QueryAuditLogDto } from './dto/query-audit-log.dto'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { UserRole } from '@repo/prisma'

@ApiTags('Audit Logs')
@Controller('audit-logs')
@Roles(UserRole.ADMIN)
export class AuditLogController {
	constructor(private readonly auditLogService: AuditLogService) {}

	@Get()
	@ApiEndpoint({
		method: 'GET',
		endpoint: 'GET /api/v1/audit-logs',
		summary: 'Get all audit logs',
		description: 'Returns a paginated list of audit logs for Super Admin and Admin.',
		isPaginated: true,
	})
	findAll(@Query() query: QueryAuditLogDto) {
		return this.auditLogService.findAll(query)
	}
}
