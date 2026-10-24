import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import type { RequestMeta } from 'types/server'

import { createParamDecorator } from '@nestjs/common'

export const Meta = createParamDecorator(
	(_data: unknown, context: ExecutionContext): RequestMeta => {
		const request = context.switchToHttp().getRequest<Request>()

		return { requestId: request.requestId, endpoint: request.originalUrl }
	},
)
