'use client'

import type { User } from 'firebase/auth'
import type { RootLayoutProps } from 'types/app'
import type { AuthContextProps } from 'types/contexts'

import { auth } from 'firebase'
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
	const [token, setToken] = useState<string | null>(null)
	const [userAuthLoading, setUserAuthLoading] = useState(true)
	const [currentUser, setCurrentUser] = useState<User | null>(null)

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async user => {
			try {
				setCurrentUser(user)
				setToken((await user?.getIdToken()) ?? null)
				console.info('User token updated', 'AuthContextProvider', { userId: user?.uid })
			} catch (error) {
				setToken(null)
				setCurrentUser(null)
				console.error('Failed to get user token', 'AuthContextProvider', error as Error)
			} finally {
				setUserAuthLoading(false)
			}
		})

		return unsubscribe
	}, [])

	useEffect(() => {
		if (token) setCookie(COOKIE_NAME, token, EXPIRES_IN)
		else removeCookie(COOKIE_NAME)
	}, [token])

	const login: AuthContextProps['login'] = async () => {
		const provider = new GoogleAuthProvider()
		const { user } = await signInWithPopup(auth, provider)

		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${await user.getIdToken()}`,
			},
			body: JSON.stringify({ user }),
		})

		if (!response.ok) {
			await logout()
			throw new Error('Failed to login')
		}

		return user
	}

	const logout: AuthContextProps['logout'] = async () => await auth.signOut()

	const value = {
		currentUser,
		token,
		userAuthLoading,
		login,
		logout,
	}

	return (
		<AuthContext.Provider value={value}>
			{userAuthLoading ? <LoadingComponent /> : children}
		</AuthContext.Provider>
	)
}
