import { NextResponse } from 'next/server'
import { getApiBaseUrl } from '../../../lib/api-client'
import { validateContactForm, type ContactFormPayload } from '../../../lib/contact-data'

export async function POST(req: Request) {
	try {
		const body: ContactFormPayload = await req.json()

		// 1. Strict input validation
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

		// 2. Anti-spam Honeypot Check
		// If automated bots fill the invisible 'url' field, succeed silently without hitting backend
		if (body.url && body.url.trim().length > 0) {
			return NextResponse.json({
				success: true,
				message: 'Thank you for reaching out. Your message has been received.',
			})
		}

		// 3. Connect to Authoritative Backend Contact Endpoint
		const apiUrl = getApiBaseUrl()

		try {
			const backendRes = await fetch(`${apiUrl}/api/v1/contacts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': req.headers.get('user-agent') || 'apps/client',
					'X-Forwarded-For': req.headers.get('x-forwarded-for') || '127.0.0.1',
				},
				body: JSON.stringify({
					name: body.name.trim(),
					email: body.email.trim(),
					subject: body.subject.trim(),
					message: body.message.trim(),
					source: 'website',
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
			// Backend service unreachable during local build, offline test, or maintenance
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
