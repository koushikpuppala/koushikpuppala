import { Module } from '@nestjs/common'
import { MetadataController } from './metadata.controller'
import { MetadataService } from './metadata.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [MetadataController],
	providers: [MetadataService],
	exports: [MetadataService],
})
export class MetadataModule {}
