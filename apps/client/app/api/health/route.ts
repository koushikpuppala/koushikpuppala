import { connection, NextResponse } from 'next/server'

export const GET = async () => {
	await connection()

	return NextResponse.json(
		{ status: 'ok', uptime: Math.round(process.uptime()) },
		{ headers: { 'Cache-Control': 'no-store' } },
	)
}
