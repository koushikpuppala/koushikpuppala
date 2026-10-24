import { Module } from '@nestjs/common'
import { EducationService } from './education.service'
import { DatabaseModule } from 'database/database.module'
import { EducationController } from './education.controller'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [EducationController],
	providers: [EducationService],
	exports: [EducationService],
})
export class EducationModule {}
