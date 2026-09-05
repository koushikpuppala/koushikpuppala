import type { NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

import { Injectable } from '@nestjs/common'
import { requestContextStorage } from 'common/context/request-context'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
	use(req: Request, _res: Response, next: NextFunction) {
		const rawIp =
			(req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
			req.ip ||
			req.socket?.remoteAddress ||
			undefined

		const ipAddress = rawIp === '::1' || rawIp === '::ffff:127.0.0.1' ? '127.0.0.1' : rawIp
		const userAgent = (req.headers['user-agent'] as string) || undefined
		const requestId = req.requestId || undefined
		const userId = req.user?.id || undefined

		requestContextStorage.run({ ipAddress, userAgent, requestId, userId }, () => {
			next()
		})
	}
}
