import { getAuth } from 'firebase/auth'
import { firebaseConfig } from './config'
import { getStorage } from 'firebase/storage'
import { getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

export const app =
	getApps().find(app => app.name === 'koushikpuppala') ??
	initializeApp(firebaseConfig, 'koushikpuppala')

export const auth = getAuth(app)

export const storage = getStorage(app)

export const analytics =
	typeof window !== 'undefined' && (await isSupported()) ? getAnalytics(app) : null
