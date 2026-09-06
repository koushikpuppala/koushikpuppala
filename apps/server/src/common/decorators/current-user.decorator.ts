import type { ExecutionContext } from '@nestjs/common'
import type { DecodedIdToken } from 'firebase-admin/auth'

import { createParamDecorator } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
	(data: keyof DecodedIdToken | undefined, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest()

		const user = request.user

		return data ? user?.[data] : user
	},
)
