import type { ContactFormPayload } from 'types/api'
import { NextResponse } from 'next/server'
import { BASE_URL } from '../../../src/constants/base-url'
import { validateContactForm } from '../../../src/lib/contact-data'

const RECEIVED = {
	success: true,
	message: 'Thank you for reaching out. Your message has been received.',
}

const failure = (message: string, status: number) =>
	NextResponse.json({ success: false, message }, { status })

// Throws on a body that isn't a JSON object or has non-string fields; POST answers that as malformed.
const readPayload = async (req: Request): Promise<ContactFormPayload> => {
	const raw = await req.json()

	return {
		...raw,
		name: (raw.name || '').trim(),
		email: (raw.email || '').trim(),
		subject: (raw.subject || '').trim() || 'Portfolio Inquiry',
		message: (raw.message || '').trim(),
	}
}

const forwardToApi = (req: Request, body: ContactFormPayload) => {
	// The last address is the one added by our own proxy; earlier entries can be forged by the client.
	// It is forwarded so the API rate-limits and verifies reCAPTCHA against the visitor, not this server.
	const clientIp = req.headers.get('x-forwarded-for')?.split(',').pop()?.trim()

	return fetch(`${BASE_URL}/api/v1/contacts`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': req.headers.get('user-agent') || 'apps/client',
			...(clientIp && { 'X-Forwarded-For': clientIp }),
		},
		body: JSON.stringify({
			name: body.name,
			email: body.email,
			subject: body.subject,
			message: body.message,
			source: 'website',
			...(typeof body.recaptchaToken === 'string' && { recaptchaToken: body.recaptchaToken }),
		}),
	})
}

const fromApiResponse = async (res: Response) => {
	const data = await res.json().catch(() => null)

	if (res.ok) return NextResponse.json(data || RECEIVED, { status: 201 })

	return failure(
		data?.message || 'The backend was unable to register your submission. Please try again.',
		res.status,
	)
}

export const POST = async (req: Request) => {
	let body: ContactFormPayload

	try {
		body = await readPayload(req)
	} catch {
		return failure('Malformed request payload received.', 400)
	}

	const { isValid, errors } = validateContactForm(body)

	if (!isValid)
		return NextResponse.json(
			{
				success: false,
				message: 'Input validation failed. Please check the submitted fields.',
				errors,
			},
			{ status: 400 },
		)

	// Honeypot field: bots that fill it get a normal success reply, and nothing is sent to the API.
	if (typeof body.url === 'string' && body.url.trim()) return NextResponse.json(RECEIVED)

	try {
		return await fromApiResponse(await forwardToApi(req, body))
	} catch {
		return failure(
			'The dispatch terminal could not connect to the backend service. Please reach out directly to koushikpuppala@koushikpuppala.com.',
			503,
		)
	}
}
