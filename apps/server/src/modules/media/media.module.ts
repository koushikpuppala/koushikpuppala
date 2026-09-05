import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'
import { StorageModule } from 'common/storage/storage.module'
import { ConfigModule } from 'config/config.module'

@Module({
	imports: [DatabaseModule, AuditLogModule, StorageModule, ConfigModule],
	controllers: [MediaController],
	providers: [MediaService],
	exports: [MediaService],
})
export class MediaModule {}
