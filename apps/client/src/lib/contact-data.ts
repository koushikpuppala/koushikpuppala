import type { ContactFormPayload, ContactValidation, ContactValidationErrors } from 'types/api'

export const validateContactForm = (payload: ContactFormPayload): ContactValidation => {
	const errors: ContactValidationErrors = {}
	const name = (payload.name || '').trim()
	const email = (payload.email || '').trim()
	const subject = (payload.subject || '').trim()
	const message = (payload.message || '').trim()

	if (!name) errors.name = 'Please provide your name or organization.'
	else if (name.length < 2) errors.name = 'Name must be at least 2 characters.'
	else if (name.length > 100) errors.name = 'Name cannot exceed 100 characters.'

	// Each part excludes the character that ends it, so there is only one way to match and the check
	// stays linear (an overlapping pattern backtracks badly on input like '!@!.!.!.').
	const emailRegex = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

	if (!email) errors.email = 'Please provide a return email address.'
	else if (email.length > 254 || !emailRegex.test(email))
		errors.email = 'Please enter a valid email address (e.g. name@domain.com).'

	const resolvedSubject = subject || 'Portfolio Inquiry'

	if (resolvedSubject.length < 3) errors.subject = 'Subject must be at least 3 characters.'
	else if (resolvedSubject.length > 200) errors.subject = 'Subject cannot exceed 200 characters.'

	if (!message) errors.message = 'Please provide a message body.'
	else if (message.length < 10) errors.message = 'Message must be at least 10 characters.'
	else if (message.length > 5000) errors.message = 'Message cannot exceed 5,000 characters.'

	return { isValid: Object.keys(errors).length === 0, errors }
}
