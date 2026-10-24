import type { RevalidateBody } from 'types/components/client'

import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'node:crypto'

// Only these cache tags can be cleared, so the endpoint cannot be used to purge arbitrary caches.
const CONTENT_TAGS = new Set([
	'home',
	'about',
	'experience',
	'education',
	'projects',
	'skills',
	'services',
	'resume',
	'socials',
	'metadata',
])

const digest = (value: string) => createHash('sha256').update(value).digest()

const isAuthorized = (provided: string | null): boolean => {
	const secret = process.env.REVALIDATE_SECRET

	if (!secret || !provided) return false

	// Hashing first gives both sides the same length, which timingSafeEqual requires, and the
	// constant-time compare does not leak how much of the secret matched.
	return timingSafeEqual(digest(provided), digest(secret))
}

export const POST = async (req: Request) => {
	if (!isAuthorized(req.headers.get('x-revalidate-secret')))
		return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })

	const body = (await req.json().catch(() => null)) as RevalidateBody | null

	const tags = Array.isArray(body?.tags)
		? body.tags.filter((tag): tag is string => typeof tag === 'string' && CONTENT_TAGS.has(tag))
		: []

	if (tags.length === 0)
		return NextResponse.json({ success: false, message: 'No known tags given.' }, { status: 400 })

	// expire: 0 drops the entries immediately, so the next visitor gets fresh content.
	for (const tag of tags) revalidateTag(tag, { expire: 0 })

	return NextResponse.json({ success: true, revalidated: tags })
}
