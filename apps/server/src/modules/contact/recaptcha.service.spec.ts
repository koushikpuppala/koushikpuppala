import type { Configuration } from 'config/configuration'
import type { LoggerService } from 'common/logger/logger.service'

import { BadRequestException, ServiceUnavailableException } from '@nestjs/common'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { RECAPTCHA_ACTION, RecaptchaService } from './recaptcha.service'

const logger = { warn: vi.fn(), error: vi.fn() } as unknown as LoggerService

const enabled = {
	recaptcha: { secretKey: 'secret', minScore: 0.5 },
} as unknown as Configuration

const google = (body: object, status = 200) =>
	(globalThis.fetch as Mock).mockResolvedValueOnce(Response.json(body, { status }))

describe('RecaptchaService', () => {
	let service: RecaptchaService

	beforeEach(() => {
		vi.spyOn(globalThis, 'fetch')
		service = new RecaptchaService(enabled, logger)
	})
	afterEach(() => vi.restoreAllMocks())

	it('skips the check when reCAPTCHA is off', async () => {
		await new RecaptchaService({} as Configuration, logger).verify(undefined)

		expect(globalThis.fetch).not.toHaveBeenCalled()
	})

	it('rejects a missing token without calling Google', async () => {
		await expect(service.verify(undefined)).rejects.toBeInstanceOf(BadRequestException)
		expect(globalThis.fetch).not.toHaveBeenCalled()
	})

	it('accepts a human score for the contact action and sends the secret and IP', async () => {
		google({ success: true, score: 0.9, action: RECAPTCHA_ACTION })

		await expect(service.verify('token', '203.0.113.9')).resolves.toBeUndefined()

		const [url, init] = (globalThis.fetch as Mock).mock.calls[0] ?? []
		expect(url).toBe('https://www.google.com/recaptcha/api/siteverify')
		expect(Object.fromEntries(init?.body as URLSearchParams)).toEqual({
			secret: 'secret',
			response: 'token',
			remoteip: '203.0.113.9',
		})
	})

	it.each([
		['a low score', { success: true, score: 0.1, action: RECAPTCHA_ACTION }],
		['another action', { success: true, score: 0.9, action: 'login' }],
		['an invalid token', { success: false, 'error-codes': ['invalid-input-response'] }],
	])('rejects %s', async (_, body) => {
		google(body)

		await expect(service.verify('token')).rejects.toBeInstanceOf(BadRequestException)
	})

	it('fails closed when Google is unreachable', async () => {
		;(globalThis.fetch as Mock).mockRejectedValueOnce(new TypeError('fetch failed'))

		await expect(service.verify('token')).rejects.toBeInstanceOf(ServiceUnavailableException)
	})
})
