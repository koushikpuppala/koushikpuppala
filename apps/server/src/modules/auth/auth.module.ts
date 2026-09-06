import { Module } from '@nestjs/common'
import { UserModule } from 'modules/user'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { SessionService } from './session.service'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [UserModule, AuditLogModule],
	controllers: [AuthController],
	providers: [AuthService, SessionService],
	exports: [SessionService],
})
export class AuthModule {}
