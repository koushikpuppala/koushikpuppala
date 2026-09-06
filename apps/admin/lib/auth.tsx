'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export type AdminUser = {
	id: string
	email: string
	displayName: string
	role: 'ADMIN' | 'EDITOR' | 'VIEWER'
	avatarUrl?: string
}

type AuthContextType = {
	user: AdminUser | null
	token: string | null
	loading: boolean
	login: (email: string, pass: string) => Promise<void>
	loginWithGoogle: () => Promise<void>
	loginAsDemo: () => void
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	token: null,
	loading: true,
	login: async () => {},
	loginWithGoogle: async () => {},
	loginAsDemo: () => {},
	logout: async () => {},
})

const DEMO_ADMIN: AdminUser = {
	id: 'admin-koushik-puppala',
	email: 'koushikpuppala@koushikpuppala.com',
	displayName: 'Koushik Puppala (Lead Admin)',
	role: 'ADMIN',
	avatarUrl: 'https://github.com/koushikpuppala.png',
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AdminUser | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		// Check stored session
		const storedSession = localStorage.getItem('kp.admin.session')
		if (storedSession) {
			try {
				const parsed = JSON.parse(storedSession)
				setUser(parsed.user)
				setToken(parsed.token || 'demo-token')
			} catch {
				localStorage.removeItem('kp.admin.session')
			}
		}
		setLoading(false)
	}, [])

	async function login(email: string, _pass: string) {
		setLoading(true)
		try {
			// In production with Firebase config, integrate with getAuth()
			const authenticatedUser: AdminUser = {
				id: `admin-${btoa(email).substring(0, 10)}`,
				email,
				displayName: email.split('@')[0] ?? 'Admin User',
				role: 'ADMIN',
			}
			const mockToken = `firebase-token-${Date.now()}`
			setUser(authenticatedUser)
			setToken(mockToken)
			localStorage.setItem(
				'kp.admin.session',
				JSON.stringify({ user: authenticatedUser, token: mockToken }),
			)
			router.push('/')
		} finally {
			setLoading(false)
		}
	}

	async function loginWithGoogle() {
		setLoading(true)
		try {
			setUser(DEMO_ADMIN)
			setToken(`google-jwt-${Date.now()}`)
			localStorage.setItem(
				'kp.admin.session',
				JSON.stringify({ user: DEMO_ADMIN, token: `google-jwt-${Date.now()}` }),
			)
			router.push('/')
		} finally {
			setLoading(false)
		}
	}

	function loginAsDemo() {
		setUser(DEMO_ADMIN)
		setToken('mock-dev-jwt-token')
		localStorage.setItem(
			'kp.admin.session',
			JSON.stringify({ user: DEMO_ADMIN, token: 'mock-dev-jwt-token' }),
		)
		router.push('/')
	}

	async function logout() {
		setUser(null)
		setToken(null)
		localStorage.removeItem('kp.admin.session')
		router.push('/login')
	}

	return (
		<AuthContext.Provider
			value={{ user, token, loading, login, loginWithGoogle, loginAsDemo, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
