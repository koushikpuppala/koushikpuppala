import type { ContactPriority, ContactStatus } from '../enums/index'

export type ContactMessage = {
	id: string
	name: string
	email: string
	subject: string
	message: string
	url?: string | null
	source?: string | null
	status: ContactStatus
	priority: ContactPriority
	internalNotes?: string | null
	ipAddress?: string | null
	userAgent?: string | null
	createdAt: string
	updatedAt: string
}

export type ContactFormPayload = {
	name: string
	email: string
	subject: string
	message: string
	url?: string
	source?: string
	recaptchaToken?: string
}

export type ContactValidationErrors = {
	name?: string
	email?: string
	subject?: string
	message?: string
	general?: string
}

export type ValidationRule = [failed: boolean, message: string]

export type ContactValidation = {
	isValid: boolean
	errors: ContactValidationErrors
}

export type ContactReceipt = {
	id?: string
	timestamp: string
	name: string
	email: string
	subject: string
}

export type ContactFormFields = Pick<ContactFormPayload, 'name' | 'email' | 'subject' | 'message'>

export type ContactFieldErrors = Partial<Record<keyof ContactFormFields, string>>
