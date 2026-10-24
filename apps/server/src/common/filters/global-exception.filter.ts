import type { Request, Response } from 'express'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { ApiResponse } from '../interfaces/api-response.interface'

import { Catch, HttpException } from '@nestjs/common'
import { Configuration } from 'config/configuration'
import { LoggerService } from '../logger/logger.service'
import { describeException, toMessage } from './describe-exception'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerService,
		private readonly config: Configuration,
	) {}

	catch(exception: unknown, host: ArgumentsHost) {
		const http = host.switchToHttp()
		const request = http.getRequest<Request>()
		const response = http.getResponse<Response>()

		const { status, rawMessage, clientMessage } = describeException(
			exception,
			this.config.production,
		)
		const message = toMessage(rawMessage)

		const fields = {
			ip: request.context?.ip || request.ip,
			status,
			method: request.method,
			endpoint: request.originalUrl,
			requestId: request.requestId,
			userId: request.user?.id,
		}

		// Server errors go to Sentry through logger.error; client errors are only warnings.
		if (status >= 500)
			this.logger.error(
				message,
				GlobalExceptionFilter.name,
				exception instanceof Error ? exception : undefined,
				fields,
			)
		else
			this.logger.warn(message, GlobalExceptionFilter.name, {
				...fields,
				errors: exception instanceof HttpException ? exception.getResponse() : message,
			})

		const payload: ApiResponse<undefined> = {
			error: true,
			statusCode: status,
			message: clientMessage,
			requestId: request.requestId,
			timestamp: new Date().toISOString(),
			endpoint: `${request.method} ${request.originalUrl}`,
		}

		response.status(status).json(payload)
	}
}
