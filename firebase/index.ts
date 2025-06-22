import { getStorage } from 'firebase/storage'
import { getApp, initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { firebaseAdminConfig, firebaseConfig } from './config'
import { logger } from '@import/lib'
import * as admin from 'firebase-admin'

try {
	admin.initializeApp(firebaseAdminConfig, 'koushikpuppala-admin')

	logger.info('Firebase Admin Initialized', 'Firebase/AdminInitialize')
} catch (error) {
	logger.error('Firebase Admin Initialization Error', 'Firebase/AdminInitialize', error as Error)
}

try {
	initializeApp(firebaseConfig, 'koushikpuppala')
	logger.info('Firebase App Initialized', 'Firebase/InitializeApp')
} catch (error) {
	logger.error('Firebase App Initialization Error', 'Firebase/InitializeApp', error as Error)
}

export const app = getApp('koushikpuppala')

export const auth = getAuth(app)

export const storage = getStorage(app)

export const analytics = getAnalytics(app)

export const adminApp = admin.app('koushikpuppala-admin')

export const adminAuth = admin.auth(adminApp)
