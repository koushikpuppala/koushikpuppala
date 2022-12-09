import {
	GoogleAuthProvider,
	signInWithPopup,
	getAuth,
	GithubAuthProvider,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	Auth,
	User,
	UserCredential,
} from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { AuthServiceType } from '@import/types/authentication'
import { config } from '@import/config'

if (!getApps().length) {
	initializeApp(config.firebaseConfig)
	if (typeof window !== 'undefined') {
		if ('measurementId' in config.firebaseConfig) {
			getAnalytics(initializeApp(config.firebaseConfig))
		}
	}
}

const auth: Auth = getAuth()

export const AuthService: AuthServiceType = {
	google: async (): Promise<User> => {
		const provider: GoogleAuthProvider = new GoogleAuthProvider()
		const userCredential: UserCredential = await signInWithPopup(auth, provider)
		return userCredential.user
	},
	github: async (): Promise<User> => {
		const provider: GithubAuthProvider = new GithubAuthProvider()
		const userCredential: UserCredential = await signInWithPopup(auth, provider)
		return userCredential.user
	},
	signIn: async (email: string, password: string): Promise<User> => {
		const userCredential: UserCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		)
		return userCredential.user
	},
	signUp: async (email: string, password: string): Promise<User> => {
		const userCredential: UserCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		)
		return userCredential.user
	},
	logout: async (): Promise<void> => {
		await auth.signOut()
	},
}
