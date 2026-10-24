import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import type { AuthenticatedUser } from 'types/auth'

import { createParamDecorator } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
	(field: keyof AuthenticatedUser | undefined, context: ExecutionContext) => {
		const { user } = context.switchToHttp().getRequest<Request>()

		return field ? user?.[field] : user
	},
)
