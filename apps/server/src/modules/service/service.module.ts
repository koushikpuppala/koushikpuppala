import { Module } from '@nestjs/common'
import { ServiceController } from './service.controller'
import { ServiceService } from './service.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [ServiceController],
	providers: [ServiceService],
	exports: [ServiceService],
})
export class ServiceModule {}
