import { Module } from '@nestjs/common'
import { ContactService } from './contact.service'
import { ContactController } from './contact.controller'
import { DatabaseModule } from 'database/database.module'
import { LoggerService } from 'common/logger/logger.service'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule, LoggerService],
	controllers: [ContactController],
	providers: [ContactService],
	exports: [ContactService],
})
export class ContactModule {}
