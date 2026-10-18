import type { ContactFormPayload } from 'types/api'
import { NextResponse } from 'next/server'
import { BASE_URL } from '../../../src/constants/base-url'
import { validateContactForm } from '../../../src/lib/contact-data'

export const POST = async (req: Request) => {
	try {
		const rawBody = await req.json()
		const body: ContactFormPayload = {
			...rawBody,
			name: (rawBody.name || '').trim(),
			email: (rawBody.email || '').trim(),
			subject: (rawBody.subject || '').trim() || 'Portfolio Inquiry',
			message: (rawBody.message || '').trim(),
		}

		const { isValid, errors } = validateContactForm(body)
		if (!isValid) {
			return NextResponse.json(
				{
					success: false,
					message: 'Input validation failed. Please check the submitted fields.',
					errors,
				},
				{ status: 400 },
			)
		}

		// Honeypot field: bots that fill it get a normal success reply, and nothing is sent to the API.
		if (body.url && body.url.trim().length > 0) {
			return NextResponse.json({
				success: true,
				message: 'Thank you for reaching out. Your message has been received.',
			})
		}

		const apiUrl = BASE_URL

		// The last address is the one added by our own proxy; earlier entries can be forged by the client.
		// It is forwarded so the API rate-limits and verifies reCAPTCHA against the visitor, not this server.
		const clientIp = req.headers.get('x-forwarded-for')?.split(',').pop()?.trim()

		try {
			const backendRes = await fetch(`${apiUrl}/api/v1/contacts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': req.headers.get('user-agent') || 'apps/client',
					...(clientIp && { 'X-Forwarded-For': clientIp }),
				},
				body: JSON.stringify({
					name: body.name.trim(),
					email: body.email.trim(),
					subject: body.subject.trim(),
					message: body.message.trim(),
					source: 'website',
					...(typeof body.recaptchaToken === 'string' && { recaptchaToken: body.recaptchaToken }),
				}),
			})

			const data = await backendRes.json().catch(() => null)

			if (backendRes.ok) {
				return NextResponse.json(
					data || {
						success: true,
						message: 'Thank you for reaching out. Your message has been received.',
					},
					{ status: 201 },
				)
			}

			return NextResponse.json(
				{
					success: false,
					message:
						data?.message ||
						'The backend was unable to register your submission. Please try again.',
				},
				{ status: backendRes.status },
			)
		} catch {
			return NextResponse.json(
				{
					success: false,
					message:
						'The dispatch terminal could not connect to the backend service. Please reach out directly to koushikpuppala@koushikpuppala.com.',
				},
				{ status: 503 },
			)
		}
	} catch {
		return NextResponse.json(
			{
				success: false,
				message: 'Malformed request payload received.',
			},
			{ status: 400 },
		)
	}
}
