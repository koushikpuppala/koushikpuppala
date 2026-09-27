import type { Request, Response } from 'express'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { ApiResponse } from '../interfaces/api-response.interface'

import { Prisma } from '@repo/prisma'
import { LoggerService } from '../logger/logger.service'
import { Catch, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()

		const request = ctx.getRequest<Request>()
		const response = ctx.getResponse<Response>()

		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let rawMessage: unknown = null

		let clientMessage = 'An unexpected error occurred. Please try again later.'

		if (exception instanceof HttpException) {
			status = exception.getStatus()

			const exceptionResponse = exception.getResponse()

			if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
				const resObj = exceptionResponse as Record<string, unknown>

				rawMessage = resObj.message ?? resObj.error
			} else if (typeof exceptionResponse === 'string') rawMessage = exceptionResponse

			clientMessage = Array.isArray(rawMessage)
				? rawMessage.join(', ')
				: typeof rawMessage === 'string'
					? rawMessage
					: 'Internal Server Error'
		} else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			switch (exception.code) {
				case 'P2002': {
					status = HttpStatus.CONFLICT

					const fields = Array.isArray(exception.meta?.target)
						? (exception.meta.target as string[]).join(', ')
						: 'field'

					rawMessage = `Unique constraint violation on ${fields}`

					clientMessage = `A conflict occurred: record with this ${fields} already exists.`
					break
				}
				case 'P2025': {
					status = HttpStatus.NOT_FOUND

					rawMessage = 'Record not found in database'

					clientMessage = 'Requested record was not found.'
					break
				}
				case 'P2003': {
					status = HttpStatus.BAD_REQUEST

					rawMessage = 'Foreign key constraint violated'

					clientMessage = 'Referenced entity does not exist.'
					break
				}
				case 'P2014': {
					status = HttpStatus.BAD_REQUEST

					rawMessage = 'Required relation constraint violated'

					clientMessage = 'Required relational dependency missing.'
					break
				}
				default: {
					status = HttpStatus.BAD_REQUEST

					rawMessage = `Prisma error ${exception.code}: ${exception.message}`

					clientMessage = 'Database request could not be completed.'
					break
				}
			}
		} else if (exception instanceof Prisma.PrismaClientValidationError) {
			status = HttpStatus.BAD_REQUEST

			rawMessage = exception.message

			clientMessage = 'Invalid database query parameters.'
		} else {
			rawMessage = exception instanceof Error ? exception.message : 'Internal Server Error'

			const isProduction = process.env.NODE_ENV === 'production'

			clientMessage = isProduction
				? 'An unexpected error occurred. Please try again later.'
				: typeof rawMessage === 'string'
					? rawMessage
					: 'Internal Server Error'
		}

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
		else
			this.logger.warn(message, GlobalExceptionFilter.name, {
				ip,
				status,
				request,
				errors: exception instanceof HttpException ? exception.getResponse() : message,
			})

		const errorPayload: ApiResponse<undefined> = {
			ip,
			error: true,
			statusCode: status,
			message: clientMessage,
			requestId: request.requestId,
			timestamp: new Date().toISOString(),
			endpoint: `${request.method} ${request.originalUrl}`,
		}

		response.status(status).json(errorPayload)
	}
}
