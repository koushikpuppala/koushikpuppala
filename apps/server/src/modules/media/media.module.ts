import { Module } from '@nestjs/common'
import { MediaService } from './media.service'
import { ConfigModule } from 'config/config.module'
import { MediaController } from './media.controller'
import { DatabaseModule } from 'database/database.module'
import { StorageModule } from 'common/storage/storage.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule, StorageModule, ConfigModule],
	controllers: [MediaController],
	providers: [MediaService],
	exports: [MediaService],
})
export class MediaModule {}
