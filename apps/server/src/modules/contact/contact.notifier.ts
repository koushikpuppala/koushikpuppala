import type { ContactEmailData, MailService, SendEmailOptions } from 'types/server'

import { Inject, Injectable } from '@nestjs/common'
import { Configuration } from 'config/configuration'
import { MAIL_SERVICE } from 'common/mail/mail.token'
import { LoggerService } from 'common/logger/logger.service'
import { contactAcknowledgementEmail, contactNotificationEmail } from './contact.emails'

const FAILURES = [
	'Failed to send contact notification email',
	'Failed to send contact acknowledgement email',
]

@Injectable()
export class ContactNotifier {
	constructor(
		private readonly config: Configuration,
		private readonly logger: LoggerService,
		@Inject(MAIL_SERVICE) private readonly mail: MailService,
	) {}

	async notify(contact: ContactEmailData): Promise<void> {
		const { mail } = this.config

		if (!mail) return

		const emails: SendEmailOptions[] = [
			{
				...contactNotificationEmail(contact, mail.adminUrl),
				from: mail.from,
				to: mail.contactTo,
				replyTo: contact.email,
			},
			{ ...contactAcknowledgementEmail(contact), from: mail.from, to: contact.email },
		]

		// The message is already saved, so a failed email is only logged and never fails the submission.
		const results = await Promise.allSettled(emails.map(email => this.mail.send(email)))

		for (const [index, result] of results.entries())
			if (result.status === 'rejected')
				this.logger.error(
					FAILURES[index] ?? 'Failed to send contact email',
					ContactNotifier.name,
					result.reason instanceof Error ? result.reason : new Error(String(result.reason)),
					{ contactId: contact.id },
				)
	}
}
