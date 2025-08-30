import { getAuth } from 'firebase/auth'
import { firebaseConfig } from './config'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { getApps, initializeApp } from 'firebase/app'

export const app =
	getApps().find(app => app.name === 'koushikpuppala') ??
	initializeApp(firebaseConfig, 'koushikpuppala')

export const auth = getAuth(app)

export const storage = getStorage(app)

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
