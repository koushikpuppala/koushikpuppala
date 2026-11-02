import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

import { createParamDecorator } from '@nestjs/common'

export const Actor = createParamDecorator((_data: unknown, context: ExecutionContext): string => {
	const { user } = context.switchToHttp().getRequest<Request>()

	return user?.email ?? user?.id ?? 'admin'
})
