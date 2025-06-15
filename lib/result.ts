import { ServerActionResponse } from '@import/types'
import { RESPONSE_CODES } from '@import/enums'
import { logger } from './logger'

export class Result<T> implements ServerActionResponse<T> {
	error: boolean
	code: RESPONSE_CODES
	message: string
	result: T | undefined
	private functionName: string
	private errorStack?: Error

	constructor(
		error: boolean,
		code: RESPONSE_CODES,
		message: string,
		functionName: string,
		result?: T,
		errorStack?: Error,
	) {
		this.error = error
		this.code = code
		this.message = message
		this.result = result
		this.functionName = functionName
		this.errorStack = errorStack

		this.logResult()
	}

	private logResult = () =>
		this.error
			? logger.error(this.message, this.functionName, this.errorStack, {
					error: this.error,
					code: this.code,
					message: this.message,
					result: this.result,
				})
			: logger.info(this.message, this.functionName, {
					error: this.error,
					code: this.code,
					message: this.message,
					result: this.result,
				})

	static success: <T>(message: string, functionName: string, result: T) => Result<T> = (
		message,
		functionName,
		result,
	) => new Result(false, RESPONSE_CODES.SUCCESS, message, functionName, result)

	static created: <T>(message: string, functionName: string, result: T) => Result<T> = (
		message,
		functionName,
		result,
	) => new Result(false, RESPONSE_CODES.CREATED, message, functionName, result)

	static noContent: <T>(message: string, functionName: string, result: T) => Result<T> = (
		message,
		functionName,
		result,
	) => new Result(false, RESPONSE_CODES.NO_CONTENT, message, functionName, result)

	static badRequest: <T>(
		message: string,
		functionName: string,
		errorStack?: Error,
		result?: T,
	) => Result<T> = (message, functionName, errorStack, result) =>
		new Result(true, RESPONSE_CODES.BAD_REQUEST, message, functionName, result, errorStack)

	static unauthorized: <T>(
		message: string,
		functionName: string,
		errorStack?: Error,
		result?: T,
	) => Result<T> = (message, functionName, errorStack, result) =>
		new Result(true, RESPONSE_CODES.UNAUTHORIZED, message, functionName, result, errorStack)

	static forbidden: <T>(
		message: string,
		functionName: string,
		errorStack?: Error,
		result?: T,
	) => Result<T> = (message, functionName, errorStack, result) =>
		new Result(true, RESPONSE_CODES.FORBIDDEN, message, functionName, result, errorStack)

	static notFound: <T>(
		message: string,
		functionName: string,
		errorStack?: Error,
		result?: T,
	) => Result<T> = (message, functionName, errorStack, result) =>
		new Result(true, RESPONSE_CODES.NOT_FOUND, message, functionName, result, errorStack)

	static conflict: <T>(
		message: string,
		functionName: string,
		errorStack?: Error,
		result?: T,
	) => Result<T> = (message, functionName, errorStack, result) =>
		new Result(true, RESPONSE_CODES.CONFLICT, message, functionName, result, errorStack)

	static internalServerError: <T>(
		message: string,
		functionName: string,
		errorStack?: Error,
		result?: T,
	) => Result<T> = (message, functionName, errorStack, result) =>
		new Result(
			true,
			RESPONSE_CODES.INTERNAL_SERVER_ERROR,
			message,
			functionName,
			result,
			errorStack,
		)

	static serviceUnavailable: <T>(
		message: string,
		functionName: string,
		errorStack?: Error,
		result?: T,
	) => Result<T> = (message, functionName, errorStack, result) =>
		new Result(true, RESPONSE_CODES.SERVICE_UNAVAILABLE, message, functionName, result, errorStack)
}
