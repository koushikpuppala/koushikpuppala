import { describe, expect, it } from 'vitest'
import { validateContactForm } from './contact-data'

const withEmail = (email: string) =>
	validateContactForm({ name: 'Ada', email, subject: 'Hello', message: 'A message long enough.' })

describe('validateContactForm email check', () => {
	it.each(['ada@example.com', 'ada.lovelace+cv@mail.example.co.in'])('accepts %s', email => {
		expect(withEmail(email).errors.email).toBeUndefined()
	})

	it.each(['ada', 'ada@example', 'ada@@example.com', 'ada@example..com', 'ada @example.com'])(
		'rejects %s',
		email => {
			expect(withEmail(email).errors.email).toBeDefined()
		},
	)

	it('stays fast on the input CodeQL flagged for backtracking', () => {
		const started = performance.now()
		withEmail(`!@!.${'!.'.repeat(50_000)}`)
		expect(performance.now() - started).toBeLessThan(100)
	})
})
