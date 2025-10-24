'use client'

import type { User } from 'firebase/auth'
import type { RootLayoutProps } from 'types/app'
import type { AuthContextProps } from 'types/contexts'

import { auth } from 'firebase'
import { usePathname, useRouter } from 'next/navigation'
import { LoadingComponent } from 'components/loading'
import { removeCookie, setCookie } from 'lib/cookies'
import { COOKIE_NAME, EXPIRES_IN } from 'constants/cookies'
import { createContext, useContext, useEffect, useState } from 'react'
import { GoogleAuthProvider, onIdTokenChanged, signInWithPopup } from 'firebase/auth'

const AuthContext = createContext<AuthContextProps>({
	currentUser: null,
	token: null,
	userAuthLoading: true,
	login: () => new Promise<User>(() => {}),
	logout: () => new Promise<void>(() => {}),
})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({ children }: RootLayoutProps) => {
	const pathname = usePathname()
	const router = useRouter()
	const [token, setToken] = useState<string | null>(null)
	const [userAuthLoading, setUserAuthLoading] = useState(true)
	const [currentUser, setCurrentUser] = useState<User | null>(null)

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async user => {
			try {
				const token = await user?.getIdToken(true)

				setCurrentUser(user)
				setToken(token ?? null)

				if (token) setCookie(COOKIE_NAME, token, EXPIRES_IN)
				else removeCookie(COOKIE_NAME)

				if (pathname?.startsWith('/admin') && !user) router.replace('/authentication')

				console.info('User token updated', 'AuthContextProvider/onIdTokenChanged', {
					userId: user?.uid,
				})
			} catch (error) {
				setToken(null)
				setCurrentUser(null)
				removeCookie(COOKIE_NAME)

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
			removeCookie(COOKIE_NAME)
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
