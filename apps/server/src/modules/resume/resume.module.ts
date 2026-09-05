import { Module } from '@nestjs/common'
import { ResumeController } from './resume.controller'
import { ResumeService } from './resume.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'
import { StorageModule } from 'common/storage/storage.module'

@Module({
	imports: [DatabaseModule, AuditLogModule, StorageModule],
	controllers: [ResumeController],
	providers: [ResumeService],
	exports: [ResumeService],
})
export class ResumeModule {}
