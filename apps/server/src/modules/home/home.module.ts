import { Module } from '@nestjs/common'
import { HomeService } from './home.service'
import { HomeController } from './home.controller'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule],
	controllers: [HomeController],
	providers: [HomeService],
	exports: [HomeService],
})
export class HomeModule {}
