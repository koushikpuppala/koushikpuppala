import type { User } from '@repo/prisma'
import type { DecodedIdToken } from 'firebase-admin/auth'

import { AuthProvider } from '@repo/prisma'
import type { UserRecord } from 'types/api'
import type { AuthenticatedUser } from 'types/auth'
import type { NameParts } from 'types/server'

// Everything after the first word is treated as the last name.
export const splitName = (name?: string): NameParts => {
	if (!name) return { firstName: '', lastName: '' }

	const parts = name.trim().split(/\s+/)

	return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') }
}

export const toUserRecord = (user: User): UserRecord => ({
	id: user.id,
	email: user.email,
	name: user.displayName,
	role: user.role,
	status: user.status,
	createdAt: user.createdAt,
})

export const toAuthenticatedUser = (user: User): AuthenticatedUser => ({
	id: user.id,
	role: user.role,
	email: user.email,
	status: user.status,
	provider: user.provider,
	firebaseUid: user.firebaseUid,
	emailVerified: user.emailVerified,
	photoUrl: user.photoUrl ?? undefined,
	displayName: user.displayName ?? undefined,
})

export const fromFirebaseToken = (decoded: DecodedIdToken): AuthenticatedUser => ({
	firebaseUid: decoded.uid,
	email: decoded.email ?? '',
	displayName: decoded.name,
	photoUrl: decoded.picture,
	emailVerified: decoded.email_verified ?? false,
	provider:
		decoded.firebase.sign_in_provider === 'google.com'
			? AuthProvider.GOOGLE
			: AuthProvider.PASSWORD,
})
