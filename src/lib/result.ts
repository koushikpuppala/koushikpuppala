import type { ServerActionResponse } from 'types/lib'

import { RESPONSE_CODES } from 'enums'
import { logger } from './logger'

export class Result<T> implements ServerActionResponse<T> {
	error: boolean
	code: RESPONSE_CODES
	message: string
	result: T | undefined
	totalCount?: number
	private functionName: string
	private errorStack?: Error

	constructor(
		error: boolean,
		code: RESPONSE_CODES,
		message: string,
		functionName: string,
		result?: T,
		totalCount?: number,
		errorStack?: Error,
	) {
		this.error = error
		this.code = code
		this.message = message
		this.result = result
		this.functionName = functionName
		this.errorStack = errorStack
		this.totalCount = totalCount

		this.logResult()
	}

	private logResult = () =>
		this.error
			? logger.error(this.message, this.functionName, this.errorStack, {
					error: this.error,
					code: this.code,
					message: this.message,
					result: this.result,
					totalCount: this.totalCount,
				})
			: logger.info(this.message, this.functionName, {
					error: this.error,
					code: this.code,
					message: this.message,
					result: this.result,
					totalCount: this.totalCount,
				})

	static success: <T>(
		message: string,
		functionName: string,
		result: T,
		totalCount?: number,
	) => Result<T> = (message, functionName, result, totalCount) =>
		new Result(false, RESPONSE_CODES.SUCCESS, message, functionName, result, totalCount)

	static created: <T>(message: string, functionName: string, result: T) => Result<T> = (
		message,
		functionName,
		result,
	) => new Result(false, RESPONSE_CODES.CREATED, message, functionName, result)

	static noContent: (message: string, functionName: string) => Result<undefined> = (
		message,
		functionName,
	) => new Result(false, RESPONSE_CODES.NO_CONTENT, message, functionName)

	static badRequest: (
		message: string,
		functionName: string,
		errorStack?: Error,
	) => Result<undefined> = (message, functionName, errorStack) =>
		new Result(
			true,
			RESPONSE_CODES.BAD_REQUEST,
			message,
			functionName,
			undefined,
			undefined,
			errorStack,
		)

	static unauthorized: (
		message: string,
		functionName: string,
		errorStack?: Error,
	) => Result<undefined> = (message, functionName, errorStack) =>
		new Result(
			true,
			RESPONSE_CODES.UNAUTHORIZED,
			message,
			functionName,
			undefined,
			undefined,
			errorStack,
		)

	static forbidden: (
		message: string,
		functionName: string,
		errorStack?: Error,
	) => Result<undefined> = (message, functionName, errorStack) =>
		new Result(
			true,
			RESPONSE_CODES.FORBIDDEN,
			message,
			functionName,
			undefined,
			undefined,
			errorStack,
		)

	static notFound: (
		message: string,
		functionName: string,
		errorStack?: Error,
	) => Result<undefined> = (message, functionName, errorStack) =>
		new Result(
			true,
			RESPONSE_CODES.NOT_FOUND,
			message,
			functionName,
			undefined,
			undefined,
			errorStack,
		)

	static conflict: (
		message: string,
		functionName: string,
		errorStack?: Error,
	) => Result<undefined> = (message, functionName, errorStack) =>
		new Result(
			true,
			RESPONSE_CODES.CONFLICT,
			message,
			functionName,
			undefined,
			undefined,
			errorStack,
		)

	static internalServerError: (
		message: string,
		functionName: string,
		errorStack?: Error,
	) => Result<undefined> = (message, functionName, errorStack) =>
		new Result(
			true,
			RESPONSE_CODES.INTERNAL_SERVER_ERROR,
			message,
			functionName,
			undefined,
			undefined,
			errorStack,
		)

	static serviceUnavailable: (
		message: string,
		functionName: string,
		errorStack?: Error,
	) => Result<undefined> = (message, functionName, errorStack) =>
		new Result(
			true,
			RESPONSE_CODES.SERVICE_UNAVAILABLE,
			message,
			functionName,
			undefined,
			undefined,
			errorStack,
		)
}
