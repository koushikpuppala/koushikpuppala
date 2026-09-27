import { Module } from '@nestjs/common'
import { MetadataService } from './metadata.service'
import { DatabaseModule } from 'database/database.module'
import { MetadataController } from './metadata.controller'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'
import { RedisModule } from 'redis/redis.module'

@Module({
	imports: [DatabaseModule, AuditLogModule, RedisModule],
	controllers: [MetadataController],
	providers: [MetadataService],
	exports: [MetadataService],
})
export class MetadataModule {}
