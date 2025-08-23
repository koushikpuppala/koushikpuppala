import { prisma } from 'prisma'
import { Result } from 'lib/result'

export const GET = async () => {
	try {
		const start = performance.now()

		const ping = await prisma.$runCommandRaw({ ping: 1 })

		const latency = performance.now() - start

		const result = Result.success('Server health check successful.', 'HealthCheck/GET', {
			ping: typeof ping?.ok === 'number' && ping.ok === 1,
			latency: latency.toFixed(2) + ' ms',
			timestamp: new Date().toISOString(),
		})

		return Response.json(result, { status: result.code })
	} catch (error) {
		const result = Result.serviceUnavailable(
			'Server health check failed.',
			'HealthCheck/GET',
			error as Error,
		)

		return Response.json(result, { status: result.code })
	}
}
