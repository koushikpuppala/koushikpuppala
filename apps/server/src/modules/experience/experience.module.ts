import { Module } from '@nestjs/common'
import { ExperienceService } from './experience.service'
import { DatabaseModule } from 'database/database.module'
import { ExperienceController } from './experience.controller'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [ExperienceController],
	providers: [ExperienceService],
	exports: [ExperienceService],
})
export class ExperienceModule {}
