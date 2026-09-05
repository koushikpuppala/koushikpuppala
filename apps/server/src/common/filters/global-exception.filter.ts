import type { Request, Response } from 'express'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { ApiResponse } from '../interfaces/api-response.interface'

import { LoggerService } from '../logger/logger.service'
import { Catch, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()

		const request = ctx.getRequest<Request>()
		const response = ctx.getResponse<Response>()

		const status =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

		const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null

		let rawMessage: unknown = null

		if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
			const resObj = exceptionResponse as Record<string, unknown>
			rawMessage = resObj.message ?? resObj.error
		} else if (typeof exceptionResponse === 'string') rawMessage = exceptionResponse

		if (!rawMessage)
			rawMessage = exception instanceof Error ? exception.message : 'Internal Server Error'

		const message = Array.isArray(rawMessage)
			? rawMessage.join(', ')
			: typeof rawMessage === 'string'
				? rawMessage
				: 'Internal Server Error'

		const ip = request.context?.ip || request.ip

		if (status >= 500)
			this.logger.error(
				message,
				GlobalExceptionFilter.name,
				exception instanceof Error ? exception : undefined,
				{ ip, status, request },
			)
		else {
			this.logger.warn(message, GlobalExceptionFilter.name, {
				ip,
				status,
				request,
				errors: exceptionResponse,
			})
		}

		// Security hardening: Never leak internal database/system errors or stack traces to clients on 500s
		const isHttpException = exception instanceof HttpException
		const isProduction = process.env.NODE_ENV === 'production'
		const clientMessage =
			status >= 500 && (!isHttpException || isProduction)
				? 'An unexpected error occurred. Please try again later.'
				: message

		const errorPayload: ApiResponse<undefined> = {
			ip,
			message: clientMessage,
			error: true,
			statusCode: status,
			requestId: request.requestId,
			timestamp: new Date().toISOString(),
			endpoint: `${request.method} ${request.originalUrl}`,
		}

		response.status(status).json(errorPayload)
	}
}
