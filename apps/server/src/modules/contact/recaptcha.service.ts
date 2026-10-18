import type { RecaptchaVerifyResponse } from 'types/server'

import { Configuration } from 'config/configuration'
import { LoggerService } from 'common/logger/logger.service'
import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common'

export const RECAPTCHA_ACTION = 'contact_form_submit'

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

@Injectable()
export class RecaptchaService {
	constructor(
		private readonly config: Configuration,
		private readonly logger: LoggerService,
	) {}

	async verify(token: string | undefined, ipAddress?: string): Promise<void> {
		const { recaptcha } = this.config

		// reCAPTCHA is only configured in production; Configuration requires it there.
		if (!recaptcha) return

		if (!token) throw new BadRequestException('reCAPTCHA token is missing')

		let result: RecaptchaVerifyResponse

		try {
			const response = await fetch(VERIFY_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					secret: recaptcha.secretKey,
					response: token,
					...(ipAddress && { remoteip: ipAddress }),
				}),
				signal: AbortSignal.timeout(5_000),
			})

			if (!response.ok) throw new Error(`HTTP ${response.status}`)

			result = (await response.json()) as RecaptchaVerifyResponse
		} catch (error) {
			this.logger.error(
				'reCAPTCHA verification unavailable',
				RecaptchaService.name,
				error instanceof Error ? error : new Error(String(error)),
			)

			// Fail closed: if Google cannot be reached, reject the submission rather than skip the check.
			throw new ServiceUnavailableException('Spam check is unavailable, please try again later')
		}

		const passed =
			result.success &&
			// Checking the action stops a token issued for another form on the site from being reused here.
			result.action === RECAPTCHA_ACTION &&
			(result.score ?? 0) >= recaptcha.minScore

		if (!passed) {
			this.logger.warn('Rejected contact submission that failed reCAPTCHA', RecaptchaService.name, {
				ipAddress,
				score: result.score,
				action: result.action,
				errors: result['error-codes'],
			})

			throw new BadRequestException('reCAPTCHA verification failed')
		}
	}
}
