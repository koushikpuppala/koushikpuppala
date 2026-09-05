export interface ContactFormPayload {
	name: string
	email: string
	subject: string
	message: string
	url?: string
	source?: string
}

export interface ContactValidationErrors {
	name?: string
	email?: string
	subject?: string
	message?: string
	general?: string
}

export interface ContactSubmissionResult {
	success: boolean
	message: string
	id?: string
	errors?: ContactValidationErrors
}

export interface DirectChannel {
	id: string
	platform: string
	label: string
	handle: string
	url: string
	type: 'email' | 'link'
	featured: boolean
	description: string
}

export interface ContactTelemetry {
	responseTime: string
	timezone: string
	location: string
	status: string
	encryption: string
}

/**
 * Authoritative Direct Communication Channels
 * Based on verified contact records from database seed and production configurations.
 */
export const DIRECT_CHANNELS: DirectChannel[] = [
	{
		id: 'email',
		platform: 'EMAIL',
		label: 'Official Email Transmission',
		handle: 'koushikpuppala@koushikpuppala.com',
		url: 'mailto:koushikpuppala@koushikpuppala.com',
		type: 'email',
		featured: true,
		description:
			'Direct channel for software architecture advisory, engineering roles, and inquiries.',
	},
	{
		id: 'linkedin',
		platform: 'LINKEDIN',
		label: 'Professional Network',
		handle: 'linkedin.com/in/koushikpuppala',
		url: 'https://linkedin.com/in/koushikpuppala',
		type: 'link',
		featured: true,
		description: 'Career milestones, engineering leadership, and institutional updates.',
	},
	{
		id: 'github',
		platform: 'GITHUB',
		label: 'Source Code Repositories',
		handle: 'github.com/koushikpuppala',
		url: 'https://github.com/koushikpuppala',
		type: 'link',
		featured: true,
		description:
			'Open source contributions, distributed systems experiments, and full-stack projects.',
	},
	{
		id: 'discord',
		platform: 'DISCORD',
		label: 'Developer Community & Direct',
		handle: 'koushikpuppala (ID: 735813371433058354)',
		url: 'https://discordapp.com/users/735813371433058354',
		type: 'link',
		featured: false,
		description: 'Real-time developer discourse and Discord community spaces.',
	},
]

export const CONTACT_TELEMETRY: ContactTelemetry = {
	responseTime: '< 24 Hours',
	timezone: 'IST (UTC+5:30) • Bengaluru / Raichur',
	location: 'Bengaluru & Raichur, India',
	status: 'AVAILABLE FOR SELECT ROLES',
	encryption: '256-BIT TLS ENCRYPTED',
}

/**
 * Client-side validation strictly aligned with backend CreateContactDto
 */
export function validateContactForm(payload: ContactFormPayload): {
	isValid: boolean
	errors: ContactValidationErrors
} {
	const errors: ContactValidationErrors = {}
	const name = (payload.name || '').trim()
	const email = (payload.email || '').trim()
	const subject = (payload.subject || '').trim()
	const message = (payload.message || '').trim()

	// 1. Name validation (min 2, max 100)
	if (!name) {
		errors.name = 'Please provide your name or organization.'
	} else if (name.length < 2) {
		errors.name = 'Name must be at least 2 characters.'
	} else if (name.length > 100) {
		errors.name = 'Name cannot exceed 100 characters.'
	}

	// 2. Email validation (RFC standard regex)
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!email) {
		errors.email = 'Please provide a return email address.'
	} else if (!emailRegex.test(email)) {
		errors.email = 'Please enter a valid email address (e.g. name@domain.com).'
	}

	// 3. Subject validation (min 3, max 200)
	if (!subject) {
		errors.subject = 'Please provide an inquiry subject.'
	} else if (subject.length < 3) {
		errors.subject = 'Subject must be at least 3 characters.'
	} else if (subject.length > 200) {
		errors.subject = 'Subject cannot exceed 200 characters.'
	}

	// 4. Message validation (min 10, max 5000)
	if (!message) {
		errors.message = 'Please provide a message body.'
	} else if (message.length < 10) {
		errors.message = 'Message must be at least 10 characters.'
	} else if (message.length > 5000) {
		errors.message = 'Message cannot exceed 5,000 characters.'
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	}
}

/**
 * Submits the contact inquiry payload to the API handler
 */
export async function submitContactInquiry(
	payload: ContactFormPayload,
): Promise<ContactSubmissionResult> {
	// First run client validation
	const { isValid, errors } = validateContactForm(payload)
	if (!isValid) {
		return {
			success: false,
			message: 'Please resolve the highlighted validation issues before transmitting.',
			errors,
		}
	}

	try {
		const res = await fetch('/api/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})

		const data = await res.json().catch(() => null)

		if (res.ok && data?.success !== false) {
			return {
				success: true,
				message: data?.message || 'Inquiry successfully transmitted to the server inbox.',
				id: data?.id,
			}
		}

		return {
			success: false,
			message:
				data?.message ||
				'Server encountered an issue processing your dispatch. Please try again or reach out directly.',
			errors: data?.errors,
		}
	} catch {
		return {
			success: false,
			message:
				'Unable to connect to the dispatch terminal. Please verify your connection or email directly at koushikpuppala@koushikpuppala.com.',
		}
	}
}
