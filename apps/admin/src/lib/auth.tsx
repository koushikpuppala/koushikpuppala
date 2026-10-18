'use client'

import type { AuthContextValue, AuthStage, AuthUserResponse, SessionUser } from 'types/auth'
import type { ChildrenProps } from 'types/components'
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { adminFetch } from 'lib/api-client'
import { getFirebaseAuth } from 'lib/firebase'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const AuthContext = createContext<AuthContextValue>({
	user: null,
	loading: true,
	stage: 'session',
	accessError: null,
	login: async () => {},
	loginWithGoogle: async () => {},
	logout: async () => {},
})

// The server enforces roles on every request; this check only keeps other users out of the UI.
const STUDIO_ROLES: ReadonlyArray<SessionUser['role']> = ['ADMIN', 'EDITOR']

const toAdminUser = (user: AuthUserResponse): SessionUser => {
	if (!user.id || !user.role || !STUDIO_ROLES.includes(user.role))
		throw new Error('Your account does not have access to the Content Studio.')

	return {
		id: user.id,
		email: user.email,
		role: user.role,
		avatarUrl: user.photoUrl,
		displayName: user.displayName || user.email,
	}
}

const loadServerUser = async (endpoint: '/api/v1/auth/login' | '/api/v1/auth/me') => {
	const res = await adminFetch<AuthUserResponse>(endpoint, {
		method: endpoint === '/api/v1/auth/login' ? 'POST' : 'GET',
	})

	if (!res.data) throw new Error(res.error || 'Unable to verify your account with the server.')

	return toAdminUser(res.data)
}

export const AuthProvider = ({ children }: ChildrenProps) => {
	const [user, setUser] = useState<SessionUser | null>(null)
	const [loading, setLoading] = useState(true)
	const [stage, setStage] = useState<AuthStage>('session')
	const [accessError, setAccessError] = useState<string | null>(null)
	const router = useRouter()
	const signingIn = useRef(false)

	useEffect(() => {
		const auth = getFirebaseAuth()

		return onAuthStateChanged(auth, async firebaseUser => {
			// During an explicit sign-in, completeSignIn calls /auth/login itself, so skip the /auth/me check.
			if (signingIn.current) return

			if (!firebaseUser) {
				setUser(null)
				setStage('signed-out')
				setLoading(false)
				return
			}

			setStage('access')

			try {
				setUser(await loadServerUser('/api/v1/auth/me'))
				setAccessError(null)
				setStage('ready')
			} catch (error) {
				setUser(null)
				setAccessError(
					error instanceof Error ? error.message : 'Your session could not be verified.',
				)
				setStage('signed-out')
				// Signed in with Firebase but rejected by the API: sign out so the user is not stuck half signed in.
				await signOut(auth)
			} finally {
				setLoading(false)
			}
		})
	}, [])

	const completeSignIn = async () => {
		try {
			setUser(await loadServerUser('/api/v1/auth/login'))
			setAccessError(null)
			setStage('ready')
			router.push('/')
		} catch (error) {
			await signOut(getFirebaseAuth())
			setUser(null)
			throw error
		}
	}

	const signInWith = async (provider: () => Promise<unknown>) => {
		signingIn.current = true
		setLoading(true)
		try {
			await provider()
			await completeSignIn()
		} finally {
			signingIn.current = false
			setLoading(false)
		}
	}

	const login = async (email: string, pass: string) => {
		await signInWith(() => signInWithEmailAndPassword(getFirebaseAuth(), email, pass))
	}

	const loginWithGoogle = async () => {
		await signInWith(() => signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider()))
	}

	const logout = async () => {
		// Revoke the session on the server first, while the ID token is still available to send.
		await adminFetch('/api/v1/auth/logout', { method: 'POST' })
		await signOut(getFirebaseAuth())
		setUser(null)
		setStage('signed-out')
		router.push('/login')
	}

	return (
		<AuthContext.Provider
			value={{ user, loading, stage, accessError, login, loginWithGoogle, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
