'use client'

import {
	GoogleAuthProvider,
	User,
	inMemoryPersistence,
	onAuthStateChanged,
	onIdTokenChanged,
	setPersistence,
	signInWithPopup,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextProps, RootLayoutProps } from '@import/types'
import { removeCookie, setCookie } from '@import/lib'
import { LoadingComponent } from '@import/components'
import { auth } from '@import/firebase'
import { COOKIE_NAME } from '@import/constants'

const AuthContext = createContext<AuthContextProps>({
	currentUser: null,
	token: null,
	userAuthLoading: true,
	login: () => new Promise<User>(() => {}),
	logout: () => new Promise<void>(() => {}),
})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({ children }: RootLayoutProps) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const [userAuthLoading, setUserAuthLoading] = useState(true)
	const forceRefresh = true

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
			if (user) setToken(await user.getIdToken(forceRefresh))
			else setToken(null)

			setCurrentUser(user)
			setUserAuthLoading(false)
		})

		return unsubscribe
	}, [])

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async user => {
			if (user) setToken(await user.getIdToken(forceRefresh))
			else setToken(null)

			setCurrentUser(user)
		})

		return unsubscribe
	}, [])

	useEffect(() => {
		if (token) setCookie(COOKIE_NAME, token)
		else removeCookie(COOKIE_NAME)
	}, [token])

	const login: AuthContextProps['login'] = async () => {
		await setPersistence(auth, inMemoryPersistence)
		const provider = new GoogleAuthProvider()
		const { user } = await signInWithPopup(auth, provider)

		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${await user.getIdToken(forceRefresh)}`,
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
