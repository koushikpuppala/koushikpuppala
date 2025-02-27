import { ServerActionResponse } from '@import/types'
import { RESPONSE_CODES } from '@import/enums'
import { logger } from './logger'

export class Result<T> implements ServerActionResponse<T> {
	error: boolean
	code: RESPONSE_CODES
	message: string
	result: T | undefined

	constructor(error: boolean, code: RESPONSE_CODES, message: string, result?: T) {
		this.error = error
		this.code = code
		this.message = message
		this.result = result

		this.logResult()
	}

	private logResult = () =>
		this.error
			? logger.error(
					`Result created: ${this.message}`,
					'Result',
					{ name: this.constructor.name, message: this.message },
					{ error: this.error, code: this.code, message: this.message, result: this.result },
				)
			: logger.info(`Result created: ${this.message}`, 'Result', {
					error: this.error,
					code: this.code,
					message: this.message,
					result: this.result,
				})

	static success: <T>(message: string, result?: T) => Result<T> = (message, result) =>
		new Result(false, RESPONSE_CODES.SUCCESS, message, result)

	static created: <T>(message: string, result?: T) => Result<T> = (message, result) =>
		new Result(false, RESPONSE_CODES.CREATED, message, result)

	static noContent: <T>(message: string) => Result<T> = message =>
		new Result(false, RESPONSE_CODES.NO_CONTENT, message)

	static badRequest: <T>(message: string) => Result<T> = message =>
		new Result(true, RESPONSE_CODES.BAD_REQUEST, message)

	static unauthorized: <T>(message: string) => Result<T> = message =>
		new Result(true, RESPONSE_CODES.UNAUTHORIZED, message)

	static forbidden: <T>(message: string) => Result<T> = message => new Result(true, RESPONSE_CODES.FORBIDDEN, message)

	static notFound: <T>(message: string) => Result<T> = message => new Result(true, RESPONSE_CODES.NOT_FOUND, message)

	static conflict: <T>(message: string) => Result<T> = message => new Result(true, RESPONSE_CODES.CONFLICT, message)

	static internalServerError: <T>(message: string) => Result<T> = message =>
		new Result(true, RESPONSE_CODES.INTERNAL_SERVER_ERROR, message)
}
