import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'

const createFirebaseApp = (): FirebaseApp => {
	if (getApps().length > 0) return getApp()

	const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
	const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
	const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
	const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

	if (!apiKey || !authDomain || !projectId || !appId)
		throw new Error(
			'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_APP_ID.',
		)

	return initializeApp({ apiKey, authDomain, projectId, appId })
}

// Created lazily on first use in the browser; Firebase Auth cannot run during server rendering.
let auth: Auth | null = null

export const getFirebaseAuth = (): Auth => {
	if (typeof window === 'undefined')
		throw new Error('Firebase Auth is only available in the browser.')

	if (!auth) {
		auth = getAuth(createFirebaseApp())

		// Set in the test stack so sign-in runs against the local Firebase Auth emulator.
		const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
		if (emulatorHost) connectAuthEmulator(auth, `http://${emulatorHost}`, { disableWarnings: true })
	}

	return auth
}

export const getIdToken = async (): Promise<string | null> => {
	if (typeof window === 'undefined') return null

	const user = getFirebaseAuth().currentUser

	// getIdToken returns the cached token and refreshes it automatically when it is about to expire.
	return user ? user.getIdToken() : null
}
