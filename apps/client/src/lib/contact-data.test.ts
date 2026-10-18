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

describe('validateContactForm', () => {
	it('passes a complete message with no errors, defaulting the subject', () => {
		expect(
			validateContactForm({
				name: ' Ada ',
				email: 'ada@example.com',
				subject: '',
				message: 'A message long enough.',
			}),
		).toEqual({ isValid: true, errors: {} })
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
