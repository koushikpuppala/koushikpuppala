import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { BASE_URL } from 'constants/base-url'

export const proxy = async (request: NextRequest) => {
	if (!request.headers.get('accept')?.includes('text/html')) return NextResponse.next()

	const slug = request.nextUrl.pathname.split('/')[2]

	if (!slug) return NextResponse.next()

	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/projects/published/${encodeURIComponent(slug)}`,
			{ method: 'HEAD', signal: AbortSignal.timeout(2_000) },
		)

		if (response.status === 404)
			return NextResponse.rewrite(new URL('/_project-not-found', request.url), { status: 404 })
	} catch {}

	return NextResponse.next()
}

export const config = {
	matcher: '/projects/:slug',
}
