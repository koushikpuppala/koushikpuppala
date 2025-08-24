'use server'

import { prisma } from 'prisma'
import { logger } from 'lib/logger'
import { Result } from 'lib/result'
import { getCookie } from 'lib/cookies'
import { adminAuth } from 'firebase/admin'
import { COOKIE_NAME } from 'constants/cookies'

export const revokeSession = async (functionName: string) => {
	try {
		const token = await getCookie(COOKIE_NAME)

		if (!token) return Result.unauthorized('Session token is required', functionName)

		logger.info('Revoking session', functionName, { token: token.slice(0, 10) + '...' })

		const decodedToken = await adminAuth.verifyIdToken(token, true)

		if (!decodedToken) return Result.unauthorized('Invalid session token', functionName)

		logger.info('Session token decoded successfully', functionName, { decodedToken })

		const { uid, email } = decodedToken

		const user = await prisma.user.findUnique({ where: { uid } })

		if (!user || user.deletedAt) return Result.notFound('User not found', functionName)

		await prisma.session.updateMany({
			where: { token, revoked: false },
			data: { revoked: true, revokedAt: new Date(), revokedBy: user.firstName },
		})

		logger.info('Session revoked successfully', functionName, { uid, email })

		return Result.noContent('Session revoked successfully', functionName)
	} catch (error) {
		logger.error('Failed to revoke session', functionName, error as Error)

		return Result.internalServerError('Failed to revoke session', functionName, error as Error)
	}
}

export const revokeAllSessions = async (functionName: string) => {
	try {
		const token = await getCookie(COOKIE_NAME)

		if (!token) return Result.unauthorized('Session token is required', functionName)

		logger.info('Revoking all sessions', functionName, { token: token.slice(0, 10) + '...' })

		const decodedToken = await adminAuth.verifyIdToken(token, true)

		if (!decodedToken) return Result.unauthorized('Invalid session token', functionName)

		logger.info('Session token decoded successfully', functionName, { decodedToken })

		const { uid, email } = decodedToken

		const user = await prisma.user.findUnique({ where: { uid } })

		if (!user || user.deletedAt) return Result.notFound('User not found', functionName)

		await adminAuth.revokeRefreshTokens(uid)

		await prisma.session.updateMany({
			where: { userId: user.id, revoked: false },
			data: { revoked: true, revokedAt: new Date(), revokedBy: user.firstName },
		})

		logger.info('All sessions revoked successfully', functionName, { uid, email })

		return Result.noContent('All sessions revoked successfully', functionName)
	} catch (error) {
		logger.error('Failed to revoke all sessions', functionName, error as Error)

		return Result.internalServerError('Failed to revoke all sessions', functionName, error as Error)
	}
}
