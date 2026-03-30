import type { NextRequest } from 'next/server'

import { revalidateTag } from 'next/cache'

const MAX_REQUESTS = 5 // Max 5 requests per IP per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

const requests = new Map<string, { count: number; ts: number }>()

const rateLimited = (ip: string) => {
	const now = Date.now()
	const entry = requests.get(ip)

	if (!entry || now - entry.ts > RATE_LIMIT_WINDOW_MS) {
		requests.set(ip, { count: 1, ts: now })
		return false
	}

	entry.count++
	return entry.count > MAX_REQUESTS
}

const parseTags = (input: string): string[] =>
	Array.from(
		new Set(
			input
				.split(',')
				.map(t => t.trim())
				.filter(Boolean),
		),
	)

const unauthorized = () =>
	Response.json({ success: false, now: Date.now(), message: 'Unauthorized' }, { status: 401 })

const handleRevalidate = async (
	tagsInput: string | null,
	immediate: boolean,
	request: NextRequest,
) => {
	const secret =
		request.headers.get('x-revalidate-secret') ?? request.nextUrl.searchParams.get('secret')

	if (secret !== process.env.REVALIDATE_SECRET) return unauthorized()

	const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

	if (rateLimited(ip))
		return Response.json(
			{ success: false, now: Date.now(), message: 'Too many requests' },
			{ status: 429 },
		)

	if (!tagsInput)
		return Response.json(
			{ success: false, now: Date.now(), message: 'Missing tag to revalidate' },
			{ status: 400 },
		)

	const tags = parseTags(tagsInput)

	if (!tags.length)
		return Response.json(
			{ success: false, now: Date.now(), message: 'Invalid tag(s)' },
			{ status: 400 },
		)

	for (const tag of tags) revalidateTag(tag, immediate ? { expire: 0 } : 'max')

	return Response.json(
		{
			success: true,
			now: Date.now(),
			message: immediate
				? `Immediate revalidation triggered for ${tags.join(', ')}`
				: `Revalidation triggered for ${tags.join(', ')}`,
		},
		{ status: 200 },
	)
}

export const GET = async (request: NextRequest) => {
	const tag = request.nextUrl.searchParams.get('tag')
	const immediate = request.nextUrl.searchParams.get('immediate') === 'true'

	return handleRevalidate(tag, immediate, request)
}

export const POST = async (request: NextRequest) => {
	const body = await request.json().catch(() => ({}))

	return handleRevalidate(body.tag ?? null, body.immediate === true, request)
}
