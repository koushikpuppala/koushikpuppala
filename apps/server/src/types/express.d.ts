import 'multer'
import 'express-serve-static-core'

import type { AuthProvider, UserRole, UserStatus } from '@repo/prisma'

import { DecodedIdToken } from 'firebase-admin/auth'

export interface RequestContext {
	ip: string
	host: string
	origin: string
	protocol: string
	language: string
	userAgent: string
}

export interface AuthenticatedUser {
	id?: string
	email: string
	role?: UserRole
	photoUrl?: string
	status?: UserStatus
	firebaseUid: string
	displayName?: string
	provider: AuthProvider
	emailVerified: boolean
}

declare global {
	namespace Express {
		interface Request {
			token?: string
			requestId: string
			startTime: number
			context: RequestContext
			user?: AuthenticatedUser
			decodedToken?: DecodedIdToken
		}
	}
}
