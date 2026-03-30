'use client'

import type { User } from 'firebase/auth'
import type { RootLayoutProps } from 'types/app'
import type { AuthContextProps } from 'types/contexts'

import { auth } from 'firebase'
import { LoadingComponent } from 'components/loading'
import { removeCookie, setCookie } from 'lib/cookies'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SESSION_COOKIE_NAME, EXPIRES_IN } from 'constants/cookies'
import { createContext, useContext, useEffect, useState } from 'react'
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	onIdTokenChanged,
	signInWithPopup,
} from 'firebase/auth'
import { perf } from 'lib/performance'
import { AppFirebaseError } from 'classes/error'

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuthContext = () => {
	const context = useContext(AuthContext)

	if (!context) throw new Error('useAuthContext must be used within a AuthProvider')

	return context
}

export const AuthContextProvider = ({ children }: RootLayoutProps) => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	const [token, setToken] = useState<string | null>(null)
	const [userAuthLoading, setUserAuthLoading] = useState(true)
	const [currentUser, setCurrentUser] = useState<User | null>(null)

	const hydrateSession = async (user: User | null) => {
		perf.start('session-hydration')

		try {
			if (!user)
				throw new AppFirebaseError(
					'auth/user-token-expired',
					'Session expired. Please sign in again.',
				)

			const token = await user?.getIdToken()
		} catch (error) {
		} finally {
			perf.end('session-hydration')
		}
	}

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async user => {
			try {
				const token = await user?.getIdToken(true)

				setCurrentUser(user)
				setToken(token ?? null)

				if (token) setCookie(SESSION_COOKIE_NAME, token, EXPIRES_IN)
				else removeCookie(SESSION_COOKIE_NAME)

				if (pathname?.startsWith('/admin') && !user) router.replace('/authentication')

				console.info('User token updated', 'AuthContextProvider/onIdTokenChanged', {
					userId: user?.uid,
				})
			} catch (error) {
				setToken(null)
				setCurrentUser(null)
				removeCookie(SESSION_COOKIE_NAME)

				console.error(
					'Failed to get user token',
					'AuthContextProvider/onIdTokenChanged',
					error as Error,
				)
			} finally {
				setUserAuthLoading(false)
			}
		})

		return unsubscribe
	}, [pathname, router])

	const login: AuthContextProps['login'] = async () => {
		try {
			const provider = new GoogleAuthProvider()
			const { user } = await signInWithPopup(auth, provider)

			const token = await user.getIdToken()

			const response = await fetch('/user', {
				method: 'POST',
				body: JSON.stringify({ user }),
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			})

			if (!response.ok) throw new Error('Failed to login, please try again.')

			return user
		} catch (error) {
			console.error('Login failed', 'AuthContextProvider/login', error as Error)
			await auth.signOut()
			throw error
		}
	}

	const logout: AuthContextProps['logout'] = async () => {
		try {
			await auth.signOut()

			setToken(null)
			setCurrentUser(null)
			removeCookie(SESSION_COOKIE_NAME)
		} catch (error) {
			console.error('Logout failed', 'AuthContextProvider/logout', error as Error)
			throw error
		}
	}

	const value = { currentUser, token, userAuthLoading, login, logout }

	return (
		<AuthContext.Provider value={value}>
			{userAuthLoading ? <LoadingComponent /> : children}
		</AuthContext.Provider>
	)
}
