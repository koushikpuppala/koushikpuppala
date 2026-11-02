import type { ApiResponse, ResumeDownload } from 'types/api'

import { connection } from 'next/server'
import { API_INTERNAL_URL } from 'constants/api-internal-url'
import { DOWNLOAD_UNAVAILABLE_HASH } from 'constants/resume'

const redirect = (location: string) =>
	new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store' } })

const UNAVAILABLE = `/resume#${DOWNLOAD_UNAVAILABLE_HASH}`

export const GET = async (request: Request) => {
	await connection()

	// A Link click first fetches this route through Next's router (rsc header); answering that with
	// an empty 204 means only the real page load counts a download.
	if (request.headers.has('rsc'))
		return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

	try {
		// The last address is the one added by our own proxy; earlier entries can be forged by the
		// client.
		const clientIp = request.headers.get('x-forwarded-for')?.split(',').pop()?.trim()
		const userAgent = request.headers.get('user-agent')

		const res = await fetch(`${API_INTERNAL_URL}/api/v1/resume/download`, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				...(clientIp && { 'X-Forwarded-For': clientIp }),
				...(userAgent && { 'User-Agent': userAgent }),
			},
		})

		if (!res.ok) return redirect(UNAVAILABLE)

		const body = (await res.json()) as ApiResponse<ResumeDownload>

		return redirect(body.result?.url || UNAVAILABLE)
	} catch {
		return redirect(UNAVAILABLE)
	}
}
