import { Module } from '@nestjs/common'
import { ResumeService } from './resume.service'
import { ResumeController } from './resume.controller'
import { DatabaseModule } from 'database/database.module'
import { StorageModule } from 'common/storage/storage.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule, StorageModule],
	controllers: [ResumeController],
	providers: [ResumeService],
	exports: [ResumeService],
})
export class ResumeModule {}
