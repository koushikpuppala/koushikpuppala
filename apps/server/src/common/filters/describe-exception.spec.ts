import { Prisma } from '@repo/prisma'
import { BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { describe, expect, it } from 'vitest'
import { describeException, toMessage } from './describe-exception'

const known = (code: string, meta?: Record<string, unknown>) =>
	new Prisma.PrismaClientKnownRequestError('prisma failed', { code, clientVersion: 'test', meta })

describe('toMessage', () => {
	it('joins validation arrays, keeps strings and falls back otherwise', () => {
		expect(toMessage(['a', 'b'])).toBe('a, b')
		expect(toMessage('plain')).toBe('plain')
		expect(toMessage({})).toBe('Internal Server Error')
	})
})

describe('describeException', () => {
	it('uses the status and message of an HTTP exception', () => {
		expect(describeException(new NotFoundException('Missing'), true)).toEqual({
			status: 404,
			rawMessage: 'Missing',
			clientMessage: 'Missing',
		})
	})

	it('joins validation messages and reads string or error bodies', () => {
		expect(describeException(new BadRequestException(['a is bad', 'b is bad']), true).clientMessage).toBe(
			'a is bad, b is bad',
		)
		expect(describeException(new HttpException('Teapot', 418), true)).toMatchObject({ status: 418, clientMessage: 'Teapot' })
		expect(describeException(new HttpException({ error: 'Gone' }, 410), true).clientMessage).toBe('Gone')
	})

	it('explains a unique constraint conflict with its fields', () => {
		expect(describeException(known('P2002', { target: ['slug', 'title'] }), true)).toEqual({
			status: HttpStatus.CONFLICT,
			rawMessage: 'Unique constraint violation on slug, title',
			clientMessage: 'A conflict occurred: record with this slug, title already exists.',
		})
		expect(describeException(known('P2002'), true).clientMessage).toContain('this field already')
	})

	it.each([
		['P2025', HttpStatus.NOT_FOUND, 'Requested record was not found.'],
		['P2003', HttpStatus.BAD_REQUEST, 'Referenced entity does not exist.'],
		['P2014', HttpStatus.BAD_REQUEST, 'Required relational dependency missing.'],
		['P9999', HttpStatus.BAD_REQUEST, 'Database request could not be completed.'],
	])('maps Prisma %s to a safe message', (code, status, clientMessage) => {
		expect(describeException(known(code), true)).toMatchObject({ status, clientMessage })
	})

	it('hides query validation details', () => {
		const error = new Prisma.PrismaClientValidationError('Unknown arg `x`', { clientVersion: 'test' })

		expect(describeException(error, false)).toMatchObject({ status: 400, clientMessage: 'Invalid database query parameters.' })
	})

	it('hides unexpected errors in production only', () => {
		const error = new Error('secret internals')

		expect(describeException(error, true)).toEqual({
			status: 500,
			rawMessage: 'secret internals',
			clientMessage: 'An unexpected error occurred. Please try again later.',
		})
		expect(describeException(error, false).clientMessage).toBe('secret internals')
		expect(describeException('thrown string', false).rawMessage).toBe('Internal Server Error')
	})
})
