import { Module } from '@nestjs/common'
import { AboutService } from './about.service'
import { AboutController } from './about.controller'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [AboutController],
	providers: [AboutService],
	exports: [AboutService],
})
export class AboutModule {}
