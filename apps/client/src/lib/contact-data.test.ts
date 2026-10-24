import { describe, expect, it } from 'vitest'
import { validateContactForm } from 'lib/contact-data'

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

	it('accepts an address of exactly 254 characters and rejects one of 255', () => {
		const address = (length: number) => `${'a'.repeat(length - '@example.com'.length)}@example.com`

		expect(address(254)).toHaveLength(254)
		expect(withEmail(address(254)).errors.email).toBeUndefined()
		expect(withEmail(address(255)).errors.email).toBe(
			'Please enter a valid email address (e.g. name@domain.com).',
		)
	})

	it('stays fast on the input CodeQL flagged for backtracking', () => {
		const started = performance.now()
		withEmail(`!@!.${'!.'.repeat(50_000)}`)
		expect(performance.now() - started).toBeLessThan(100)
	})
})

describe('validateContactForm', () => {
	it('passes a complete message with no errors', () => {
		expect(
			validateContactForm({
				name: ' Ada ',
				email: 'ada@example.com',
				subject: 'Hello',
				message: 'A message long enough.',
			}),
		).toEqual({ isValid: true, errors: {} })
	})

	it('checks the subject it is given, leaving the default to the route', () => {
		expect(
			validateContactForm({
				name: 'Ada',
				email: 'ada@example.com',
				subject: '',
				message: 'A message long enough.',
			}).errors.subject,
		).toBe('Subject must be at least 3 characters.')
	})

	it('reports only failing fields, each with its first failing rule', () => {
		expect(
			validateContactForm({ name: '', email: 'ada@example.com', subject: 'Hi', message: 'short' }),
		).toEqual({
			isValid: false,
			errors: {
				name: 'Please provide your name or organization.',
				subject: 'Subject must be at least 3 characters.',
				message: 'Message must be at least 10 characters.',
			},
		})
	})
})
