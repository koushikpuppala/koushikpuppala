import { describe, expect, it } from 'vitest'
import { contactAcknowledgementEmail, contactNotificationEmail } from './contact.emails'

const contact = {
	id: '0198f0c2-6d4e-7c1a-9b3f-2a5d8e7f1c04',
	name: 'Ada <b>Lovelace</b>',
	email: 'ada@example.test',
	subject: 'Hello & welcome',
	message: 'Line one\n<script>alert(1)</script>',
	source: 'website',
	ipAddress: null,
	createdAt: new Date('2026-10-11T08:30:00Z'),
}

describe('contact emails', () => {
	it('gives the owner the submission and a link that opens it in the admin', () => {
		const email = contactNotificationEmail(contact, 'https://admin.example.test')

		expect(email.subject).toBe('New contact message: Hello & welcome')
		expect(email.text).toContain('Email: ada@example.test')
		expect(email.text).toContain('Line one\n<script>alert(1)</script>')
		expect(email.text).toContain(`https://admin.example.test/messages?id=${contact.id}`)
		expect(email.html).toContain(`href="https://admin.example.test/messages?id=${contact.id}"`)
	})

	it('escapes what the visitor typed in the HTML bodies', () => {
		const notification = contactNotificationEmail(contact, 'https://admin.example.test')
		const acknowledgement = contactAcknowledgementEmail(contact)

		expect(notification.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
		expect(notification.html).not.toContain('<script>')
		expect(acknowledgement.html).toContain('Hi Ada &lt;b&gt;Lovelace&lt;/b&gt;,')
	})

	it('acknowledges the visitor without repeating their message', () => {
		const email = contactAcknowledgementEmail(contact)

		expect(email.text).toContain('I have received your message and will reply soon.')
		expect(email.text).not.toContain('Line one')
	})
})
