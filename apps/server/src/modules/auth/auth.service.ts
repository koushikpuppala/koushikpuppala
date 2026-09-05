import type { AuthenticatedUser } from 'types/express'

import { UserService } from 'modules/user'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	login(user: AuthenticatedUser, meta?: { requestId: string; endpoint: string }) {
		return this.userService.syncFirebaseUser(user, meta)
	}
}
