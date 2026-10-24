import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

import { createParamDecorator } from '@nestjs/common'

// The name recorded in audit logs for CMS writes; AuditLogService resolves an email back to the user.
export const Actor = createParamDecorator((_data: unknown, context: ExecutionContext): string => {
	const { user } = context.switchToHttp().getRequest<Request>()

	return user?.email ?? user?.id ?? 'admin'
})
