import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { bootApp, resetState, type TestApp } from './helpers'

const message = {
	name: 'Ada Lovelace',
	email: 'ada@example.test',
	subject: 'Hello',
	message: 'I would like to talk about a project.',
}

describe('public contact form (e2e)', () => {
	let t: TestApp

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())
	beforeEach(async () => {
		t.ses.send.mockClear()
		await resetState(t.prisma)
	})

	const send = (ip: string, body: object = message) =>
		t.http().post('/api/v1/contacts').set('X-Forwarded-For', ip).send(body)

	it('stores a message with the sender IP', async () => {
		await send('203.0.113.1').expect(201)

		expect(await t.prisma.contact.findFirst()).toMatchObject({
			email: 'ada@example.test',
			ipAddress: '203.0.113.1',
		})
	})

	it('emails the owner a link to the message and acknowledges the sender', async () => {
		await send('203.0.113.5').expect(201)

		const stored = await t.prisma.contact.findFirstOrThrow()
		const [notification, acknowledgement] = t.ses.send.mock.calls.map(([email]) => email)

		expect(t.ses.send).toHaveBeenCalledTimes(2)
		expect(notification).toMatchObject({
			from: 'form@koushikpuppala.test',
			to: 'owner@koushikpuppala.test',
			replyTo: 'ada@example.test',
			subject: 'New contact message: Hello',
		})
		expect(notification?.text).toContain(`http://admin.test/messages?id=${stored.id}`)
		expect(notification?.text).toContain(message.message)
		expect(acknowledgement).toMatchObject({
			from: 'form@koushikpuppala.test',
			to: 'ada@example.test',
		})
		expect(acknowledgement?.text).not.toContain(message.message)
	})

	it('still stores the message when the emails cannot be sent', async () => {
		t.ses.send.mockRejectedValue(new Error('SES is down'))

		await send('203.0.113.6').expect(201)

		expect(await t.prisma.contact.count()).toBe(1)
		t.ses.send.mockReset()
	})

	it('silently drops honeypot submissions', async () => {
		await send('203.0.113.2', { ...message, url: 'http://spam.example' }).expect(201)

		expect(await t.prisma.contact.count()).toBe(0)
		expect(t.ses.send).not.toHaveBeenCalled()
	})

	it('limits each IP to 5 messages a minute', async () => {
		for (let i = 0; i < 5; i++) await send('203.0.113.3').expect(201)

		await send('203.0.113.3').expect(429)
		await send('203.0.113.4').expect(201)
	})
})
