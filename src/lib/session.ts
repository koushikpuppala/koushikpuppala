'use server'

import type { DecodedIdToken } from 'firebase-admin/auth'

import { prisma } from 'prisma'
import { logger } from './logger'
import { Result } from './result'
import { getCookie } from './cookies'
import { adminAuth } from 'firebase/admin'
import { COOKIE_NAME } from 'constants/cookies'

export const verifySession = async (functionName: string) => {
	try {
		const token = await getCookie(COOKIE_NAME)

		if (!token) return Result.unauthorized('Session token is required', functionName)

		logger.info('Verifying session', functionName, { token: token.slice(0, 10) + '...' })

		const decodedToken = await adminAuth.verifyIdToken(token, true)

		if (!decodedToken) return Result.unauthorized('Invalid session token', functionName)

		logger.info('Session token decoded successfully', functionName, { decodedToken })

		const { uid } = decodedToken

		const user = await prisma.user.findUnique({ where: { uid } })

		if (!user || user.deletedAt || user.role !== 'ADMIN')
			return Result.forbidden('User is not an admin or has been deleted', functionName)

		const session = await handleSession(functionName, token, decodedToken)

		if (session.error) return session

		logger.info('Session verified successfully', functionName, { user })

		return Result.noContent('Session token is valid', functionName)
	} catch (error) {
		logger.error('Failed to verify session', functionName, error as Error)

		if ((error as { code?: string })?.code === 'auth/id-token-revoked')
			return Result.unauthorized('Session revoked. Please log in again.', functionName)

		return Result.unauthorized('Failed to verify session token', functionName, error as Error)
	}
}

export const handleSession = async (
	functionName: string,
	token: string,
	decodedToken: DecodedIdToken,
) => {
	try {
		const { uid } = decodedToken

		const user = await prisma.user.findFirst({ where: { uid, deletedAt: null } })

		if (!user) return Result.notFound('User not found', functionName)

		const session = await prisma.session.upsert({
			where: { token, revoked: false, expiresAt: { gt: new Date() } },
			update: { updatedAt: new Date() },
			create: {
				token,
				userId: user?.id,
				issuedAt: new Date(decodedToken.iat * 1000),
				expiresAt: new Date(decodedToken.exp * 1000),
			},
		})

		if (!session) {
			logger.warn('Session invalid', functionName, { token: token.slice(0, 10) + '...' })
			return Result.unauthorized('Session is expired or revoked', functionName)
		}

		logger.info('Session token decoded successfully', functionName, { decodedToken, session })

		return Result.noContent('Session handled successfully', functionName)
	} catch (error) {
		logger.error('Failed to handle session', functionName, error as Error)

		return Result.internalServerError('Failed to handle session', functionName, error as Error)
	}
}
