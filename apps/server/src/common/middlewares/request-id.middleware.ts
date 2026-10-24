import type { NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

import { nanoid } from 'nanoid'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		req.requestId = nanoid()

		req.startTime = Date.now()

		res.setHeader('x-request-id', req.requestId)

		next()
	}
}
