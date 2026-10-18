import { Module, Global } from '@nestjs/common'
import { AuditLogService } from './audit-log.service'
import { CmsAuditService } from './cms-audit.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogController } from './audit-log.controller'

@Global()
@Module({
	imports: [DatabaseModule],
	controllers: [AuditLogController],
	providers: [AuditLogService, CmsAuditService],
	exports: [AuditLogService, CmsAuditService],
})
export class AuditLogModule {}
