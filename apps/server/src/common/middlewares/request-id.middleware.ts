import type { NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		req.requestId = nanoid()

		req.startTime = Date.now()

		res.setHeader('X-Request-Id', req.requestId)

		next()
	}
}
