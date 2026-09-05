import { Module, Global } from '@nestjs/common'
import { AuditLogService } from './audit-log.service'
import { AuditLogController } from './audit-log.controller'
import { DatabaseModule } from 'database/database.module'

@Global()
@Module({
	imports: [DatabaseModule],
	controllers: [AuditLogController],
	providers: [AuditLogService],
	exports: [AuditLogService],
})
export class AuditLogModule {}
