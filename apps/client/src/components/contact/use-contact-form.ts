'use client'

import type { ContactFieldErrors, ContactFormFields, ContactReceipt } from 'types/api'
import type { ContactField, ContactFormState, TopicOption } from 'types/components/client'
import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { useReCaptcha } from 'next-recaptcha-v3'
import { DEFAULT_SUBJECT } from 'constants/contact'
import { contactSchema, EMPTY_VALUES, RECAPTCHA_ACTION } from 'components/contact/contact-options'

const MIN_FILL_MS = 2500
const COPIED_MS = 2200
const ALL_TOUCHED = { name: true, email: true, subject: true, message: true }

const RECEIPT_TIME = {
	hour: 'numeric',
	minute: '2-digit',
	day: 'numeric',
	month: 'short',
} as const

const issuesByField = (values: ContactFormFields): ContactFieldErrors => {
	const parsed = contactSchema.safeParse(values)

	if (parsed.success) return {}

	const errors: ContactFieldErrors = {}

	for (const issue of parsed.error.issues) errors[issue.path[0] as ContactField] ??= issue.message

	return errors
}

const send = async (values: ContactFormFields, recaptchaToken: string | undefined) => {
	const res = await fetch('/api/contact', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...values, recaptchaToken }),
	})

	const data = await res.json().catch(() => null)

	if (!res.ok || data?.success === false)
		throw new Error(
			data?.message || `HTTP ${res.status}: The server was unable to register your dispatch.`,
		)

	return data
}

export const useContactForm = (): ContactFormState => {
	const { reCaptchaKey, executeRecaptcha } = useReCaptcha()
	const [values, setValues] = useState<ContactFormFields>(EMPTY_VALUES)
	const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
	const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null)
	const [errors, setErrors] = useState<ContactFieldErrors>({})
	const [receipt, setReceipt] = useState<ContactReceipt | null>(null)
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)
	const mountedAt = useRef(0)

	useEffect(() => {
		mountedAt.current = Date.now()
	}, [])

	const validate = (field: ContactField, next: ContactFormFields, force = false) => {
		if (!force && !touched[field]) return

		const issues = issuesByField({ ...next, subject: next.subject || DEFAULT_SUBJECT })
		setErrors(prev => ({ ...prev, [field]: issues[field] }))
	}

	const change = (field: ContactField, value: string) => {
		const next = { ...values, [field]: value }
		setValues(next)
		if (field !== 'subject') validate(field, next)
	}

	const blur = (field: ContactField) => {
		setTouched(prev => ({ ...prev, [field]: true }))
		validate(field, values, true)
	}

	const selectTopic = (topic: TopicOption) => {
		const deselect = selectedTopic?.id === topic.id

		setSelectedTopic(deselect ? null : topic)
		setValues(prev => ({ ...prev, subject: deselect ? '' : topic.subject }))
	}

	const copyDraft = async () => {
		const draft = `From: ${values.name} <${values.email}>\nSubject: ${values.subject || DEFAULT_SUBJECT}\n\n${values.message}`

		try {
			await navigator.clipboard.writeText(draft)
			setCopied(true)
			setTimeout(() => setCopied(false), COPIED_MS)
		} catch {}
	}

	const submit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSubmitError(null)

		// Hidden honeypot field; only bots fill it in.
		if (String(new FormData(event.currentTarget).get('company') ?? '')) return

		// A form submitted faster than a person could type is almost certainly a bot.
		if (Date.now() - mountedAt.current < MIN_FILL_MS) {
			setSubmitError('Please take a moment before submitting to ensure clean delivery.')
			return
		}

		const clean: ContactFormFields = {
			name: values.name.trim(),
			email: values.email.trim(),
			subject: values.subject.trim() || DEFAULT_SUBJECT,
			message: values.message.trim(),
		}
		const issues = issuesByField(clean)

		if (Object.keys(issues).length) {
			setErrors(issues)
			setTouched(ALL_TOUCHED)
			return
		}

		setErrors({})
		setLoading(true)

		try {
			// Without a site key (local development) no script loads and no token is sent.
			const token = reCaptchaKey
				? await executeRecaptcha(RECAPTCHA_ACTION).catch(() => {
						throw new Error(
							'The spam check could not load. Please disable blockers for this page or email me directly.',
						)
					})
				: undefined

			const data = await send(clean, token)

			setReceipt({
				id: data?.id,
				timestamp: new Date().toLocaleTimeString('en-US', RECEIPT_TIME),
				name: clean.name,
				email: clean.email,
				subject: clean.subject,
			})
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: 'The dispatch terminal could not connect to the backend service. You can use the direct email link below.',
			)
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setReceipt(null)
		setValues(EMPTY_VALUES)
		setSelectedTopic(null)
		setTouched({})
		setErrors({})
		setSubmitError(null)
	}

	return {
		values,
		change,
		blur,
		selectedTopic,
		selectTopic,
		errors,
		receipt,
		loading,
		submitError,
		copied,
		copyDraft,
		submit,
		reset,
		captcha: Boolean(reCaptchaKey),
	}
}
