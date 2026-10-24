import type { AuthenticatedUser } from 'types/auth'
import type { RequestMeta, SessionContext } from 'types/server'

import { Injectable } from '@nestjs/common'
import { UserAccountService } from 'modules/user'
import { SessionService } from './session.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly accounts: UserAccountService,
		private readonly sessions: SessionService,
	) {}

	async login(
		user: AuthenticatedUser,
		meta: RequestMeta,
		session: SessionContext,
	): Promise<AuthenticatedUser> {
		const account = await this.accounts.syncFirebaseUser(user, meta)

		if (session.token && session.decodedToken && account.id)
			await this.sessions.createOrUpdateSession(
				account.id,
				session.token,
				session.decodedToken,
				session.ip,
				session.userAgent,
			)

		return account
	}
}
