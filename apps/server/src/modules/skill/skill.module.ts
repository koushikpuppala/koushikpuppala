import { Module } from '@nestjs/common'
import { SkillController } from './skill.controller'
import { SkillService } from './skill.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [SkillController],
	providers: [SkillService],
	exports: [SkillService],
})
export class SkillModule {}
