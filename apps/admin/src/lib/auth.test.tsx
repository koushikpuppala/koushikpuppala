import type { ReactNode } from 'react'

import { AuthProvider, useAuth } from 'lib/auth'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace: vi.fn() }) }))

const adminFetch = vi.fn()
vi.mock('lib/api-client', () => ({ adminFetch: (...args: unknown[]) => adminFetch(...args) }))
vi.mock('lib/firebase', () => ({ getFirebaseAuth: () => ({}) }))

let authListener: (user: object | null) => Promise<void> = async () => {}
const signOut = vi.fn()
const signInWithEmailAndPassword = vi.fn()
vi.mock('firebase/auth', () => ({
	GoogleAuthProvider: class {},
	signInWithPopup: vi.fn(),
	signOut: () => signOut(),
	signInWithEmailAndPassword: (...args: unknown[]) => signInWithEmailAndPassword(...args),
	onAuthStateChanged: (_auth: unknown, listener: typeof authListener) => {
		authListener = listener
		return () => {}
	},
}))

const serverUser = (role: string) => ({
	data: { id: 'u1', email: 'kp@example.com', displayName: 'KP', role },
	error: null,
})

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

describe('AuthProvider', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		signInWithEmailAndPassword.mockResolvedValue({})
	})

	it.each(['ADMIN', 'EDITOR'])('lets an %s into the studio', async role => {
		adminFetch.mockResolvedValue(serverUser(role))
		const { result } = renderHook(useAuth, { wrapper })

		await act(() => result.current.login('kp@example.com', 'pw'))

		expect(adminFetch).toHaveBeenCalledWith('/api/v1/auth/login', { method: 'POST' })
		expect(result.current.user).toMatchObject({ id: 'u1', role })
		expect(push).toHaveBeenCalledWith('/')
	})

	it('refuses a USER account and signs it out again', async () => {
		adminFetch.mockResolvedValue(serverUser('USER'))
		const { result } = renderHook(useAuth, { wrapper })

		await expect(act(() => result.current.login('kp@example.com', 'pw'))).rejects.toThrow(
			'does not have access',
		)

		expect(signOut).toHaveBeenCalled()
		expect(result.current.user).toBeNull()
		expect(push).not.toHaveBeenCalled()
	})

	it('surfaces the API error when the login call fails', async () => {
		adminFetch.mockResolvedValue({ data: null, error: 'Your account is inactive.' })
		const { result } = renderHook(useAuth, { wrapper })

		await expect(act(() => result.current.login('kp@example.com', 'pw'))).rejects.toThrow(
			'Your account is inactive.',
		)
	})

	it('does not race /auth/me while an explicit sign in registers the user', async () => {
		adminFetch.mockResolvedValue(serverUser('ADMIN'))
		signInWithEmailAndPassword.mockImplementation(async () => authListener({ uid: 'f1' }))
		const { result } = renderHook(useAuth, { wrapper })

		await act(() => result.current.login('kp@example.com', 'pw'))

		const endpoints = adminFetch.mock.calls.map(([endpoint]) => endpoint)
		expect(endpoints).toEqual(['/api/v1/auth/login'])
	})

	it('restores the session from /auth/me on reload', async () => {
		adminFetch.mockResolvedValue(serverUser('EDITOR'))
		const { result } = renderHook(useAuth, { wrapper })

		await act(() => authListener({ uid: 'f1' }))

		await waitFor(() => expect(result.current.loading).toBe(false))
		expect(adminFetch).toHaveBeenCalledWith('/api/v1/auth/me', { method: 'GET' })
		expect(result.current.user?.role).toBe('EDITOR')
	})

	it('moves through the startup stages while restoring a session', async () => {
		let resolveMe: (value: unknown) => void = () => {}
		adminFetch.mockReturnValue(new Promise(resolve => (resolveMe = resolve)))
		const { result } = renderHook(useAuth, { wrapper })

		expect(result.current.stage).toBe('session')

		act(() => {
			void authListener({ uid: 'f1' })
		})
		await waitFor(() => expect(result.current.stage).toBe('access'))

		await act(async () => resolveMe(serverUser('ADMIN')))
		await waitFor(() => expect(result.current.stage).toBe('ready'))
	})

	it('keeps the reason when a restored session is refused', async () => {
		adminFetch.mockResolvedValue(serverUser('USER'))
		const { result } = renderHook(useAuth, { wrapper })

		await act(() => authListener({ uid: 'f1' }))

		await waitFor(() => expect(result.current.stage).toBe('signed-out'))
		expect(result.current.accessError).toMatch('does not have access')
		expect(signOut).toHaveBeenCalled()
	})

	it('is signed out when there is no saved session', async () => {
		const { result } = renderHook(useAuth, { wrapper })

		await act(() => authListener(null))

		expect(result.current.stage).toBe('signed-out')
		expect(result.current.accessError).toBeNull()
	})
})
