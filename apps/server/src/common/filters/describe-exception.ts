import type { DescribedError } from 'types/server'

import { Prisma } from '@repo/prisma'
import { HttpException, HttpStatus } from '@nestjs/common'

const FALLBACK = 'Internal Server Error'
const UNEXPECTED = 'An unexpected error occurred. Please try again later.'

export const toMessage = (raw: unknown): string =>
	Array.isArray(raw) ? raw.join(', ') : typeof raw === 'string' ? raw : FALLBACK

const PRISMA_ERRORS: Record<string, DescribedError> = {
	P2025: {
		status: HttpStatus.NOT_FOUND,
		rawMessage: 'Record not found in database',
		clientMessage: 'Requested record was not found.',
	},
	P2003: {
		status: HttpStatus.BAD_REQUEST,
		rawMessage: 'Foreign key constraint violated',
		clientMessage: 'Referenced entity does not exist.',
	},
	P2014: {
		status: HttpStatus.BAD_REQUEST,
		rawMessage: 'Required relation constraint violated',
		clientMessage: 'Required relational dependency missing.',
	},
}

// Each error gets a raw message for the logs and a safe client message for the response.
const describeHttp = (exception: HttpException): DescribedError => {
	const body = exception.getResponse()
	const rawMessage =
		typeof body === 'object' && body !== null
			? ((body as Record<string, unknown>).message ?? (body as Record<string, unknown>).error)
			: body

	return { status: exception.getStatus(), rawMessage, clientMessage: toMessage(rawMessage) }
}

const describePrisma = (exception: Prisma.PrismaClientKnownRequestError): DescribedError => {
	if (exception.code === 'P2002') {
		const target = exception.meta?.target
		const fields = Array.isArray(target) ? (target as string[]).join(', ') : 'field'

		return {
			status: HttpStatus.CONFLICT,
			rawMessage: `Unique constraint violation on ${fields}`,
			clientMessage: `A conflict occurred: record with this ${fields} already exists.`,
		}
	}

	return (
		PRISMA_ERRORS[exception.code] ?? {
			status: HttpStatus.BAD_REQUEST,
			rawMessage: `Prisma error ${exception.code}: ${exception.message}`,
			clientMessage: 'Database request could not be completed.',
		}
	)
}

export const describeException = (exception: unknown, production: boolean): DescribedError => {
	if (exception instanceof HttpException) return describeHttp(exception)

	if (exception instanceof Prisma.PrismaClientKnownRequestError) return describePrisma(exception)

	if (exception instanceof Prisma.PrismaClientValidationError)
		return {
			status: HttpStatus.BAD_REQUEST,
			rawMessage: exception.message,
			clientMessage: 'Invalid database query parameters.',
		}

	const rawMessage = exception instanceof Error ? exception.message : FALLBACK

	return {
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		rawMessage,
		// Unknown errors can carry internals, so production responses use a generic message.
		clientMessage: production ? UNEXPECTED : toMessage(rawMessage),
	}
}
