import type { NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

import { Injectable } from '@nestjs/common'
import { requestContextStorage } from 'common/context/request-context'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
	use(req: Request, _res: Response, next: NextFunction) {
		const rawIp =
			req.headers['x-forwarded-for']?.toString()?.split(',')[0]?.trim() ||
			req?.ip ||
			req.socket?.remoteAddress

		const requestId = req.requestId
		const userId = req.user?.id
		const userAgent = req.headers['user-agent']?.toString()
		const ipAddress = rawIp === '::1' || rawIp === '::ffff:127.0.0.1' ? '127.0.0.1' : rawIp

		requestContextStorage.run({ ipAddress, userAgent, requestId, userId }, () => {
			next()
		})
	}
}
