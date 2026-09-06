import type { Request, Response } from 'express'
import type { ApiResponse } from 'common/interfaces/api-response.interface'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { Injectable } from '@nestjs/common'
import { RESPONSE_MESSAGE_KEY } from 'common/decorators/message.decorator'

const messages: Record<string, string> = {
	GET: 'Data fetched successfully.',
	POST: 'Created successfully.',
	PUT: 'Updated successfully.',
	PATCH: 'Updated successfully.',
	DELETE: 'Deleted successfully.',
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<unknown>> {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<unknown>> {
		const httpContext = context.switchToHttp()
		const request = httpContext.getRequest<Request>()
		const response = httpContext.getResponse<Response>()

		const customMessage = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		const defaultMessage = messages[request.method] ?? 'Request successful.'

		return next.handle().pipe(
			map(data => {
				// Don't format raw buffer/stream responses (e.g. downloads)
				const contentType = response.getHeader('content-type')?.toString() || ''

				if (
					response.headersSent ||
					Buffer.isBuffer(data) ||
					(data && typeof data === 'object' && 'stream' in data) ||
					contentType.includes('application/pdf')
				)
					return data as unknown as ApiResponse<unknown>

				const statusCode = response.statusCode || 200
				const ip = request.context?.ip || request.ip
				const requestId = request.requestId
				const timestamp = new Date().toISOString()
				const endpoint = `${request.method} ${request.originalUrl}`

				let result: unknown
				let hasResult = false
				let count: number | undefined
				let message = customMessage ?? defaultMessage
				let isError: boolean | undefined

				// If data is already an object containing result/message
				if (data && typeof data === 'object' && ('result' in data || 'message' in data)) {
					const record = data as Record<string, unknown>

					if ('message' in record && typeof record.message === 'string') message = record.message

					if ('error' in record && typeof record.error === 'boolean') isError = record.error

					if ('count' in record && typeof record.count === 'number') count = record.count

					if ('result' in record) {
						result = record.result
						hasResult = true
					}
				} else {
					result = data
					hasResult = data !== undefined
				}

				// Handle pagination/data object wrappers if returned by controllers
				if (!hasResult && data && typeof data === 'object') {
					const record = data as Record<string, unknown>

					if ('data' in record && 'pagination' in record) {
						result = record.data
						hasResult = true
						const pagination = record.pagination as { total?: number }
						count =
							pagination?.total ?? (Array.isArray(record.data) ? record.data.length : undefined)
					} else if ('data' in record && Object.keys(record).length <= 3) {
						result = record.data
						hasResult = true
						count =
							'count' in record && typeof record.count === 'number'
								? record.count
								: Array.isArray(record.data)
									? record.data.length
									: undefined
					} else if ('items' in record) {
						result = record.items
						hasResult = true
						count =
							'total' in record && typeof record.total === 'number'
								? record.total
								: Array.isArray(record.items)
									? record.items.length
									: undefined
					}
				}

				if (count === undefined && Array.isArray(result)) count = result.length

				const formatted: ApiResponse<unknown> = { message, statusCode, timestamp, endpoint }

				if (hasResult && result !== undefined) formatted.result = result

				if (isError !== undefined) formatted.error = isError

				if (count !== undefined) formatted.count = count

				if (ip) formatted.ip = ip

				if (requestId) formatted.requestId = requestId

				return formatted
			}),
		)
	}
}
