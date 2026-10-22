import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sdk = vi.hoisted(() => ({
	apps: [] as unknown[],
	initializeApp: vi.fn((options: unknown) => ({ options })),
	getApp: vi.fn(() => ({ existing: true })),
	auth: { currentUser: null as null | { getIdToken: () => Promise<string> } },
	getAuth: vi.fn(),
	connectAuthEmulator: vi.fn(),
}))

vi.mock('firebase/app', () => ({
	getApps: () => sdk.apps,
	getApp: sdk.getApp,
	initializeApp: sdk.initializeApp,
}))
vi.mock('firebase/auth', () => ({
	getAuth: sdk.getAuth.mockImplementation(() => sdk.auth),
	connectAuthEmulator: sdk.connectAuthEmulator,
}))

const ENV = {
	NEXT_PUBLIC_FIREBASE_API_KEY: 'key',
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
	NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'example',
	NEXT_PUBLIC_FIREBASE_APP_ID: 'app',
}

// The module caches the Auth instance, so each test loads a fresh copy.
const load = async () => {
	vi.resetModules()
	return import('./firebase')
}

describe('firebase', () => {
	beforeEach(() => {
		sdk.apps = []
		sdk.auth.currentUser = null
		sdk.initializeApp.mockClear()
		sdk.getApp.mockClear()
		sdk.connectAuthEmulator.mockClear()
		for (const [key, value] of Object.entries(ENV)) vi.stubEnv(key, value)
	})

	afterEach(() => vi.unstubAllEnvs())

	it('creates the app from the environment once and reuses the Auth instance', async () => {
		const { getFirebaseAuth } = await load()

		const first = getFirebaseAuth()
		const second = getFirebaseAuth()

		expect(first).toBe(second)
		expect(sdk.initializeApp).toHaveBeenCalledTimes(1)
		expect(sdk.initializeApp).toHaveBeenCalledWith({
			apiKey: 'key',
			authDomain: 'example.firebaseapp.com',
			projectId: 'example',
			appId: 'app',
		})
		expect(sdk.connectAuthEmulator).not.toHaveBeenCalled()
	})

	it('reuses an app that already exists', async () => {
		sdk.apps = [{}]
		const { getFirebaseAuth } = await load()

		getFirebaseAuth()

		expect(sdk.getApp).toHaveBeenCalled()
		expect(sdk.initializeApp).not.toHaveBeenCalled()
	})

	it('connects to the Auth emulator when its host is set', async () => {
		vi.stubEnv('NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099')
		const { getFirebaseAuth } = await load()

		getFirebaseAuth()

		expect(sdk.connectAuthEmulator).toHaveBeenCalledWith(sdk.auth, 'http://127.0.0.1:9099', { disableWarnings: true })
	})

	it('names every missing setting when Firebase is not configured', async () => {
		vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', '')
		const { getFirebaseAuth } = await load()

		expect(() => getFirebaseAuth()).toThrow(/NEXT_PUBLIC_FIREBASE_APP_ID/)
	})

	it('returns the signed in user token, or null when signed out', async () => {
		const { getIdToken } = await load()

		expect(await getIdToken()).toBeNull()

		sdk.auth.currentUser = { getIdToken: async () => 'token-1' }
		expect(await getIdToken()).toBe('token-1')
	})
})
