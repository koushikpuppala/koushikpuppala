import type {
	ContactFormPayload,
	ContactValidation,
	ContactValidationErrors,
	ValidationRule,
} from 'types/api'

// Each part excludes the character that ends it, so there is only one way to match and the check
// stays linear (an overlapping pattern backtracks badly on input like '!@!.!.!.').
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

const firstFailure = (rules: ValidationRule[]): string | undefined =>
	rules.find(([failed]) => failed)?.[1]

export const validateContactForm = (payload: ContactFormPayload): ContactValidation => {
	const name = (payload.name || '').trim()
	const email = (payload.email || '').trim()
	const subject = (payload.subject || '').trim() || 'Portfolio Inquiry'
	const message = (payload.message || '').trim()

	const failures: ContactValidationErrors = {
		name: firstFailure([
			[!name, 'Please provide your name or organization.'],
			[name.length < 2, 'Name must be at least 2 characters.'],
			[name.length > 100, 'Name cannot exceed 100 characters.'],
		]),
		email: firstFailure([
			[!email, 'Please provide a return email address.'],
			[
				email.length > 254 || !EMAIL.test(email),
				'Please enter a valid email address (e.g. name@domain.com).',
			],
		]),
		subject: firstFailure([
			[subject.length < 3, 'Subject must be at least 3 characters.'],
			[subject.length > 200, 'Subject cannot exceed 200 characters.'],
		]),
		message: firstFailure([
			[!message, 'Please provide a message body.'],
			[message.length < 10, 'Message must be at least 10 characters.'],
			[message.length > 5000, 'Message cannot exceed 5,000 characters.'],
		]),
	}

	const errors: ContactValidationErrors = Object.fromEntries(
		Object.entries(failures).filter(([, failure]) => failure),
	)

	return { isValid: Object.keys(errors).length === 0, errors }
}
