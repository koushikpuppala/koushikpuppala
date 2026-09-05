import { Module } from '@nestjs/common'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [ProjectController],
	providers: [ProjectService],
	exports: [ProjectService],
})
export class ProjectModule {}
