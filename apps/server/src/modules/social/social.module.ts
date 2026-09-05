import { Module } from '@nestjs/common'
import { SocialController } from './social.controller'
import { SocialService } from './social.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [SocialController],
	providers: [SocialService],
	exports: [SocialService],
})
export class SocialModule {}
