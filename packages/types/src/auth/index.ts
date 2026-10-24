import type { AuthProvider, UserRole, UserStatus } from '../enums/index'

export type RequestContext = {
	ip: string
	host: string
	origin: string
	protocol: string
	language: string
	userAgent: string
}

export type AuthenticatedUser = {
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

export type AuthUserResponse = Pick<
	AuthenticatedUser,
	'id' | 'email' | 'displayName' | 'role' | 'photoUrl'
>

export type SessionUser = {
	id: string
	email: string
	displayName: string
	role: UserRole
	avatarUrl?: string
}

export type AuthStage = 'session' | 'access' | 'ready' | 'signed-out'

export type AuthContextValue = {
	user: SessionUser | null
	loading: boolean
	stage: AuthStage
	accessError: string | null
	login: (email: string, pass: string) => Promise<void>
	loginWithGoogle: () => Promise<void>
	logout: () => Promise<void>
}
