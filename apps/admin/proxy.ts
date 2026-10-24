import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { requireEnv } from 'utils/requireEnv'

const origin = (url: string) => new URL(url).origin

// Built once: everything except the nonce comes from settings that are fixed for the life of the server.
const sources = (() => {
	const authDomain = requireEnv(
		process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
	)
	const bucket = requireEnv(process.env.S3_BUCKET, 'S3_BUCKET')
	const region = requireEnv(process.env.AWS_REGION, 'AWS_REGION')
	const emulator = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
	const sentryDsn = process.env.NEXT_PUBLIC_ADMIN_SENTRY_DSN

	const connect = [
		"'self'",
		origin(requireEnv(process.env.NEXT_PUBLIC_BASE_URL, 'NEXT_PUBLIC_BASE_URL')),
		'https://identitytoolkit.googleapis.com',
		'https://securetoken.googleapis.com',
		'https://www.googleapis.com',
		// Media uploads go straight to S3 through the presigned URL the API signs.
		`https://${bucket}.s3.${region}.amazonaws.com`,
	]
	const frame = [`https://${authDomain}`]

	if (emulator) {
		connect.push(`http://${emulator}`)
		frame.push(`http://${emulator}`)
	}

	// Production sends Sentry events through the same-origin /monitoring tunnel; elsewhere they go to the DSN.
	if (sentryDsn) connect.push(origin(sentryDsn))

	return { connect: connect.join(' '), frame: frame.join(' ') }
})()

// The studio holds signed-in editor sessions, so only scripts carrying this request's nonce may run.
// Next.js reads the nonce from the request's policy and adds it to its own scripts while rendering.
export const proxy = (request: NextRequest) => {
	const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

	// React's development build needs eval to rebuild server error stacks; production never does.
	const devEval = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''

	const policy = [
		"default-src 'self'",
		`script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://apis.google.com${devEval}`,
		"style-src 'self' 'unsafe-inline'",
		// Media renders through the image optimizer on this origin, which only fetches from the CDN.
		"img-src 'self' blob: data:",
		"font-src 'self' data:",
		`connect-src ${sources.connect}`,
		`frame-src ${sources.frame}`,
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'",
	].join('; ')

	const headers = new Headers(request.headers)
	headers.set('x-nonce', nonce)
	headers.set('Content-Security-Policy', policy)

	const response = NextResponse.next({ request: { headers } })
	response.headers.set('Content-Security-Policy', policy)

	return response
}

export const config = {
	matcher: [
		{
			source: '/((?!api|_next/static|_next/image|favicon.ico|monitoring).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
}
