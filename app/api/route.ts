import { RESPONSE_CODES } from 'enums'
import { Result } from 'lib/result'
import { prisma } from 'prisma'

export const POST = async () => {
	try {
		const ping = await prisma.$runCommandRaw({ ping: 1 })

		const result = Result.success('Server health check successful.', 'HealthCheck/POST', {
			ping: typeof ping?.ok === 'number' && ping.ok === 1,
			timestamp: new Date().toISOString(),
		})

		return Response.json(result, { status: RESPONSE_CODES.SUCCESS })
	} catch (error) {
		const result = Result.serviceUnavailable(
			'Server health check failed.',
			'HealthCheck/POST',
			error as Error,
		)

		return Response.json(result, { status: result.code })
	}
}
