import { redact } from './logger.service'
import { describe, expect, it } from 'vitest'

describe('redact', () => {
	it('hides credentials at any depth', () => {
		const result = redact({
			headers: { authorization: 'Bearer abc', accept: 'application/json' },
			body: { email: 'a@b.c', password: 'hunter2', nested: { refreshToken: 't' } },
			FIREBASE_PRIVATE_KEY: 'pem',
		})

		expect(result).toEqual({
			headers: { authorization: '[Redacted]', accept: 'application/json' },
			body: { email: 'a@b.c', password: '[Redacted]', nested: { refreshToken: '[Redacted]' } },
			FIREBASE_PRIVATE_KEY: '[Redacted]',
		})
	})

	it('keeps ordinary values and arrays', () => {
		expect(redact({ requestId: 'r1', ids: [1, 2], status: 401 })).toEqual({
			requestId: 'r1',
			ids: [1, 2],
			status: 401,
		})
	})

	it('survives circular references', () => {
		const value: Record<string, unknown> = { name: 'loop' }
		value.self = value

		expect(redact(value)).toEqual({ name: 'loop', self: '[Truncated]' })
	})
})
