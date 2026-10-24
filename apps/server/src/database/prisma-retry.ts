import { Prisma } from '@repo/prisma'

// Can't reach server, server timed out, operation timed out, server closed the connection.
const TRANSIENT_PRISMA_ERRORS = ['P1001', 'P1002', 'P1008', 'P1017']

// Retries only connection-level failures with exponential backoff (500ms, 1s, ...).
// Query errors such as constraint violations are rethrown immediately.
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
