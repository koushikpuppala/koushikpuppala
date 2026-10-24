import type { ApiResponse, ResumeDownload } from 'types/api'

import { connection } from 'next/server'
import { API_INTERNAL_URL } from 'constants/api-internal-url'
import { DOWNLOAD_UNAVAILABLE_HASH } from 'constants/resume'

const redirect = (location: string) =>
	new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store' } })

const UNAVAILABLE = `/resume#${DOWNLOAD_UNAVAILABLE_HASH}`

// The API counts the download and returns a 60 second signed S3 link that saves the PDF under its
// proper name. Any failure (no published resume, missing file, API down) sends the visitor back to
// /resume with a hash that makes the page explain the file isn't available.
export const GET = async (request: Request) => {
	await connection()

	// A Link click first fetches this route through Next's router (marked with an `rsc` header) and
	// then loads it for real. Answering the router fetch with an empty 204 makes it fall back to that
	// one real page load, so each click counts a single download.
	if (request.headers.has('rsc'))
		return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

	try {
		// Same as the contact route: the last address is the one our own proxy added, and passing it on
		// lets the API log and rate limit the visitor rather than this server.
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
