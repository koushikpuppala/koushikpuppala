import { Module } from '@nestjs/common'
import { SkillService } from './skill.service'
import { SkillController } from './skill.controller'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [SkillController],
	providers: [SkillService],
	exports: [SkillService],
})
export class SkillModule {}
