import type { Request, Response } from 'express'
import type { UnwrappedBody } from 'types/server'
import type { ApiResponse } from 'common/interfaces/api-response.interface'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { Injectable } from '@nestjs/common'
import { RESPONSE_MESSAGE_KEY } from 'common/decorators/message.decorator'

const MESSAGES: Record<string, string> = {
	GET: 'Data fetched successfully.',
	POST: 'Created successfully.',
	PUT: 'Updated successfully.',
	PATCH: 'Updated successfully.',
	DELETE: 'Deleted successfully.',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

// Files, streams and responses already sent by the handler are passed through unwrapped.
const isRaw = (data: unknown, response: Response): boolean =>
	response.headersSent ||
	Buffer.isBuffer(data) ||
	(isRecord(data) && 'stream' in data) ||
	(response.getHeader('content-type')?.toString() ?? '').includes('application/pdf')

// Services may return a plain value or an ApiResponse-shaped object with their own message and count.
const unwrap = (data: unknown, message: string): UnwrappedBody => {
	if (!isRecord(data) || !('result' in data || 'message' in data)) return { result: data, message }

	return {
		result: data.result,
		message: typeof data.message === 'string' ? data.message : message,
		error: typeof data.error === 'boolean' ? data.error : undefined,
		count: typeof data.count === 'number' ? data.count : undefined,
	}
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<unknown>> {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<unknown>> {
		const http = context.switchToHttp()
		const request = http.getRequest<Request>()
		const response = http.getResponse<Response>()

		const message =
			this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
				context.getHandler(),
				context.getClass(),
			]) ??
			MESSAGES[request.method] ??
			'Request successful.'

		return next.handle().pipe(
			map(data => {
				if (isRaw(data, response)) return data as unknown as ApiResponse<unknown>

				const body = unwrap(data, message)
				const count = body.count ?? (Array.isArray(body.result) ? body.result.length : undefined)

				return {
					message: body.message,
					statusCode: response.statusCode || 200,
					timestamp: new Date().toISOString(),
					endpoint: `${request.method} ${request.originalUrl}`,
					...(body.result !== undefined && { result: body.result }),
					...(body.error !== undefined && { error: body.error }),
					...(count !== undefined && { count }),
					...(request.requestId && { requestId: request.requestId }),
				}
			}),
		)
	}
}
