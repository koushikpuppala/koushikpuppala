import type { MailService, SendEmailOptions } from 'types/server'

import { Injectable } from '@nestjs/common'
import { Configuration } from 'config/configuration'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

@Injectable()
export class SesService implements MailService {
	private readonly ses: SESv2Client

	constructor(config: Configuration) {
		this.ses = new SESv2Client({ region: config.aws.region })
	}

	async send(options: SendEmailOptions): Promise<void> {
		await this.ses.send(
			new SendEmailCommand({
				FromEmailAddress: options.from,
				Destination: { ToAddresses: [options.to] },
				ReplyToAddresses: options.replyTo ? [options.replyTo] : undefined,
				Content: {
					Simple: {
						// Collapse newlines, which are not allowed in a subject header and could come from user input.
						Subject: { Data: options.subject.replace(/\s+/g, ' ').trim(), Charset: 'UTF-8' },
						Body: {
							Text: { Data: options.text, Charset: 'UTF-8' },
							Html: { Data: options.html, Charset: 'UTF-8' },
						},
					},
				},
			}),
		)
	}
}
