import { Module } from '@nestjs/common'
import { MetadataService } from './metadata.service'
import { DatabaseModule } from 'database/database.module'
import { MetadataController } from './metadata.controller'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [MetadataController],
	providers: [MetadataService],
	exports: [MetadataService],
})
export class MetadataModule {}
