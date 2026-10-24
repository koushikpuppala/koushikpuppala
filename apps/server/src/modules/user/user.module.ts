import { Module } from '@nestjs/common'
import { UserAdminService } from './user-admin.service'
import { UserAccountService } from './user-account.service'
import { UserController } from './user.controller'

@Module({
	providers: [UserAccountService, UserAdminService],
	controllers: [UserController],
	exports: [UserAccountService],
})
export class UserModule {}
