import type { NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

import { Injectable } from '@nestjs/common'
import { requestContextStorage } from 'common/context/request-context'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
	use(req: Request, _res: Response, next: NextFunction) {
		const rawIp = req.ip || req.socket?.remoteAddress || 'unknown'

		const requestId = req.requestId
		const userId = req.user?.id
		const userAgent = req.headers['user-agent']?.toString() ?? ''
		// Normalise IPv6 loopback forms so local requests always log as 127.0.0.1.
		const ipAddress = rawIp === '::1' || rawIp === '::ffff:127.0.0.1' ? '127.0.0.1' : rawIp

		req.context = {
			ip: ipAddress,
			userAgent,
			host: req.hostname,
			protocol: req.protocol,
			origin: req.headers.origin ?? '',
			language: req.headers['accept-language']?.toString() ?? '',
		}

		// AsyncLocalStorage lets services such as the audit log read the request's IP and user agent
		// without having them passed through every call.
		requestContextStorage.run({ ipAddress, userAgent, requestId, userId }, () => {
			next()
		})
	}
}
