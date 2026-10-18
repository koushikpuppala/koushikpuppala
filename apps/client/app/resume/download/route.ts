import type { ApiResponse, ResumeDownload } from 'types/api'

import { connection } from 'next/server'
import { BASE_URL } from 'constants/base-url'

const redirect = (location: string) =>
	new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store' } })

// The API counts the download and returns a 60 second signed S3 link that saves the PDF under its
// proper name. Any failure (no published resume, missing file, API down) sends the visitor back to
// /resume, which explains that the file isn't available.
export const GET = async () => {
	await connection()

	try {
		const res = await fetch(`${BASE_URL}/api/v1/resume/download`, {
			method: 'POST',
			cache: 'no-store',
		})

		if (!res.ok) return redirect('/resume')

		const body = (await res.json()) as ApiResponse<ResumeDownload>

		return redirect(body.result?.url || '/resume')
	} catch {
		return redirect('/resume')
	}
}
