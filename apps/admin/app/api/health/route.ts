import { connection, NextResponse } from 'next/server'

// Liveness check for the Docker HEALTHCHECK. It deliberately does not call the API, so the
// admin container stays healthy while the API restarts.
export const GET = async () => {
	// Opt out of prerendering so uptime is measured per request.
	await connection()

	return NextResponse.json(
		{ status: 'ok', uptime: Math.round(process.uptime()) },
		{ headers: { 'Cache-Control': 'no-store' } },
	)
}
