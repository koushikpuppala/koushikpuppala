import { Prisma } from '@repo/prisma'

const TRANSIENT_PRISMA_ERRORS = [
	'P1001', // Can't reach database server
	'P1002', // The database server was reached but the connection timed out
	'P1008', // Operations timed out
	'P1017', // Server closed connection
]

export const withPrismaRetry = async <T>(
	fn: () => Promise<T>,
	retries = 3,
	delay = 500,
): Promise<T> => {
	let attempt = 0
	while (attempt < retries) {
		try {
			return await fn()
		} catch (error) {
			attempt++
			const isTransient =
				error instanceof Prisma.PrismaClientKnownRequestError &&
				TRANSIENT_PRISMA_ERRORS.includes(error.code)

			const isConnectionError =
				error instanceof Error &&
				(error.message.includes("Can't reach database server") ||
					error.message.includes('connection timeout') ||
					error.message.includes('Connection closed'))

			if ((isTransient || isConnectionError) && attempt < retries) {
				const backoff = delay * 2 ** (attempt - 1)
				await new Promise(resolve => setTimeout(resolve, backoff))
				continue
			}
			throw error
		}
	}
	return fn()
}
