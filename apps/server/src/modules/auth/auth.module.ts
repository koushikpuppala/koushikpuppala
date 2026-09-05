import { Module } from '@nestjs/common'
import { UserModule } from 'modules/user'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SessionService } from './session.service'

@Module({
	imports: [UserModule, AuditLogModule],
	controllers: [AuthController],
	providers: [AuthService, SessionService],
	exports: [SessionService],
})
export class AuthModule {}
